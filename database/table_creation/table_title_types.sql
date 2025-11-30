CREATE TABLE IF NOT EXISTS title_types (
    type_id INT PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;