CREATE TABLE IF NOT EXISTS cast_members (
    cast_id INT AUTO_INCREMENT PRIMARY KEY,
    production_id VARCHAR(12) NOT NULL,
    person_id VARCHAR(12) NOT NULL,
    ordering INT,
    category_id INT,
    job_id INT,
    characters TEXT,
    FOREIGN KEY (production_id) REFERENCES productions(production_id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES people(person_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;