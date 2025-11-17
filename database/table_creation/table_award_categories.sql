CREATE TABLE IF NOT EXISTS award_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    canonical_category VARCHAR(255),
    category_name VARCHAR(255),
    class VARCHAR(255)
);