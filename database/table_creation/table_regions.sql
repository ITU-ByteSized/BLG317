CREATE TABLE IF NOT EXISTS regions (
    region_code VARCHAR(10) PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;