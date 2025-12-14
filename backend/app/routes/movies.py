from flask import Blueprint, request, jsonify
import math 
from backend.app.utils.db_fetch import (
    search_movies_db, 
    fetch_home_movies, 
    fetch_movie_detail_db,
    fetch_episodes_by_series, 
    fetch_awards_by_movie
)
from backend.app.config.settings import DEFAULT_LIMIT

bp = Blueprint("movies", __name__, url_prefix="/api")

@bp.route("/movies", methods=["GET"])
def api_search_movies():
    q = request.args.get("search", "").strip()
    t = request.args.get("type", "all")
    
    min_year = request.args.get("min_year")
    max_year = request.args.get("max_year")
    min_rating = request.args.get("min_rating")
    genre = request.args.get("genre")

    try:
        limit = int(request.args.get("limit", DEFAULT_LIMIT))
        page = int(request.args.get("page", 1))
    except ValueError:
        limit = DEFAULT_LIMIT
        page = 1
    
    offset = (page - 1) * limit
    
    movies, total_count = search_movies_db(
        q, t, limit, offset,
        min_year=min_year,
        max_year=max_year,
        min_rating=min_rating,
        genre=genre
    )
    
    total_pages = math.ceil(total_count / limit) if limit > 0 else 1
    
    return jsonify({
        "results": movies,
        "page": page,
        "total_results": total_count,
        "total_pages": total_pages 
    })

@bp.route("/movies/home", methods=["GET"])
def api_home_movies():
    data = fetch_home_movies(limit=12)
    return jsonify(data)

@bp.route("/movies/<production_id>", methods=["GET"])
def api_movie_detail(production_id):
    movie = fetch_movie_detail_db(production_id)
    if movie is None:
        return jsonify({"error": "Movie not found"}), 404
    return jsonify(movie)

@bp.route("/movies/<production_id>/episodes", methods=["GET"])
def api_episodes(production_id):
    data = fetch_episodes_by_series(production_id)
    return jsonify(data)