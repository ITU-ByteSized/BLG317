INSERT IGNORE INTO directors (production_id, person_id)
SELECT sc.tconst, TRIM(jt.person_id)
FROM staging_crew sc
JOIN JSON_TABLE(
  CONCAT('["', REPLACE(sc.directors, ',', '","'), '"]'),
  '$[*]' COLUMNS (person_id VARCHAR(12) PATH '$')
) AS jt
WHERE sc.directors IS NOT NULL
  AND sc.directors != '\\N'
  AND jt.person_id IS NOT NULL
  AND jt.person_id != '\\N';
