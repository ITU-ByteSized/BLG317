INSERT IGNORE INTO professions (profession_name)
SELECT DISTINCT TRIM(jt.profession) AS profession_name
FROM staging_names sn
JOIN JSON_TABLE(
    CONCAT('["', REPLACE(sn.primaryProfession, ',', '","'), '"]'),
    '$[*]' COLUMNS (profession VARCHAR(100) PATH '$')
) AS jt
WHERE sn.primaryProfession IS NOT NULL
  AND sn.primaryProfession != '\\N'
  AND jt.profession IS NOT NULL
  AND jt.profession != '';
