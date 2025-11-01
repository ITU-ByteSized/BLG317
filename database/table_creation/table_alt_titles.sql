CREATE TABLE IF NOT EXISTS alt_titles (
    altTitles_id INT PRIMARY KEY NOT NULL,
    movie_id VARCHAR(12),
    ordering INT,
    localized_title VARCHAR(255),
    region VARCHAR(50),
    language VARCHAR(50),
    types VARCHAR(255),
    attributes VARCHAR(255),
    is_original_title BOOLEAN,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);
