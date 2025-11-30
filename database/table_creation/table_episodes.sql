CREATE TABLE IF NOT EXISTS episodes (
    episode_id VARCHAR(12) PRIMARY KEY,
    parent_id VARCHAR(12) NOT NULL,
    season_number INT,
    episode_number INT,
    FOREIGN KEY (episode_id) REFERENCES productions(production_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES productions(production_id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;