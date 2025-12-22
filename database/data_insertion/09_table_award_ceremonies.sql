INSERT IGNORE INTO award_ceremonies (ceremony_id, ceremony_year)
SELECT DISTINCT
    so.ceremony,
    CAST(so.year AS CHAR(4)) COLLATE utf8mb4_unicode_ci
FROM staging_oscars so
WHERE so.year IS NOT NULL;