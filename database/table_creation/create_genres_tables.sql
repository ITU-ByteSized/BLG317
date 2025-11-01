CREATE TABLE IF NOT EXISTS genres (
    genre_id INT PRIMARY KEY NOT NULL,
    genre_name VARCHAR(100) NOT NULL,
    genre_description TEXT, 
    typical_audience_rating VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id VARCHAR(12) NOT NULL, 
    genre_id INT NOT NULL,
    
    PRIMARY KEY (movie_id, genre_id), 
    
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);


