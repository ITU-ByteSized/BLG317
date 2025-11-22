CREATE TABLE IF NOT EXISTS professions (
    profession_id INT AUTO_INCREMENT PRIMARY KEY,
    profession_name VARCHAR(100) UNIQUE NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;