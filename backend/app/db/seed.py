import os
import time
import mysql.connector
from backend.app.config import settings
from backend.app.db.connection import get_db_connection

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
TABLES_DIR = os.path.join(BASE_DIR, "database", "table_creation")
STAGING_DIR = os.path.join(BASE_DIR, "database", "staging_tables")
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
                print(f"  -> [ERROR] Query failed: {err}")

def set_session_options(cursor, enable):
    if enable:
        statements = [
            "SET FOREIGN_KEY_CHECKS=1",
            "SET UNIQUE_CHECKS=1",
            "SET SQL_LOG_BIN=1"
        ]
    else:
        statements = [
            "SET FOREIGN_KEY_CHECKS=0",
            "SET UNIQUE_CHECKS=0",
            "SET SQL_LOG_BIN=0"
        ]

    for stmt in statements:
        try:
            cursor.execute(stmt + ";")
        except mysql.connector.Error as err:
            print(f"[INFO] Session option skipped ({stmt}): {err}")

def drop_staging_tables(cursor):
    tables = [
        "staging_akas",
        "staging_basics",
        "staging_crew",
        "staging_episodes",
        "staging_names",
        "staging_oscars",
        "staging_principals",
        "staging_ratings",
    ]
    print("\n--- Dropping staging tables ---")
    for t in tables:
        try:
            cursor.execute(f"DROP TABLE IF EXISTS {t};")
            print(f"  Dropped: {t}")
        except mysql.connector.Error as err:
            print(f"[INFO] Could not drop {t}: {err}")

def apply_seed():
    start_time = time.time()
    print("--- Database Setup Started ---")

    db_conn = get_db_connection()
    if not db_conn:
        print("Could not connect to database.")
        return

    cursor = db_conn.cursor()

    try:
        print("\n--- Optimizing System Settings ---")
        set_session_options(cursor, enable=False)

        print("\n--- 1. Creating Main Tables ---")
        for file_name in TABLE_FILES:
            run_sql_file(cursor, os.path.join(TABLES_DIR, file_name))

        print(f"\n--- 2. Setting up Staging Tables from: {os.path.basename(STAGING_DIR)} ---")
        if os.path.exists(STAGING_DIR):
            files = sorted([f for f in os.listdir(STAGING_DIR) if f.endswith('.sql')])
            for file_name in files:
                run_sql_file(cursor, os.path.join(STAGING_DIR, file_name))

        print(f"\n--- 3. Inserting Data: {os.path.basename(DATA_DIR)} ---")
        if os.path.exists(DATA_DIR):
            files = sorted([f for f in os.listdir(DATA_DIR) if f.endswith('.sql')])
            for file_name in files:
                run_sql_file(cursor, os.path.join(DATA_DIR, file_name))
                
        print("\n--- Dropping Staging Tables... ---")
        drop_staging_tables(cursor)

        print("\n--- Committing Changes to Disk... ---")
        db_conn.commit()

        elapsed = time.time() - start_time
        print(f"\n--- Setup Completed Successfully! (Time: {elapsed:.2f}s) ---")

    except Exception as e:
        print(f"\n[CRITICAL ERROR]: {e}")
        print("Rolling back operations...")
        try:
            db_conn.rollback()
        except Exception as roll_err:
            print(f"[ROLLBACK ERROR]: {roll_err}")
    finally:
        try:
            set_session_options(cursor, enable=True)
        except Exception as err:
            print(f"[INFO] Could not restore session options: {err}")
        if cursor:
            cursor.close()
        if db_conn:
            db_conn.close()

if __name__ == "__main__":
    apply_seed()