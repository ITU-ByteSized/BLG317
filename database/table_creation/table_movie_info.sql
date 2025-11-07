--Mehmet

CREATE TABLE IF NOT EXISTS movie_info (
    info_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    award_id INT,
    crew_id INT,
    altTitles_id INT,
    cast_id INT,
    is_adult BOOLEAN,
    start_year INT,
    end_year INT,
    runtime_minutes INT,
    genres VARCHAR,
    FOREIGN KEY (award_id) REFERENCES awards(award_id),
    FOREIGN KEY (crew_id) REFERENCES crew(crew_id),
    FOREIGN KEY (altTitles_id) REFERENCES altTitles(altTitles_id),
    FOREIGN KEY (cast_id) REFERENCES cast(cast_id)
);