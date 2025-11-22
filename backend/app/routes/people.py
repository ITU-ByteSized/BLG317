from flask import Blueprint, request, jsonify
from backend.app.utils.db_utils import get_db_connection

bp = Blueprint("people", __name__, url_prefix="/api")

@bp.route("/people", methods=["GET"])
def search_people():
    q = request.args.get("search", "").strip()
    conn = get_db_connection()
    if conn is None:
        return jsonify([])

    try:
        cursor = conn.cursor(dictionary=True)
        sql = "SELECT person_id, primary_name, birth_year, death_year FROM people WHERE 1=1"
        params = []
        if q:
            sql += " AND primary_name LIKE %s"
            params.append(f"%{q}%")
        sql += " LIMIT 50"
        
        cursor.execute(sql, tuple(params))
        rows = cursor.fetchall()
        return jsonify(rows)
    except Exception as e:
        print(f"People search error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@bp.route("/people/<person_id>", methods=["GET"])
def get_person(person_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({}), 404

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM people WHERE person_id = %s LIMIT 1", (person_id,))
        person = cursor.fetchone()
        
        if not person:
            return jsonify({}), 404

        sql_known = """
            SELECT p.production_id, p.primary_title, p.poster_url, p.start_year, r.average_rating
            FROM cast_members cm
            JOIN productions p ON cm.production_id = p.production_id
            LEFT JOIN ratings r ON p.production_id = r.rating_id
            WHERE cm.person_id = %s
            ORDER BY r.num_votes DESC
            LIMIT 5
        """
        cursor.execute(sql_known, (person_id,))
        known_for = cursor.fetchall()

        return jsonify({
            "person": person,
            "known_for": known_for
        })

    except Exception as e:
        print(f"Person detail error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()