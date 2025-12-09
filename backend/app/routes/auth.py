from flask import Blueprint, request, jsonify
from backend.app.services import auth_service
from backend.app.utils.validators import validate_email, validate_password

bp = Blueprint("auth", __name__, url_prefix="/api")

@bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    result = auth_service.authenticate(email, password)
    
    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


@bp.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if not validate_email(email):
        return jsonify({"error": "Invalid email format"}), 400
    
    is_valid_pass, msg = validate_password(password)
    if not is_valid_pass:
        return jsonify({"error": msg}), 400

    result = auth_service.register(username, email, password)

    if result:
        return jsonify(result), 201
    else:
        return jsonify({"error": "Registration failed. Username or Email might be taken."}), 409