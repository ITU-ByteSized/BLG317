"""
Movie service: wraps DB access and returns normalized dicts for the API.

This implementation uses the existing `backend/app/db/connection.py` to
obtain a MySQL connection and the SQL in `app/db/queries.py`.
"""
from typing import List, Dict, Any, Optional
from backend.app.db.connection import get_db_connection
from backend.app.db import queries
from backend.app.config.settings import DEFAULT_LIMIT, TYPE_GROUPS


def _row_to_dict(row: Dict[str, Any]) -> Dict[str, Any]:
    # If row is a tuple, the cursor should be configured to return dicts;
    # this function tolerates both for safety.
    if not isinstance(row, dict):
        # best-effort conversion
        return dict(row)

    return {
        "production_id": row.get("production_id"),
        "primary_title": row.get("primary_title"),
        "original_title": row.get("original_title"),
        "start_year": row.get("start_year"),
        "runtime_minutes": row.get("runtime_minutes"),
        "poster_url": row.get("poster_url"),
        "average_rating": row.get("average_rating"),
        "num_votes": row.get("num_votes"),
        "type_name": row.get("type_name"),
    }


def search_movies(search: str = "", type_filter: str = "all", limit: int = DEFAULT_LIMIT) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        sql = queries.GET_MOVIES_BASE
        params = []

        if search:
            sql += " AND p.primary_title LIKE %s"
            params.append(f"%{search}%")

        # map group filter
        tf = type_filter.lower()
        if tf in TYPE_GROUPS:
            allowed = TYPE_GROUPS[tf]
            placeholders = ",".join(["%s"] * len(allowed))
            sql += f" AND t.type_name IN ({placeholders})"
            params.extend(allowed)

        sql += " ORDER BY r.average_rating DESC, r.num_votes DESC LIMIT %s"
        params.append(limit)

        cursor.execute(sql, tuple(params))
        rows = cursor.fetchall()
        return [_row_to_dict(r) for r in rows]
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        try:
            conn.close()
        except Exception:
            pass


def get_movie_by_id(production_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    if conn is None:
        return None

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_MOVIE_BY_ID, (production_id,))
        row = cursor.fetchone()
        if not row:
            return None
        return _row_to_dict(row)
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        try:
            conn.close()
        except Exception:
            pass


def get_top_by_groups(limit: int = 10) -> Dict[str, List[Dict[str, Any]]]:
    conn = get_db_connection()
    if conn is None:
        return {"movies": [], "series": [], "episodes": []}

    groups = {
        "movies": ["movie", "tvMovie"],
        "series": ["tvSeries", "tvMiniSeries"],
        "episodes": ["tvEpisode"],
    }

    try:
        cursor = conn.cursor(dictionary=True)
        result = {}
        for key, types in groups.items():
            placeholders = ",".join(["%s"] * len(types))
            sql = queries.GET_TOP_BY_TYPES.format(placeholders=placeholders)
            params = tuple(types) + (limit,)
            cursor.execute(sql, params)
            rows = cursor.fetchall()
            result[key] = [_row_to_dict(r) for r in rows]
        return result
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        try:
            conn.close()
        except Exception:
            pass
