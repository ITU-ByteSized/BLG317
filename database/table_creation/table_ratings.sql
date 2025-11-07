-- Mehmet

CREATE TABLE IF NOT EXISTS ratings (
    rating_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    average_rating NUMERIC(3,1) CHECK (average_rating BETWEEN 0 AND 10),
    num_votes INT CHECK (num_votes >= 0)
);