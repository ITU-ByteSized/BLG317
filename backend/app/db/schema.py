import os
from glob import glob


def list_schema_files(folder: str = None):
	folder = folder or os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "database", "table_creation"))
	return sorted(glob(os.path.join(folder, "*.sql")))


def read_schema(path: str) -> str:
	with open(path, "r", encoding="utf-8") as f:
		return f.read()
