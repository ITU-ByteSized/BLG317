INSERT IGNORE INTO categories (category_name)
SELECT DISTINCT category
FROM staging_principals
WHERE category IS NOT NULL AND category != '\\N';
