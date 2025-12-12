from backend.app.utils.db_utils import get_db_connection
from backend.app.utils.auth_utils import hash_password, verify_password

def create_user(username, email, password):
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

def update_user_settings(user_id, data):
    conn = get_db_connection()
    if not conn:
        return False, "Database connection failed"
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
        current_user = cursor.fetchone()
        
        if not current_user:
            return False, "User not found"

        updates = []
        params = []

        if "avatar_url" in data and data["avatar_url"]:
            updates.append("avatar_url = %s")
            params.append(data["avatar_url"])

        if "gender" in data:
            updates.append("gender = %s")
            params.append(data["gender"])

        if "profile_is_public" in data:
            is_public = 1 if data["profile_is_public"] is True or data["profile_is_public"] == '1' else 0
            updates.append("profile_is_public = %s")
            params.append(is_public)

        if "birth_date" in data and data["birth_date"]:
            if current_user["birth_date"] is None:
                updates.append("birth_date = %s")
                params.append(data["birth_date"])
            else:
                pass

        if "username" in data and data["username"] != current_user["username"]:
            if current_user["is_username_changed"] == 0:
                cursor.execute("SELECT user_id FROM users WHERE username = %s", (data["username"],))
                if cursor.fetchone():
                    return False, "Username already taken"
                
                updates.append("username = %s")
                updates.append("is_username_changed = 1")
                params.append(data["username"])
            else:
                return False, "Username can only be changed once."

        if "email" in data and data["email"] != current_user["email"]:
            cursor.execute("SELECT user_id FROM users WHERE email = %s", (data["email"],))
            if cursor.fetchone():
                return False, "Email already in use"
            updates.append("email = %s")
            params.append(data["email"])

        if "new_password" in data and data["new_password"]:
            if "current_password" not in data:
                return False, "Current password required to change password"
            
            if not verify_password(current_user["password_hash"], data["current_password"]):
                return False, "Current password incorrect"
            
            new_hash = hash_password(data["new_password"])
            updates.append("password_hash = %s")
            params.append(new_hash)

        if "bio" in data:
            updates.append("bio = %s")
            params.append(data["bio"])
        
        if not updates:
            return True, "No changes made"

        sql = f"UPDATE users SET {', '.join(updates)} WHERE user_id = %s"
        params.append(user_id)
        
        cursor.execute(sql, tuple(params))
        conn.commit()
        
        return True, "Profile updated successfully"

    except Exception as e:
        print(f"Update error: {e}")
        return False, str(e)
    finally:
        if conn: conn.close()

    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        sql = "UPDATE users SET bio = %s, city = %s, country = %s WHERE email = %s"
        cursor.execute(sql, (bio, city, country, email))
        conn.commit()
        return True
    except Exception as e:
        print(f"Update profile error: {e}")
        return False
    finally:
        if conn: conn.close()