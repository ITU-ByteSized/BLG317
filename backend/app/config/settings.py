import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

DEFAULT_LIMIT = int(os.getenv("DEFAULT_LIMIT", "20"))

TYPE_GROUPS = {
    "movie": ["movie", "tvMovie"],
    "tvseries": ["tvSeries", "tvMiniSeries"],
    "tvepisode": ["tvEpisode"],
}

__all__ = [
    "DB_HOST",
    "DB_NAME",
    "DB_USER",
    "DB_PASS",
    "DEFAULT_LIMIT",
    "TYPE_GROUPS",
]