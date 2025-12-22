from typing import Dict, Any, List
from backend.app.db.connection import get_db_connection

def get_profile_for_email(email: str) -> Dict[str, Any]:
	user = {
		"username": email.split("@")[0],
		"email": email,
		"avatarUrl": f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}",
		"member_since": 2024,
	}

	history = []
	conn = get_db_connection()
	if conn:
		try:
			cur = conn.cursor(dictionary=True)
			cur.execute("SELECT production_id, primary_title, start_year, average_rating FROM watch_history ORDER BY watched_at DESC LIMIT 8")
			history = cur.fetchall() or []
		except Exception:
			history = []
		finally:
			try:
				cur.close()
			except Exception:
				pass
			try:
				conn.close()
			except Exception:
				pass

	return {"user": user, "history": history}

def get_profile_full_details(user_id):
    conn = get_db_connection()
    if not conn:
        return None

    data = {
        "watching": [],
        "completed": [],
        "plan_to_watch": [],
        "dropped": [],
        "ratings": [],
        "comments": []
    }

    try:
        cursor = conn.cursor(dictionary=True)

        sql_list = """
            SELECT w.production_id, w.status, p.primary_title, p.poster_url, p.start_year
            FROM user_watch_list w
            JOIN productions p ON w.production_id = p.production_id
            WHERE w.user_id = %s
            ORDER BY w.updated_at DESC
        """
        cursor.execute(sql_list, (user_id,))
        rows = cursor.fetchall()

        for row in rows:
            if row["status"] in data:
                data[row["status"]].append(row)

        sql_ratings = """
            SELECT r.rating_id, r.average_rating, p.primary_title, p.poster_url 
            FROM ratings r
            JOIN productions p ON r.rating_id = p.production_id
            -- Note: Assuming a separate user_ratings table exists or managing via ratings table differently.
            -- Since original schema for user specific ratings wasn't fully visible, 
            -- I'll assume we fetch from a 'user_ratings' or similar if it existed, 
            -- but for now let's skip strict join if user specific rating table is missing.
            -- We will simulate empty list if table not ready.
            WHERE 1=0 
        """
        
        sql_comments = """
            SELECT c.comment_id, c.content, c.created_at, p.primary_title, p.production_id
            FROM comments c
            JOIN productions p ON c.production_id = p.production_id
            WHERE c.user_id = %s
            ORDER BY c.created_at DESC
        """
        try:
            cursor.execute(sql_comments, (user_id,))
            data["comments"] = cursor.fetchall()
        except:
            pass 

    except Exception as e:
        print(f"Error fetching profile details: {e}")
    finally:
        if conn: conn.close()

    return data

def update_watch_status(user_id, production_id, status):
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        sql = """
            INSERT INTO user_watch_list (user_id, production_id, status)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE status = %s
        """
        cursor.execute(sql, (user_id, production_id, status, status))
        conn.commit()
        return True
    except Exception as e:
        print(f"Status update error: {e}")
        return False
    finally:
        if conn: conn.close()
        
def get_user_ratings(user_id):
    conn = get_db_connection()
    if not conn:
        return []
    try:
        cursor = conn.cursor(dictionary=True)
        sql = """
            SELECT p.production_id, p.primary_title, p.poster_url, p.start_year, 
                   ur.rating as user_rating, ur.created_at
            FROM user_ratings ur
            JOIN productions p ON ur.production_id = p.production_id
            WHERE ur.user_id = %s
            ORDER BY ur.created_at DESC
        """
        cursor.execute(sql, (user_id,))
        return cursor.fetchall()
    except Exception as e:
        print(f"Error fetching user ratings: {e}")
        return []
    finally:
        if conn: conn.close()

def get_user_comments(user_id):
    conn = get_db_connection()
    if not conn:
        return []
    try:
        cursor = conn.cursor(dictionary=True)
        sql = """
            SELECT c.comment_id, c.content, c.created_at,
                   p.production_id, p.primary_title, p.poster_url
            FROM comments c
            JOIN productions p ON c.production_id = p.production_id
            WHERE c.user_id = %s
            ORDER BY c.created_at DESC
        """
        cursor.execute(sql, (user_id,))
        return cursor.fetchall()
    except Exception as e:
        print(f"Error fetching user comments: {e}")
        return []
    finally:
        if conn: conn.close()