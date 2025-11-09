--burak

CREATE TABLE IF NOT EXISTS awards (
    award_id INT PRIMARY KEY NOT NULL,
    ceremony_year VARCHAR(4),
    class VARCHAR(100),
    category VARCHAR(100),
    movie_id VARCHAR(12),
    nominee_id VARCHAR(12),
    winner BOOLEAN,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (nominee_id) REFERENCES people(person_id)
);
