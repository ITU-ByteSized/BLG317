CREATE TABLE IF NOT EXISTS person_professions (
    person_id VARCHAR(12),
    profession_id INT,
    PRIMARY KEY (person_id, profession_id),
    FOREIGN KEY (person_id) REFERENCES people(person_id) ON DELETE CASCADE,
    FOREIGN KEY (profession_id) REFERENCES professions(profession_id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;