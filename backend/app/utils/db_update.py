from backend.app.utils.db_utils import get_db_connection
from backend.app.utils.auth_utils import hash_password

def create_user(username, email, password):
    """
    Creates a new user.
    Returns user_id if successful, None otherwise.
    """
    conn = get_db_connection()
    if not conn:
        return None
    
    pwhash = hash_password(password)
    
    try:
        cursor = conn.cursor()
        sql = "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)"
        cursor.execute(sql, (username, email, pwhash))
        conn.commit() 
        return cursor.lastrowid
    except Exception as e:
        print(f"Create user error: {e}")
        return None
    finally:
        if conn: conn.close()

def add_rating(production_id, rating_value, user_email=None):
    conn = get_db_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        
        cursor.execute("SELECT num_votes, average_rating FROM ratings WHERE rating_id = %s", (production_id,))
        row = cursor.fetchone()
        
        if row:
            votes = row[0]
            avg = float(row[1])
            new_votes = votes + 1
            new_avg = ((avg * votes) + int(rating_value)) / new_votes
            
            sql = "UPDATE ratings SET average_rating = %s, num_votes = %s WHERE rating_id = %s"
            cursor.execute(sql, (new_avg, new_votes, production_id))
        else:
            sql = "INSERT INTO ratings (rating_id, average_rating, num_votes) VALUES (%s, %s, 1)"
            cursor.execute(sql, (production_id, rating_value))
            
        conn.commit()
        return True
    except Exception as e:
        print(f"Rate error: {e}")
        return False
    finally:
        if conn: conn.close()