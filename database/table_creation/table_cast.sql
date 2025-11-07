-- Mehmet

CREATE TABLE IF NOT EXISTS cast (
    cast_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    person_id VARCHAR,
    ordering INT,
    category VARCHAR,
    job VARCHAR,
    characters VARCHAR,
    FOREIGN KEY (person_id) REFERENCES people(person_id)
);