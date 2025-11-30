INSERT IGNORE INTO episodes (episode_id, parent_id, season_number, episode_number)
SELECT 
    se.tconst,
    se.parentTconst,
    NULLIF(se.seasonNumber, '\\N'),
    NULLIF(se.episodeNumber, '\\N')
FROM staging_episodes se
WHERE se.parentTconst IS NOT NULL AND se.parentTconst != '\\N';
