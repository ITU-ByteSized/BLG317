INSERT IGNORE INTO genres (genre_name)
SELECT DISTINCT genres 
FROM staging_basics 
WHERE genres IS NOT NULL AND genres != '\\N';