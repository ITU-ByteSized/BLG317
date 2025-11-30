INSERT IGNORE INTO people (person_id, primary_name, birth_year, death_year, primary_profession, known_for_titles)
SELECT
    nconst,
    primaryName,
    NULLIF(birthYear, '\\N'),
    NULLIF(deathYear, '\\N'),
    NULLIF(primaryProfession, '\\N'),
    NULLIF(knownForTitles, '\\N')
FROM staging_names
WHERE nconst IS NOT NULL;
