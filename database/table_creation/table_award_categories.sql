CREATE TABLE IF NOT EXISTS award_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    canonical_category VARCHAR(255),
    category_name VARCHAR(255) NOT NULL,
    class VARCHAR(255)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;