CREATE TABLE IF NOT EXISTS awards (
    award_id INT AUTO_INCREMENT PRIMARY KEY,
    ceremony_id INT,
    category_id INT,
    production_id VARCHAR(12),
    winner BOOLEAN,
    detail TEXT,
    note TEXT,
    citation TEXT,
    FOREIGN KEY (ceremony_id) REFERENCES award_ceremonies(ceremony_id),
    FOREIGN KEY (category_id) REFERENCES award_categories(category_id),
    FOREIGN KEY (production_id) REFERENCES productions(production_id)
);