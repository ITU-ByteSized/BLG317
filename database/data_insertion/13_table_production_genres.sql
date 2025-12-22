INSERT IGNORE INTO production_genres (production_id, genre_id)
SELECT DISTINCT
    sb.tconst AS production_id,
    g.genre_id
FROM staging_basics sb
JOIN JSON_TABLE(
    CONCAT('["', REPLACE(sb.genres, ',', '","'), '"]'),
    '$[*]' COLUMNS (genre VARCHAR(50) PATH '$')
) AS jt
JOIN genres g
  ON g.genre_name = TRIM(jt.genre) COLLATE utf8mb4_unicode_ci
WHERE sb.genres IS NOT NULL
  AND sb.genres != '\\N'
  AND jt.genre IS NOT NULL
  AND jt.genre != ''
  AND jt.genre != '\\N';