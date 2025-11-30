from backend.app.utils.db_utils import get_db_connection

def fetch_home_movies(limit=10):
    conn = get_db_connection()
    if not conn:
        return {}

    result = {"movies": [], "series": [], "episodes": []}
    
    queries = {
        "movies": "SELECT p.*, r.average_rating FROM productions p LEFT JOIN ratings r ON p.production_id = r.rating_id WHERE p.type_id IN (SELECT type_id FROM title_types WHERE type_name IN ('movie', 'tvMovie')) ORDER BY r.average_rating DESC LIMIT %s",
        "series": "SELECT p.*, r.average_rating FROM productions p LEFT JOIN ratings r ON p.production_id = r.rating_id WHERE p.type_id IN (SELECT type_id FROM title_types WHERE type_name IN ('tvSeries', 'tvMiniSeries')) ORDER BY r.average_rating DESC LIMIT %s",
        "episodes": "SELECT p.*, r.average_rating FROM productions p LEFT JOIN ratings r ON p.production_id = r.rating_id WHERE p.type_id IN (SELECT type_id FROM title_types WHERE type_name = 'tvEpisode') ORDER BY r.average_rating DESC LIMIT %s"
    }

    try:
        cursor = conn.cursor(dictionary=True)
        for key, sql in queries.items():
            cursor.execute(sql, (limit,))
            result[key] = cursor.fetchall()
        return result
    except Exception as e:
        print(f"Fetch home error: {e}")
        return result
    finally:
        if conn: conn.close()

def search_movies_db(query, type_filter, limit, offset=0):
    conn = get_db_connection()
    if not conn:
        return [], 0

    base_query = """
        SELECT p.*, r.average_rating, r.num_votes 
        FROM productions p 
        LEFT JOIN ratings r ON p.production_id = r.rating_id
        WHERE 1=1
    """
    params = []

    if query:
        base_query += " AND p.primary_title LIKE %s"
        params.append(f"%{query}%")

    if type_filter and type_filter != "all":
        pass 

    base_query += " ORDER BY r.num_votes DESC LIMIT %s OFFSET %s"
    params.extend([limit, offset])

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(base_query, tuple(params))
        rows = cursor.fetchall()
        
        cursor.execute("SELECT FOUND_ROWS()") 
        
        total = len(rows)
        
        return rows, total
    except Exception as e:
        print(f"Search error: {e}")
        return [], 0
    finally:
        if conn: conn.close()

def fetch_movie_detail_db(production_id):
    conn = get_db_connection()
    if not conn:
        return None

    try:
        cursor = conn.cursor(dictionary=True)
        
        sql_prod = """
            SELECT p.*, r.average_rating, r.num_votes, tt.type_name as type
            FROM productions p
            LEFT JOIN ratings r ON p.production_id = r.rating_id
            LEFT JOIN title_types tt ON p.type_id = tt.type_id
            WHERE p.production_id = %s
        """
        cursor.execute(sql_prod, (production_id,))
        movie = cursor.fetchone()
        
        if not movie:
            return None

        sql_genres = """
            SELECT g.genre_name 
            FROM production_genres pg 
            JOIN genres g ON pg.genre_id = g.genre_id 
            WHERE pg.production_id = %s
        """
        cursor.execute(sql_genres, (production_id,))
        genres = [row['genre_name'] for row in cursor.fetchall()]
        movie['genres'] = genres

        sql_cast = """
            SELECT pm.primary_name as name, cm.characters, cm.person_id
            FROM cast_members cm
            JOIN people pm ON cm.person_id = pm.person_id
            WHERE cm.production_id = %s
            ORDER BY cm.ordering
            LIMIT 10
        """
        cursor.execute(sql_cast, (production_id,))
        movie['cast'] = cursor.fetchall()

        return movie
    except Exception as e:
        print(f"Detail error: {e}")
        return None
    finally:
        if conn: conn.close()