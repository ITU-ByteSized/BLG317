from flask import Blueprint, request, jsonify
from backend.app.utils.db_utils import get_db_connection

bp = Blueprint("comments", __name__, url_prefix="/api")

@bp.route("/movies/<production_id>/comments", methods=["GET"])
def get_comments(production_id):
    current_user_id = request.args.get("user_id")

    conn = get_db_connection()
    if not conn:
        return jsonify([]), 500

    try:
        cursor = conn.cursor(dictionary=True)
        sql = """
            SELECT 
                c.comment_id, c.user_id, c.body, c.created_at, c.parent_id,
                u.username, u.avatar_url,
                (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.comment_id) as like_count,
                (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.comment_id AND cl.user_id = %s) as is_liked
            FROM comments c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.production_id = %s
            ORDER BY c.created_at DESC
        """
        cursor.execute(sql, (current_user_id, production_id))
        rows = cursor.fetchall()

        comment_map = {}
        roots = []

        for row in rows:
            row["replies"] = []
            row["is_liked"] = bool(row["is_liked"])
            comment_map[row["comment_id"]] = row
        
        for row in rows:
            if row["parent_id"]:
                parent = comment_map.get(row["parent_id"])
                if parent:
                    parent["replies"].append(row)
                    parent["replies"].sort(key=lambda x: x["created_at"])
            else:
                roots.append(row)

        return jsonify(roots)
    except Exception as e:
        print(f"Comments Fetch Error: {e}")
        return jsonify({"error": "Failed to fetch comments"}), 500
    finally:
        if conn: conn.close()

@bp.route("/comments/<comment_id>/like", methods=["POST"])
def toggle_like(comment_id):
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Login required"}), 401

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        check_sql = "SELECT 1 FROM comment_likes WHERE user_id = %s AND comment_id = %s"
        cursor.execute(check_sql, (user_id, comment_id))
        exists = cursor.fetchone()

        liked = False
        if exists:
            del_sql = "DELETE FROM comment_likes WHERE user_id = %s AND comment_id = %s"
            cursor.execute(del_sql, (user_id, comment_id))
            liked = False
        else:
            ins_sql = "INSERT INTO comment_likes (user_id, comment_id) VALUES (%s, %s)"
            cursor.execute(ins_sql, (user_id, comment_id))
            liked = True
        
        conn.commit()

        count_sql = "SELECT COUNT(*) FROM comment_likes WHERE comment_id = %s"
        cursor.execute(count_sql, (comment_id,))
        count_res = cursor.fetchone()
        new_count = count_res[0] if count_res else 0

        return jsonify({"success": True, "liked": liked, "new_count": new_count})

    except Exception as e:
        print(f"Like Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@bp.route("/movies/<production_id>/comments", methods=["POST"])
def post_comment(production_id):
    data = request.get_json()
    user_id = data.get("user_id") 
    body = data.get("body")
    parent_id = data.get("parent_id")
    has_spoiler = 1 if "[SPOILER]" in body else 0

    if not body or not user_id:
        return jsonify({"error": "Missing data"}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        sql = """
            INSERT INTO comments (user_id, production_id, body, has_spoiler, parent_id)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (user_id, production_id, body, has_spoiler, parent_id))
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        print(f"Post Comment Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()