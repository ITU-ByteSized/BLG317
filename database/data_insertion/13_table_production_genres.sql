INSERT IGNORE INTO production_genres (production_id, genre_id)
SELECT 
    sb.tconst, 
    g.genre_id
FROM staging_basics sb
INNER JOIN genres g ON sb.genres = g.genre_name 
WHERE sb.genres IS NOT NULL;