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
    KEY idx_titleId (titleId)
    KEY idx_region (region),
    KEY idx_language (language)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


LOAD DATA LOCAL INFILE 'database/datasets/title.akas.tsv'
INTO TABLE staging_akas
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;