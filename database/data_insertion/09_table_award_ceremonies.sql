INSERT INTO award_ceremonies (ceremony_year)
SELECT DISTINCT CAST(so.year AS CHAR(4))
FROM staging_oscars so
LEFT JOIN award_ceremonies ac
  ON ac.ceremony_year = CAST(so.year AS CHAR(4))
WHERE so.year IS NOT NULL
  AND ac.ceremony_id IS NULL;