INSERT INTO alt_titles (
    production_id,
    ordering,
    localized_title,
    region_code,
    language_code,
    types,
    attributes,
    is_original_title
)
SELECT 
    sa.titleId,
    sa.ordering,
    sa.title,
    NULLIF(sa.region, '\\N'),  
    NULLIF(sa.language, '\\N'), 
    sa.types,
    sa.attributes,
    sa.isOriginalTitle
FROM staging_akas sa
WHERE EXISTS (SELECT 1 FROM productions p WHERE p.production_id = sa.titleId);