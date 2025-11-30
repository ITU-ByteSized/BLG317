INSERT IGNORE INTO cast_members (production_id, person_id, ordering, category_id, job_id, characters)
SELECT 
    sp.tconst,
    sp.nconst,
    sp.ordering,
    c.category_id,
    j.job_id,
    NULLIF(sp.characters, '\\N')
FROM staging_principals sp
LEFT JOIN categories c ON sp.category = c.category_name
LEFT JOIN jobs j ON sp.job = j.job_name
WHERE sp.tconst IS NOT NULL AND sp.nconst IS NOT NULL;
