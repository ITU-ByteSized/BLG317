DROP TABLE IF EXISTS staging_ratings;

CREATE TABLE staging_ratings (
    tconst              VARCHAR(20),
    averageRating       DECIMAL(3,1),
    numVotes            INT UNSIGNED,

    source_file         VARCHAR(100),
    source_line_number  INT,
    load_ts             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_valid            TINYINT DEFAULT 1,
    error_msg           VARCHAR(255),
    raw_row             TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

LOAD DATA LOCAL INFILE 'database/datasets/title.ratings.tsv' 
INTO TABLE staging_ratings
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(tconst, averageRating, numVotes);