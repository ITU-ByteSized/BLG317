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
from backend.app.utils.db_utils import get_db_connection

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
    user_id = request.args.get("user_id")
    movie = fetch_movie_detail_db(production_id)
    if movie is None:
        return jsonify({"error": "Movie not found"}), 404
    
    if user_id:
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor(dictionary=True)
                sql = "SELECT rating FROM user_ratings WHERE user_id = %s AND production_id = %s LIMIT 1"
                cursor.execute(sql, (user_id, production_id))
                row = cursor.fetchone()
                if row:
                    movie["user_rating"] = row["rating"]
                else:
                    movie["user_rating"] = None
            except Exception as e:
                print(f"User rating fetch error: {e}")
            finally:
                if conn: conn.close()
    return jsonify(movie)

@bp.route("/movies/<production_id>/episodes", methods=["GET"])
def api_episodes(production_id):
    data = fetch_episodes_by_series(production_id)
    return jsonify(data)

@bp.route("/movies/<production_id>/rate", methods=["POST"])
def rate_movie(production_id):
    data = request.get_json()
    user_id = data.get("user_id")
    rating = data.get("rating")

    if not user_id or not rating:
        return jsonify({"error": "Missing user_id or rating"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        check_sql = "SELECT rating FROM user_ratings WHERE user_id = %s AND production_id = %s"
        cursor.execute(check_sql, (user_id, production_id))
        existing_vote = cursor.fetchone()
        
        previous_rating = existing_vote['rating'] if existing_vote else None
        
        upsert_sql = """
            INSERT INTO user_ratings (user_id, production_id, rating)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE rating = VALUES(rating), rated_at = CURRENT_TIMESTAMP
        """
        cursor.execute(upsert_sql, (user_id, production_id, rating))
        
        stats_sql = "SELECT average_rating, num_votes FROM ratings WHERE rating_id = %s"
        cursor.execute(stats_sql, (production_id,))
        stats = cursor.fetchone()
        
        current_rating_val = float(rating)

        if stats:
            curr_avg = float(stats['average_rating'])
            curr_votes = int(stats['num_votes'])

            current_total_score = curr_avg * curr_votes

            if previous_rating is not None:
                new_total_score = current_total_score - float(previous_rating) + current_rating_val
                new_votes = curr_votes
            else:
                new_total_score = current_total_score + current_rating_val
                new_votes = curr_votes + 1   
                
            new_avg = new_total_score / new_votes if new_votes > 0 else 0.0
            
            update_sql = "UPDATE ratings SET average_rating = %s, num_votes = %s WHERE rating_id = %s"
            cursor.execute(update_sql, (new_avg, new_votes, production_id))

        else:
            insert_sql = "INSERT INTO ratings (rating_id, average_rating, num_votes) VALUES (%s, %s, 1)"
            cursor.execute(insert_sql, (production_id, current_rating_val))
            
        conn.commit()
        
        return jsonify({"success": True, "message": "Rating saved"})
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Rating error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()