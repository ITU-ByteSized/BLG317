from backend.app.utils.db_utils import get_db_connection
from backend.app.config.settings import TYPE_GROUPS

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

def search_movies_db(query, type_filter, limit, offset=0, min_year=None, max_year=None, min_rating=None, genre=None):
    conn = get_db_connection()
    if not conn:
        return [], 0

    conditions = ["1=1"]
    params = []

    if query:
        conditions.append("p.primary_title LIKE %s")
        params.append(f"%{query}%")

    if type_filter and type_filter != "all":
        if type_filter in TYPE_GROUPS:
            types = TYPE_GROUPS[type_filter]
            placeholders = ",".join(["%s"] * len(types))
            conditions.append(f"tt.type_name IN ({placeholders})")
            params.extend(types)
    
    if min_year:
        conditions.append("p.start_year >= %s")
        params.append(min_year)
    
    if max_year:
        conditions.append("p.start_year <= %s")
        params.append(max_year)

    if min_rating:
        conditions.append("r.average_rating >= %s")
        params.append(min_rating)

    if genre and genre != "all":
        conditions.append("""
            p.production_id IN (
                SELECT pg.production_id 
                FROM production_genres pg 
                JOIN genres g ON pg.genre_id = g.genre_id 
                WHERE g.genre_name = %s
            )
        """)
        params.append(genre)
    
    where_clause = " AND ".join(conditions)

    try:
        cursor = conn.cursor(dictionary=True)

        count_sql = f"""
            SELECT COUNT(*) as total 
            FROM productions p
            LEFT JOIN title_types tt ON p.type_id = tt.type_id
            LEFT JOIN ratings r ON p.production_id = r.rating_id
            WHERE {where_clause}
        """
        cursor.execute(count_sql, tuple(params))
        count_result = cursor.fetchone()
        total_count = count_result['total'] if count_result else 0

        data_sql = f"""
            SELECT p.*, r.average_rating, r.num_votes, tt.type_name as type
            FROM productions p 
            LEFT JOIN ratings r ON p.production_id = r.rating_id
            LEFT JOIN title_types tt ON p.type_id = tt.type_id
            WHERE {where_clause}
            ORDER BY r.num_votes DESC 
            LIMIT %s OFFSET %s
        """
        
        final_params = params + [limit, offset]
        
        cursor.execute(data_sql, tuple(final_params))
        rows = cursor.fetchall()
        
        return rows, total_count

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
        
        sql_directors = """
            SELECT p.person_id, p.primary_name as name, 'Director' as job
            FROM directors d
            JOIN people p ON d.person_id = p.person_id
            WHERE d.production_id = %s
        """
        cursor.execute(sql_directors, (production_id,))
        directors = cursor.fetchall()

        sql_writers = """
            SELECT p.person_id, p.primary_name as name, 'Writer' as job
            FROM writers w
            JOIN people p ON w.person_id = p.person_id
            WHERE w.production_id = %s
        """
        cursor.execute(sql_writers, (production_id,))
        writers = cursor.fetchall()

        sql_other_crew = """
             SELECT pm.primary_name as name, j.job_name as job, cm.person_id
             FROM cast_members cm
             JOIN people pm ON cm.person_id = pm.person_id
             JOIN jobs j ON cm.job_id = j.job_id
             WHERE cm.production_id = %s
        """
        cursor.execute(sql_other_crew, (production_id,))
        other_crew = cursor.fetchall()
        movie['crew'] = directors + writers + other_crew

        sql_alt = """
            SELECT 
                a.localized_title, 
                r.region_name,
                l.language_name,
                a.types,
                a.is_original_title
            FROM alt_titles a
            LEFT JOIN regions r ON a.region_code = r.region_code
            LEFT JOIN languages l ON a.language_code = l.language_code
            WHERE a.production_id = %s
            ORDER BY r.region_name, l.language_name
        """
        cursor.execute(sql_alt, (production_id,))
        movie['alt_titles'] = cursor.fetchall()

        return movie
    except Exception as e:
        print(f"Detail error: {e}")
        return None
    finally:
        if conn: conn.close()

def fetch_episodes_by_series(parent_id):
    conn = get_db_connection()
    if not conn:
        return []

    sql = """
        SELECT 
            e.season_number, 
            e.episode_number, 
            p.primary_title, 
            p.production_id, 
            p.runtime_minutes, 
            p.poster_url,
            r.average_rating, 
            r.num_votes
        FROM episodes e
        JOIN productions p ON e.episode_id = p.production_id
        LEFT JOIN ratings r ON e.episode_id = r.rating_id
        WHERE e.parent_id = %s
        ORDER BY e.season_number ASC, e.episode_number ASC
    """
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(sql, (parent_id,))
        rows = cursor.fetchall()
        return rows
    except Exception as e:
        print(f"Fetch episodes error: {e}")
        return []
    finally:
        if conn: conn.close()

def fetch_awards_by_movie(production_id):
    conn = get_db_connection()
    if not conn:
        return []

    sql = """
        SELECT 
            a.award_id,
            ac.category_name, 
            acer.ceremony_year,
            a.winner,
            a.detail,
            p.primary_title, 
            p.poster_url,
            p.production_id
        FROM awards a
        JOIN award_categories ac ON a.category_id = ac.category_id
        JOIN award_ceremonies acer ON a.ceremony_id = acer.ceremony_id
        JOIN productions p ON a.production_id = p.production_id
        WHERE a.production_id = %s
        ORDER BY acer.ceremony_year DESC, ac.category_name ASC
    """
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(sql, (production_id,))
        rows = cursor.fetchall()
        return rows
    except Exception as e:
        print(f"Fetch movie awards error: {e}")
        return []
    finally:
        if conn: conn.close()

def fetch_all_genres():
    conn = get_db_connection()
    if not conn:
        return []
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT genre_id, genre_name FROM genres ORDER BY genre_name ASC")
        return cursor.fetchall()
    except Exception as e:
        print(f"Fetch genres error: {e}")
        return []
    finally:
        if conn: conn.close()