from flask import Blueprint, jsonify
from backend.app.services.award_service import get_grouped_awards

bp = Blueprint("awards", __name__, url_prefix="/api")

@bp.route("/awards", methods=["GET"])
def get_awards():
    data = get_grouped_awards()

    return jsonify(data)