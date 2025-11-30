DROP TABLE IF EXISTS staging_crew;

CREATE TABLE staging_crew (
    tconst VARCHAR(20),
    directors TEXT, 
    writers TEXT    
);

LOAD DATA LOCAL INFILE 'C:/Users/Ezgi/Desktop/BLG317-main/database/dataset/title.crew.tsv'
INTO TABLE staging_crew
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;