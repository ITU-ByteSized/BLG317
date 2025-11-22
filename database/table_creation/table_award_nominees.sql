CREATE TABLE IF NOT EXISTS award_nominees (
    award_id INT,
    person_id VARCHAR(12),
    PRIMARY KEY (award_id, person_id),
    FOREIGN KEY (award_id) REFERENCES awards(award_id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES people(person_id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;