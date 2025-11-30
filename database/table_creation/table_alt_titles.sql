CREATE TABLE IF NOT EXISTS alt_titles (
    alt_title_id INT AUTO_INCREMENT PRIMARY KEY,
    production_id VARCHAR(12) NOT NULL,
    ordering INT,
    localized_title VARCHAR(255) NOT NULL,
    region_code VARCHAR(10),
    language_code VARCHAR(10),
    types VARCHAR(100),
    attributes VARCHAR(100),
    is_original_title BOOLEAN,
    FOREIGN KEY (production_id) REFERENCES productions(production_id) ON DELETE CASCADE,
    FOREIGN KEY (region_code) REFERENCES regions(region_code) ON DELETE SET NULL,
    FOREIGN KEY (language_code) REFERENCES languages(language_code) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

