DROP TABLE IF EXISTS staging_basics;

CREATE TABLE staging_basics (
    tconst VARCHAR(20),
    titleType VARCHAR(20),
    primaryTitle TEXT,
    originalTitle TEXT,
    isAdult BOOLEAN,
    startYear VARCHAR(10),
    endYear VARCHAR(10),
    runtimeMinutes VARCHAR(10),
    genres TEXT,
    KEY idx_tconst (tconst),
    KEY idx_titleType (titleType)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


LOAD DATA LOCAL INFILE 'database/datasets/title.basics.tsv'
INTO TABLE staging_basics
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;