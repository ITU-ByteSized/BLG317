from flask import Blueprint, request, jsonify

bp = Blueprint("auth", __name__, url_prefix="/api")

@bp.route("/auth/login", methods=["POST"])
def login():
    return jsonify({"error": "Invalid email or password"}), 401

@bp.route("/auth/signup", methods=["POST"])
def signup():
    return jsonify({"error": "Registration failed. Email or username might be taken."}), 409
