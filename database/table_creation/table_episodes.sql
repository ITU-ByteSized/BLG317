-- Caner

CREATE TABLE IF NOT EXISTS episodes (
    episode_id VARCHAR(12) PRIMARY KEY NOT NULL,
    parent_id VARCHAR(12),
    season_number INT,
    episode_number INT,
    FOREIGN KEY (parent_id) REFERENCES movies(movie_id)
);
