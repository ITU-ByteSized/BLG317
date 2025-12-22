INSERT INTO awards (ceremony_id, category_id, production_id, winner, detail, note, citation)
SELECT DISTINCT
    c.ceremony_id,
    ac.category_id,
    p.production_id,
    CASE WHEN so.winner = 'True' THEN 1 ELSE 0 END,
    so.detail,
    so.note,
    so.citation
FROM staging_oscars so
JOIN award_categories ac
  ON ac.canonical_category = so.canonical_category
JOIN award_ceremonies c
  ON c.ceremony_id = so.ceremony
LEFT JOIN productions p
  ON p.production_id = so.film_id;