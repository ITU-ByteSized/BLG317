DROP TABLE IF EXISTS staging_crew;

CREATE TABLE staging_crew (
    tconst VARCHAR(20),
    directors TEXT,
    writers TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

LOAD DATA LOCAL INFILE 'database/datasets/title.crew.tsv'
INTO TABLE staging_crew
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;