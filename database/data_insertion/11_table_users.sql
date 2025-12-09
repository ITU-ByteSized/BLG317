INSERT INTO users (username, email, password_hash)
VALUES
    ('ByteSized', 'admin@bytesized.com', 'ruhi123admin'),
    ('RuhiCenet', 'ruhicen@bytesized.com', 'ruhi1234')
ON DUPLICATE KEY UPDATE
    email = VALUES(email);