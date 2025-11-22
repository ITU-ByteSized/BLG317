CREATE TABLE IF NOT EXISTS directors (
    production_id VARCHAR(12),
    person_id VARCHAR(12),
    PRIMARY KEY (production_id, person_id),
    FOREIGN KEY (production_id) REFERENCES productions(production_id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES people(person_id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
