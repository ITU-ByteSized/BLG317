DROP TABLE IF EXISTS staging_akas;

CREATE TABLE staging_akas (
    titleId VARCHAR(20),
    ordering INT,
    title TEXT,
    region VARCHAR(10),
    language VARCHAR(10),
    types VARCHAR(50),
    attributes TEXT,
    isOriginalTitle TINYINT
);


LOAD DATA LOCAL INFILE 'C:/Users/Ezgi/OneDrive/Desktop/dataset/title.akas.tsv'
INTO TABLE staging_akas
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;