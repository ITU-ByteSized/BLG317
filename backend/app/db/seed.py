import os
import mysql.connector
from backend.app.config import settings

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
CREATE_DIR = os.path.join(BASE_DIR, "database", "create")
TABLES_DIR = os.path.join(BASE_DIR, "database", "table_creation")
DATA_DIR = os.path.join(BASE_DIR, "database", "init_data")

TABLE_FILES = [
    "table_users.sql",
    "table_regions.sql",
    "table_languages.sql",
    "table_title_types.sql",
    "table_genres.sql",
    "table_jobs.sql",
    "table_categories.sql",
    "table_professions.sql",
    "table_award_ceremonies.sql",
    "table_award_categories.sql",
    "table_people.sql",
    "table_productions.sql",
    "table_episodes.sql",
    "table_ratings.sql",
    "table_alt_titles.sql",
    "table_production_genres.sql",
    "table_person_professions.sql",
    "table_cast_members.sql",
    "table_directors.sql",
    "table_writers.sql",
    "table_awards.sql",
    "table_award_nominees.sql"
]

DATA_FILES = [
    "01_insert_languages.sql",
    "02_insert_regions.sql",
    "03_insert_title_types.sql",
    "04_insert_genres.sql",
    "05_insert_professions.sql",
    "06_insert_jobs.sql",
    "07_insert_categories.sql",
    "08_insert_users.sql",
    "09_insert_people.sql",
    "10_insert_productions.sql",
    "11_insert_production_genres.sql",
    "12_insert_ratings.sql",
    "13_insert_cast_members.sql"
]

def get_server_connection():
    try:
        conn = mysql.connector.connect(
            host=settings.DB_HOST,
            user=settings.DB_USER,
            password=settings.DB_PASS,
            autocommit=True
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Server Connection Error: {err}")
        return None

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=settings.DB_HOST,
            database=settings.DB_NAME,
            user=settings.DB_USER,
            password=settings.DB_PASS,
            autocommit=True
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
                print(f"[ERROR] Command failed: {cleaned_command[:50]}... -> {err}")

def apply_seed():
    print("--- Database Setup Started ---")

    server_conn = get_server_connection()
    if server_conn:
        cursor = server_conn.cursor()
        creator_path = os.path.join(CREATE_DIR, "database_creator.sql")
        try:
            run_sql_file(cursor, creator_path)
        except Exception as e:
            print(f"DB Create Error: {e}")
        finally:
            cursor.close()
            server_conn.close()
            
    db_conn = get_db_connection()
    if not db_conn:
        print("Could not connect to database. Make sure it exists.")
        return

    cursor = db_conn.cursor()
    try:
        cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
        
        print("\n--- Creating Tables ---")
        for file_name in TABLE_FILES:
            run_sql_file(cursor, os.path.join(TABLES_DIR, file_name))
            
        print("\n--- Inserting Initial Data ---")
        if os.path.exists(DATA_DIR):
            for file_name in DATA_FILES:
                run_sql_file(cursor, os.path.join(DATA_DIR, file_name))
        else:
            print(f"[INFO] '{DATA_DIR}' folder not found, skipping data seed.")
        
        cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
        print("\n--- Setup Completed Successfully ---")

    except mysql.connector.Error as err:
        print(f"\n[ERROR] SQL Execution Failed:\n{err}")
    finally:
        cursor.close()
        db_conn.close()

if __name__ == "__main__":
    apply_seed()