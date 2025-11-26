LOAD DATA LOCAL INFILE 'database/init_data/title_akas_subset.tsv'
INTO TABLE title_akas
CHARACTER SET utf8mb4
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
(aka_id, production_id, ordering, title, region, language, types, attributes, is_original_title);