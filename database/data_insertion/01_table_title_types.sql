INSERT IGNORE INTO title_types (title_type_name)
SELECT DISTINCT titleType
FROM staging_basics
WHERE titleType IS NOT NULL
  AND titleType <> '\N';