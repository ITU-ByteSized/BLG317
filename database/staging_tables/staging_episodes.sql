DROP TABLE IF EXISTS staging_episodes;

CREATE TABLE staging_episodes (
    tconst VARCHAR(20),
    parentTconst VARCHAR(20),
    seasonNumber VARCHAR(10),
    episodeNumber VARCHAR(10)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

LOAD DATA LOCAL INFILE 'database/datasets/title.episode.tsv'
INTO TABLE staging_episodes
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;