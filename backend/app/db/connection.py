import mysql.connector
from mysql.connector import Error
from backend.app.config import settings
from mysql.connector.constants import ClientFlag

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=settings.DB_HOST,
            database=settings.DB_NAME,
            user=settings.DB_USER,
            password=settings.DB_PASS,
            autocommit=False,
            allow_local_infile=True,
            client_flags=[ClientFlag.LOCAL_FILES]
        )
        return conn
    except mysql.connector.Error as err:
        print(f"DB Connection Error: {err}")
        return None
