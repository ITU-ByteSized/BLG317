CREATE TABLE IF NOT EXISTS awards (
    award_id INT AUTO_INCREMENT PRIMARY KEY,
    ceremony_id INT NOT NULL,
    category_id INT NOT NULL,
    production_id VARCHAR(12),
    winner BOOLEAN DEFAULT 0,
    detail TEXT,
    note TEXT,
    citation TEXT,
    FOREIGN KEY (ceremony_id) REFERENCES award_ceremonies(ceremony_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES award_categories(category_id) ON DELETE CASCADE,
    FOREIGN KEY (production_id) REFERENCES productions(production_id) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;