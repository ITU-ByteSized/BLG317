
CREATE TABLE staging_principals (
	tconst VARCHAR(20),
	ordering INT,
	nconst VARCHAR(20),
	category VARCHAR(100),
	job VARCHAR(255),
	characters TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

LOAD DATA LOCAL INFILE 'database/datasets/title.principals.tsv'
INTO TABLE staging_principals
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

