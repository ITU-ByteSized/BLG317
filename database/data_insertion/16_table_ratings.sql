INSERT INTO ratings (production_id, average_rating, num_votes)
SELECT
    sr.tconst,
    sr.averageRating,
    sr.numVotes
FROM staging_ratings sr
JOIN productions p ON p.production_id = sr.tconst;