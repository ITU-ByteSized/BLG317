import os
import time
import csv
import mysql.connector
from backend.app.db.connection import get_db_connection

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
TABLES_DIR = os.path.join(BASE_DIR, "database", "table_creation")
potential_dirs = ["dataset", "datasets"]
DATASET_FOLDER = next((d for d in potential_dirs if os.path.exists(os.path.join(BASE_DIR, "database", d))), "datasets")
DATASET_PATH = os.path.join(BASE_DIR, "database", DATASET_FOLDER)

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

INSERTION_ORDER = [
    "regions", "languages", "title_types", "genres", "jobs", "categories", 
    "professions", "award_ceremonies", "award_categories", "people", 
    "productions", "users", "episodes", "ratings", "alt_titles", 
    "production_genres", "person_professions", "cast_members", 
    "directors", "writers", "awards", "award_nominees"
]

def clear_tables(cursor):
    tables_to_clear = list(reversed(INSERTION_ORDER))
    print("\n--- Cleaning existing data ---")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
    for table in tables_to_clear:
        try:
            cursor.execute(f"TRUNCATE TABLE {table};")
            print(f"  Truncated: {table}")
        except Exception as e:
            print(f"  [INFO] Could not truncate {table}: {e}")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

def get_table_columns(cursor, table_name):
    cursor.execute(f"DESCRIBE {table_name}")
    return [column[0] for column in cursor.fetchall()]

def load_csv_smart(cursor, conn):
    print(f"\n--- Loading Data (Smart Mapping Mode from: {DATASET_FOLDER}) ---")
    for table_name in INSERTION_ORDER:
        file_path = os.path.join(DATASET_PATH, f"{table_name}.csv")
        if not os.path.exists(file_path):
            continue
        print(f"Processing: {table_name}.csv...")
        try:
            table_cols = get_table_columns(cursor, table_name)
            with open(file_path, mode='r', encoding='utf-8') as f:
                sample = f.read(2048)
                f.seek(0)
                dialect = csv.Sniffer().sniff(sample, delimiters=',;')
                reader = csv.DictReader(f, dialect=dialect, skipinitialspace=True)
                rows_to_insert = []
                for row in reader:
                    filtered_row = {k: (v if v.strip() != "" else None) for k, v in row.items() if k in table_cols}
                    full_row = [filtered_row.get(col) for col in table_cols]
                    rows_to_insert.append(full_row)
                if rows_to_insert:
                    placeholders = ", ".join(["%s"] * len(table_cols))
                    columns_str = ", ".join(table_cols)
                    insert_query = f"INSERT IGNORE INTO {table_name} ({columns_str}) VALUES ({placeholders})"
                    cursor.executemany(insert_query, rows_to_insert)
                    print(f"  -> Success: {cursor.rowcount} rows added to {table_name}")
        except Exception as e:
            print(f"  -> [SKIP] Error processing {table_name}: {e}")

def run_sql_file(cursor, file_path):
    if not os.path.exists(file_path): return
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        for cmd in content.split(';'):
            if cmd.strip(): cursor.execute(cmd)

def apply_seed():
    start_time = time.time()
    conn = get_db_connection()
    if not conn: return
    cursor = conn.cursor()
    try:
        cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
        
        print("\n--- 1. Creating Table Schemas ---")
        for f in TABLE_FILES:
            run_sql_file(cursor, os.path.join(TABLES_DIR, f))

        clear_tables(cursor)

        load_csv_smart(cursor, conn)

        conn.commit()
        print(f"\n--- Setup Completed! (Time: {time.time() - start_time:.2f}s) ---")
    except Exception as e:
        print(f"\n[CRITICAL ERROR]: {e}")
        conn.rollback()
    finally:
        cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
        cursor.close()
        conn.close()

if __name__ == "__main__":
    apply_seed()