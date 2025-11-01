CREATE TABLE IF NOT EXISTS people (
    person_id VARCHAR(12) PRIMARY KEY NOT NULL,
    primary_name VARCHAR(255),
    birth_year INT,
    death_year INT,
    primary_profession VARCHAR(255)
);
