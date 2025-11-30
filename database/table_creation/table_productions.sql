CREATE TABLE IF NOT EXISTS productions (
    production_id VARCHAR(12) PRIMARY KEY,
    type_id INT,
    primary_title VARCHAR(255) NOT NULL,
    original_title VARCHAR(255),
    is_adult BOOLEAN DEFAULT 0,
    start_year INT,
    end_year INT,
    runtime_minutes INT,
    poster_url VARCHAR(500),
    FOREIGN KEY (type_id) REFERENCES title_types(type_id) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;