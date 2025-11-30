INSERT IGNORE INTO person_professions (person_id, profession_id)
SELECT sn.nconst, p.profession_id
FROM staging_names sn
JOIN JSON_TABLE(
  CONCAT('["', REPLACE(sn.primaryProfession, ',', '","'), '"]'),
  '$[*]' COLUMNS (profession VARCHAR(100) PATH '$')
) AS jt
JOIN professions p ON p.profession_name = TRIM(jt.profession)
WHERE sn.primaryProfession IS NOT NULL
  AND sn.primaryProfession != '\\N'
  AND jt.profession IS NOT NULL
  AND jt.profession != '';
