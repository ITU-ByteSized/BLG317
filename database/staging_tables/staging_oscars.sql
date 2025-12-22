DROP TABLE IF EXISTS staging_oscars;

CREATE TABLE staging_oscars (
    ceremony            INT,
    year                INT,
    class               VARCHAR(50),
    canonical_category  VARCHAR(255),
    category            VARCHAR(255),
    film                VARCHAR(1024),
    film_id             VARCHAR(64),
    name                VARCHAR(255),
    nominees            TEXT,
    nominee_ids         TEXT,
    winner              VARCHAR(16),
    detail              TEXT,
    note                TEXT,
    citation            TEXT,
    source_file         VARCHAR(100),
    source_line_number  INT,
    load_ts             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_valid            TINYINT DEFAULT 1,
    error_msg           VARCHAR(255),
    raw_row             TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

LOAD DATA LOCAL INFILE 'database/datasets/oscars.csv'
INTO TABLE staging_oscars
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(ceremony, year, class, canonical_category, category, film, film_id,
 name, nominees, nominee_ids, winner, detail, note, citation);