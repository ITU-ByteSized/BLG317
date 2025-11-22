GET_MOVIES_BASE = """
SELECT
    p.production_id,
    p.primary_title,
    p.original_title,
    p.start_year,
    p.runtime_minutes,
    p.poster_url,
    r.average_rating,
    r.num_votes,
    t.type_name AS type_name
FROM productions p
LEFT JOIN title_types t ON p.type_id = t.type_id
LEFT JOIN ratings r ON p.production_id = r.rating_id
WHERE 1=1
"""

GET_MOVIE_BY_ID = """
SELECT
    p.production_id,
    p.primary_title,
    p.original_title,
    p.start_year,
    p.runtime_minutes,
    p.poster_url,
    p.plot,
    r.average_rating,
    r.num_votes,
    t.type_name AS type_name
FROM productions p
LEFT JOIN title_types t ON p.type_id = t.type_id
LEFT JOIN ratings r ON p.production_id = r.rating_id
WHERE p.production_id = %s
LIMIT 1
"""

GET_TOP_BY_TYPES = """
SELECT
    p.production_id,
    p.primary_title,
    p.original_title,
    p.start_year,
    p.runtime_minutes,
    p.poster_url,
    r.average_rating,
    r.num_votes,
    t.type_name AS type_name
FROM productions p
LEFT JOIN title_types t ON p.type_id = t.type_id
LEFT JOIN ratings r ON p.production_id = r.rating_id
WHERE t.type_name IN ({placeholders})
ORDER BY r.average_rating DESC, r.num_votes DESC
LIMIT %s
"""

__all__ = ["GET_MOVIES_BASE", "GET_MOVIE_BY_ID", "GET_TOP_BY_TYPES"]
