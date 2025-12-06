INSERT IGNORE INTO writers (production_id, person_id)
SELECT sc.tconst, TRIM(jt.person_id)
FROM staging_crew sc
JOIN JSON_TABLE(
  CONCAT('["', REPLACE(sc.writers, ',', '","'), '"]'),
  '$[*]' COLUMNS (person_id VARCHAR(12) PATH '$')
) AS jt
WHERE sc.writers IS NOT NULL
  AND sc.writers != '\\N'
  AND jt.person_id IS NOT NULL
  AND jt.person_id != '\\N';
