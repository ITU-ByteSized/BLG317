from typing import Dict, Optional, Any
from backend.app.utils.db_utils import get_db_connection
from backend.app.utils.auth_utils import verify_password, generate_token
from backend.app.utils.db_update import create_user

def authenticate(email: str, password: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    if not conn:
        print("DB Connection failed in authenticate")
        return None

    try:
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT user_id, username, email, password_hash, avatar_url, urole, created_at 
            FROM users WHERE email = %s
        """
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        if user:
            stored_password = user['password_hash']
            verified = False
            
            try:
                if verify_password(stored_password, password):
                    verified = True
            except Exception:
                pass

            if not verified and stored_password == password:
                verified = True

            if verified:
                token = generate_token()
                if 'password_hash' in user:
                    del user['password_hash']
                return {"user": user, "token": token}
        
        return None

    except Exception as e:
        print(f"Authentication error: {e}")
        return None
    finally:
        if conn:
            conn.close()


def register(username: str, email: str, password: str) -> Optional[Dict[str, Any]]:
    """
    Registers a new user and automatically logs them in.
    """
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        check_query = "SELECT user_id FROM users WHERE email = %s OR username = %s"
        cursor.execute(check_query, (email, username))
        existing = cursor.fetchone()
        
        if existing:
            print("User already exists.")
            return None 

        cursor.close()
        conn.close()

        user_id = create_user(username, email, password)
        
        if user_id:
            return authenticate(email, password)
        
        return None

    except Exception as e:
        print(f"Registration error: {e}")
        if conn and conn.is_connected():
            conn.close()
        return None