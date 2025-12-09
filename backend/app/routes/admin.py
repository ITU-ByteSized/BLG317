from flask import Blueprint, jsonify, request
from backend.app.utils.db_utils import get_db_connection

bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@bp.route("/stats", methods=["GET"])
def get_admin_stats():
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database error"}), 500
        
    stats = {
        "total_users": 0,
        "total_movies": 0,
        "total_ratings": 0
    }
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT COUNT(*) as cnt FROM users")
        stats["total_users"] = cursor.fetchone()["cnt"]
        
        cursor.execute("SELECT COUNT(*) as cnt FROM productions")
        stats["total_movies"] = cursor.fetchone()["cnt"]
        
        cursor.execute("SELECT COUNT(*) as cnt FROM user_ratings")
        stats["total_ratings"] = cursor.fetchone()["cnt"]
        
        return jsonify(stats)
    except Exception as e:
        print(f"Admin stats error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()