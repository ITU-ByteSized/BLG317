INSERT IGNORE INTO productions (production_id, type_id, primary_title, original_title, is_adult, start_year, end_year, runtime_minutes)
SELECT 
    sb.tconst,
    tt.type_id,
    sb.primaryTitle,
    sb.originalTitle,
    sb.isAdult,
    NULLIF(sb.startYear, '\\N'),
    NULLIF(sb.endYear, '\\N'),
    NULLIF(sb.runtimeMinutes, '\\N')
FROM staging_basics sb
LEFT JOIN title_types tt ON sb.titleType = tt.type_name;
