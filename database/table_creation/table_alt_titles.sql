CREATE TABLE IF NOT EXISTS alt_titles (
    altTitles_id INT PRIMARY KEY,
    movie_id VARCHAR(50),
    ordering INT,
    localized_title VARCHAR(255) NOT NULL,
    region_code VARCHAR(10),
    language_code VARCHAR(10),
    types VARCHAR(100),
    attributes VARCHAR(100),
    is_original_title BOOLEAN,
    
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);
