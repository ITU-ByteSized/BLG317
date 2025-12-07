INSERT INTO award_nominees (award_id, nominee_name, is_winner)
SELECT
    a.award_id,
    so.name,
    CASE WHEN so.winner = 'True' THEN 1 ELSE 0 END
FROM staging_oscars so
JOIN award_categories ac
  ON ac.canonical_name = so.canonical_category
JOIN awards a
  ON a.ceremony_id = so.ceremony
 AND a.category_id = ac.category_id
 LEFT JOIN productions p
  ON p.production_id = so.film_id
 AND (a.production_id = p.production_id OR a.production_id IS NULL);