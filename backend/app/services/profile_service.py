"""
Profile service: provide lightweight profile and history retrieval.

This mirrors the logic in the profile route but is factored out for reuse.
"""
from typing import Dict, Any, List
from backend.app.db.connection import get_db_connection


def get_profile_for_email(email: str) -> Dict[str, Any]:
	user = {
		"username": email.split("@")[0],
		"email": email,
		"avatarUrl": f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}",
		"member_since": 2024,
	}

	history = []
	conn = get_db_connection()
	if conn:
		try:
			cur = conn.cursor(dictionary=True)
			cur.execute("SELECT production_id, primary_title, start_year, average_rating FROM watch_history ORDER BY watched_at DESC LIMIT 8")
			history = cur.fetchall() or []
		except Exception:
			history = []
		finally:
			try:
				cur.close()
			except Exception:
				pass
			try:
				conn.close()
			except Exception:
				pass

	return {"user": user, "history": history}
