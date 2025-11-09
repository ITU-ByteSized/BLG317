-- Burak

CREATE TABLE IF NOT EXISTS movies (
    movie_id VARCHAR(12) PRIMARY KEY NOT NULL,
    info_id INT,
    title_type VARCHAR(50),
    primary_title VARCHAR(255),
    original_title VARCHAR(255)
);
