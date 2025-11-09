-- Caner

CREATE TABLE IF NOT EXISTS episodes (
    episode_id VARCHAR PRIMARY KEY NOT NULL,
    movie_id VARCHAR,
    season_number INT,
    episode_number INT,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);
