DROP TABLE IF EXISTS staging_names;

CREATE TABLE staging_names (
	nconst VARCHAR(20),
	primaryName TEXT,
	birthYear VARCHAR(10),
	deathYear VARCHAR(10),
	primaryProfession TEXT,
	knownForTitles TEXT
);

LOAD DATA LOCAL INFILE './datasets/name.basics.tsv'
INTO TABLE staging_names
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

