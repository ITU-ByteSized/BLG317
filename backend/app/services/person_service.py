"""
Person service helpers.

Provides basic person search and retrieval using the DB connection.
"""
from typing import List, Dict, Any, Optional
from backend.app.db.connection import get_db_connection


def search_people(query: str, limit: int = 50) -> List[Dict[str, Any]]:
	conn = get_db_connection()
	if conn is None:
		return []

	try:
		cur = conn.cursor(dictionary=True)
		sql = "SELECT person_id, primary_name, birth_year, death_year, primary_profession FROM people WHERE primary_name LIKE %s LIMIT %s"
		cur.execute(sql, (f"%{query}%", limit))
		rows = cur.fetchall()
		return rows or []
	finally:
		try:
			cur.close()
		except Exception:
			pass
		try:
			conn.close()
		except Exception:
			pass


def get_person(person_id: str) -> Optional[Dict[str, Any]]:
	conn = get_db_connection()
	if conn is None:
		return None

	try:
		cur = conn.cursor(dictionary=True)
		cur.execute("SELECT person_id, primary_name, birth_year, death_year, primary_profession FROM people WHERE person_id = %s LIMIT 1", (person_id,))
		return cur.fetchone()
	finally:
		try:
			cur.close()
		except Exception:
			pass
		try:
			conn.close()
		except Exception:
			pass

