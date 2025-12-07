DROP TABLE IF EXISTS staging_basics;

CREATE TABLE staging_basics (
    tconst VARCHAR(20),
    titleType VARCHAR(20),
    primaryTitle TEXT,
    originalTitle TEXT,
    isAdult TINYINT,
    startYear VARCHAR(10),
    endYear VARCHAR(10),
    runtimeMinutes VARCHAR(10),
    genres TEXT
);


LOAD DATA LOCAL INFILE 'C:/Users/Ezgi/OneDrive/Desktop/dataset/title.basics.tsv'
INTO TABLE staging_basics
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;