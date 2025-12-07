import os
import mysql.connector
from backend.app.config import settings


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
CREATE_DIR = os.path.join(BASE_DIR, "database", "create")
TABLES_DIR = os.path.join(BASE_DIR, "database", "table_creation")


DATA_DIR = os.path.join(BASE_DIR, "database", "data_insertion")

TABLE_FILES = [
    "table_users.sql", "table_regions.sql", "table_languages.sql",
    "table_title_types.sql", "table_genres.sql", "table_jobs.sql",
    "table_categories.sql", "table_professions.sql", "table_award_ceremonies.sql",
    "table_award_categories.sql", "table_people.sql", "table_productions.sql",
    "table_episodes.sql", "table_ratings.sql", "table_alt_titles.sql",
    "table_production_genres.sql", "table_person_professions.sql",
    "table_cast_members.sql", "table_directors.sql", "table_writers.sql",
    "table_awards.sql", "table_award_nominees.sql"
]

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=settings.DB_HOST,
            database=settings.DB_NAME,
            user=settings.DB_USER,
            password=settings.DB_PASS,
            autocommit=True,
            allow_local_infile=True  
        )
        return conn
    except mysql.connector.Error as err:
        print(f"DB Connection Error: {err}")
        return None

def run_sql_file(cursor, file_path):
    if not os.path.exists(file_path):
        print(f"[WARNING] File not found: {file_path}")
        return
    print(f"Processing: {os.path.basename(file_path)}...")
    with open(file_path, "r", encoding="utf-8") as f:
        sql_content = f.read()
    commands = sql_content.split(';')
    for command in commands:
        cleaned_command = command.strip()
        if cleaned_command:
            try:
                cursor.execute(cleaned_command)
            except mysql.connector.Error as err:
                print(f"[ERROR] Command failed: {cleaned_command[:100]}... -> {err}")

def apply_seed():
    print("--- Database Setup Started ---")
    db_conn = get_db_connection()
    if not db_conn:
        print("Could not connect to database.")
        return

    cursor = db_conn.cursor()
    try:
        cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
        
        
        print("\n--- Creating Tables ---")
        for file_name in TABLE_FILES:
            run_sql_file(cursor, os.path.join(TABLES_DIR, file_name))

        
        print(f"\n--- Inserting Data from: {os.path.basename(DATA_DIR)} ---")
        if os.path.exists(DATA_DIR):
            files = sorted([f for f in os.listdir(DATA_DIR) if f.endswith('.sql')])
            for file_name in files:
                run_sql_file(cursor, os.path.join(DATA_DIR, file_name))
        else:
            print(f"[WARNING] '{DATA_DIR}' folder not found!")

        cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
        print("\n--- Setup Completed Successfully ---")
    except Exception as e:
        print(f"\n[CRITICAL ERROR]: {e}")
    finally:
        if db_conn: db_conn.close()

if __name__ == "__main__":
    apply_seed()