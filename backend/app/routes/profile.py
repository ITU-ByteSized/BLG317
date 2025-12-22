import os
from flask import Blueprint, jsonify, request
from backend.app.utils.db_utils import get_db_connection
from backend.app.utils.db_update import update_user_settings
from werkzeug.utils import secure_filename

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'avatars')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

bp = Blueprint("profile", __name__, url_prefix="/api")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route("/upload/avatar", methods=["POST"])
def upload_avatar():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        import uuid
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = secure_filename(f"avatar_{uuid.uuid4().hex[:8]}.{ext}")
        
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)
        
        url = f"http://127.0.0.1:5000/static/avatars/{filename}" 
        return jsonify({"url": url})
    
    return jsonify({"error": "File type not allowed"}), 400

@bp.route("/profile/me", methods=["GET"])
def get_profile_me():
    target_email = request.args.get("email")
    current_user_email = request.args.get("current_user")

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database error"}), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        
        sql ="""SELECT user_id, username, email, created_at, avatar_url, urole, bio, city, country, 
                gender, birth_date, profile_is_public, is_username_changed FROM users"""
        
        user = None
        if target_email:
            cursor.execute(sql + " WHERE email = %s", (target_email,))
            user = cursor.fetchone()
        else:
            cursor.execute(sql + " LIMIT 1")
            user = cursor.fetchone()
            
        if not user:
            return jsonify({"error": "User not found"}), 404

        is_owner = (current_user_email == user["email"])
        
        if not is_owner and user["profile_is_public"] == 0:
            return jsonify({
                "username": user["username"],
                "avatar_url": user["avatar_url"],
                "is_private": True,
                "message": f"{user['username']} is updated"
            })

        stats = {"total_ratings": 0}
        
        return jsonify({
            "user_id": user["user_id"],
            "username": user["username"],
            "email": user["email"],
            "avatar_url": user["avatar_url"],
            "member_since": user["created_at"],
            "urole": user["urole"],
            "bio": user["bio"],
            "location": f"{user.get('city') or ''}, {user.get('country') or ''}".strip(', '),
            "gender": user["gender"],
            "birth_date": str(user["birth_date"]) if user["birth_date"] else None,
            "profile_is_public": bool(user["profile_is_public"]),
            "is_username_changed": bool(user["is_username_changed"]),
            "is_owner": is_owner,
            "stats": stats
        })

    except Exception as e:
        print(f"Profile error: {e}")
        return jsonify({"error": "Internal error"}), 500
    finally:
        if conn: conn.close()

@bp.route("/profile/update", methods=["PUT"])
def update_profile():
    data = request.get_json()
    email = data.get("email_identifier")
    
    if not email:
        return jsonify({"error": "User identifier missing"}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        success, msg = update_user_settings(user["user_id"], data)
        
        if success:
            return jsonify({"message": msg}), 200
        else:
            return jsonify({"error": msg}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()
        
@bp.route("/profile/details", methods=["GET"])
def get_profile_details():
    email = request.args.get("email")
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        from backend.app.services.profile_service import get_profile_full_details
        data = get_profile_full_details(user["user_id"])
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@bp.route("/profile/list/update", methods=["POST"])
def update_list_status():
    data = request.get_json()
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (data.get("email"),))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        from backend.app.services.profile_service import update_watch_status
        success = update_watch_status(user["user_id"], data.get("production_id"), data.get("status"))
        
        if success:
            return jsonify({"message": "Updated"}), 200
        else:
            return jsonify({"error": "Failed"}), 400
    finally:
        if conn: conn.close()