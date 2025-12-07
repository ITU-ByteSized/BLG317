from typing import Dict, List, Any
from backend.app.db.connection import get_db_connection

def get_grouped_awards() -> Dict[str, List[Dict[str, Any]]]:
    conn = get_db_connection()
    if conn is None:
        return {}

    try:
        cursor = conn.cursor(dictionary=True)
        sql = """
            SELECT 
                acer.ceremony_year,
                ac.category_name,
                p.production_id,
                p.primary_title,
                p.poster_url,
                a.detail,
                a.winner
            FROM awards a
            JOIN award_ceremonies acer ON a.ceremony_id = acer.ceremony_id
            JOIN award_categories ac ON a.category_id = ac.category_id
            LEFT JOIN productions p ON a.production_id = p.production_id
            WHERE a.winner = 1
            ORDER BY acer.ceremony_year DESC, ac.category_name ASC
            LIMIT 200
        """
        cursor.execute(sql)
        rows = cursor.fetchall()
        
        grouped_awards = {}
        for row in rows:
            year = row['ceremony_year']
            if year not in grouped_awards:
                grouped_awards[year] = []
            grouped_awards[year].append(row)

        return grouped_awards

    except Exception as e:
        print(f"Service error (get_grouped_awards): {e}")
        return {}
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        try:
            conn.close()
        except Exception:
            pass