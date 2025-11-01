CREATE TABLE IF NOT EXISTS crew (
    crew_id INT PRIMARY KEY NOT NULL,
    movie_id VARCHAR(12),
    person_id VARCHAR(12),
    role VARCHAR(255),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (person_id) REFERENCES people(person_id)
);
