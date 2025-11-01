-- Mehmet

CREATE TABLE IF NOT EXISTS ratings (
    movie_id VARCHAR PRIMARY KEY NOT NULL,
    average_rating NUMERIC(3,1) CHECK (average_rating BETWEEN 0 AND 10),
    num_votes INT CHECK (num_votes >= 0),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);