INSERT IGNORE INTO genres (genre_name)
SELECT DISTINCT
    TRIM(jt.genre) AS genre_name
FROM staging_basics sb
JOIN JSON_TABLE(
    CONCAT('["', REPLACE(sb.genres, ',', '","'), '"]'),
    '$[*]' COLUMNS (genre VARCHAR(50) PATH '$')
) AS jt
WHERE sb.genres IS NOT NULL
  AND sb.genres != '\\N'
  AND jt.genre IS NOT NULL
  AND jt.genre != ''
  AND jt.genre != '\\N';