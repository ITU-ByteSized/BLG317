CREATE TABLE IF NOT EXISTS ratings (
    rating_id VARCHAR(12) PRIMARY KEY,
    average_rating DECIMAL(3,1),
    num_votes INT,
    FOREIGN KEY (rating_id) REFERENCES productions(production_id)
);