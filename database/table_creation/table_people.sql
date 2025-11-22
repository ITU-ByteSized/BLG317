CREATE TABLE IF NOT EXISTS people (
    person_id VARCHAR(12) PRIMARY KEY,
    primary_name VARCHAR(255) NOT NULL,
    birth_year INT,
    death_year INT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;