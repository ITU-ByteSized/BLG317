--Ezgi

CREATE TABLE IF NOT EXISTS production_genres (
    production_id VARCHAR(12),
    genre_id INT,
    PRIMARY KEY(production_id, genre_id),
    FOREIGN KEY (production_id) REFERENCES productions(production_id),
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);
