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
        cursor.execute("SELECT person_id, primary_name, birth_year, death_year, primary_profession FROM people WHERE person_id = %s LIMIT 1", (person_id,))
        person = cursor.fetchone()

        if not person:
            return jsonify({}), 404

        # Normalize person fields to what frontend expects
        person_obj = {
            "person_id": person.get("person_id"),
            "name": person.get("primary_name"),
            "birth_year": person.get("birth_year"),
            "death_year": person.get("death_year"),
            "professions": [p.strip() for p in person.get("primary_profession", "").split(",") if p.strip()]
        }

        sql_known = """
            SELECT p.production_id, p.primary_title, p.poster_url, p.start_year, r.average_rating, r.num_votes
            FROM cast_members cm
            JOIN productions p ON cm.production_id = p.production_id
            LEFT JOIN ratings r ON p.production_id = r.rating_id
            WHERE cm.person_id = %s
            ORDER BY r.num_votes DESC
            LIMIT 5
        """
        cursor.execute(sql_known, (person_id,))
        known_for_raw = cursor.fetchall() or []

        # Map known_for to frontend-friendly keys
        known_for = [
            {
                "production_id": k.get("production_id"),
                "primary_title": k.get("primary_title"),
                "poster_url": k.get("poster_url"),
                "start_year": k.get("start_year"),
                "average_rating": k.get("average_rating")
            }
            for k in known_for_raw
        ]

        # Simple filmography: recent productions from cast_members
        sql_filmography = """
            SELECT p.production_id, p.primary_title, p.start_year, cm.job_id, j.job_name AS job_name
            FROM cast_members cm
            JOIN productions p ON cm.production_id = p.production_id
            LEFT JOIN jobs j ON cm.job_id = j.job_id
            WHERE cm.person_id = %s
            ORDER BY p.start_year DESC
            LIMIT 50
        """
        try:
            cursor.execute(sql_filmography, (person_id,))
            filmography_raw = cursor.fetchall() or []
        except Exception:
            filmography_raw = []

        filmography = [
            {
                "production_id": f.get("production_id"),
                "primary_title": f.get("primary_title"),
                "year": f.get("start_year"),
                "job": f.get("job_name")
            }
            for f in filmography_raw
        ]

        return jsonify({
            "person": person_obj,
            "known_for": known_for,
            "filmography": filmography
        })

    except Exception as e:
        print(f"Person detail error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()