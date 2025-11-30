INSERT IGNORE INTO jobs (job_name)
SELECT DISTINCT job
FROM staging_principals
WHERE job IS NOT NULL AND job != '\\N';
