CREATE TABLE IF NOT EXISTS cast (
    cast_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_id VARCHAR,
    person_id VARCHAR,
    ordering INT,
    category VARCHAR,
    job VARCHAR,
    characters VARCHAR,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
    FOREIGN KEY (person_id) REFERENCES people(person_id)
);