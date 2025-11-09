-- Ezgi

CREATE TABLE crew (
    crew_id INT PRIMARY KEY,
    person_id INT,         
    director_id INT,        
    role VARCHAR(100),
    
    FOREIGN KEY (person_id) REFERENCES people(person_id),
    FOREIGN KEY (director_id) REFERENCES directors(director_id)
);
