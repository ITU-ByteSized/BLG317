SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, AUTOCOMMIT=0;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

INSERT IGNORE INTO cast_members (production_id, person_id, ordering, category_id, job_id, characters)
SELECT 
    sp.tconst,
    sp.nconst,
    sp.ordering,
    c.category_id,
    j.job_id,
    NULLIF(sp.characters, '\\N')
FROM staging_principals sp
LEFT JOIN categories c ON sp.category = c.category_name COLLATE utf8mb4_unicode_ci
LEFT JOIN jobs j ON sp.job = j.job_name COLLATE utf8mb4_unicode_ci
WHERE sp.tconst IS NOT NULL AND sp.nconst IS NOT NULL;

COMMIT;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;