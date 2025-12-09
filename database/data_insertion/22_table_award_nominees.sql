INSERT INTO award_nominees (award_id, person_id)
SELECT DISTINCT
    a.award_id,
    pe.person_id
FROM staging_oscars so
JOIN award_categories ac
  ON ac.canonical_category = so.canonical_category
JOIN award_ceremonies c
  ON c.ceremony_id = so.ceremony
JOIN awards a
  ON a.ceremony_id = c.ceremony_id
 AND a.category_id = ac.category_id
LEFT JOIN productions p
  ON p.production_id = so.film_id
JOIN people pe
  ON pe.primary_name = so.name;