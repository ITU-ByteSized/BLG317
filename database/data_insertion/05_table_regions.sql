INSERT IGNORE INTO regions (region_code, region_name)
SELECT DISTINCT region, region 
FROM staging_akas
WHERE region IS NOT NULL AND region != '\\N';