INSERT IGNORE INTO award_categories (canonical_name, display_name, class)
SELECT DISTINCT
    canonical_category,
    category,
    class
FROM staging_oscars
WHERE canonical_category IS NOT NULL
  AND canonical_category <> '';