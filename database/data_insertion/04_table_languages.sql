INSERT IGNORE INTO languages (language_code, language_name)
SELECT DISTINCT language, language 
FROM staging_akas
WHERE language IS NOT NULL AND language != '\\N';