CREATE TABLE IF NOT EXISTS ratings (
    rating_id VARCHAR(12) PRIMARY KEY,
    average_rating DECIMAL(3,1) NOT NULL,
    num_votes INT DEFAULT 0,
    FOREIGN KEY (rating_id) REFERENCES productions(production_id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;