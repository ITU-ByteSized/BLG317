-- Ezgi

CREATE TABLE IF NOT EXISTS alt_titles (
    alt_title_id INT AUTO_INCREMENT PRIMARY KEY,
    production_id VARCHAR(12),
    ordering INT,
    localized_title VARCHAR(255),
    region_code VARCHAR(10),
    language_code VARCHAR(10),
    types VARCHAR(100),
    attributes VARCHAR(100),
    is_original_title BOOLEAN,
    FOREIGN KEY (production_id) REFERENCES productions(production_id),
    FOREIGN KEY (region_code) REFERENCES regions(region_code),
    FOREIGN KEY (language_code) REFERENCES languages(language_code)
);
