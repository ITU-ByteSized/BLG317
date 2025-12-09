CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    avatar_url VARCHAR(255) NOT NULL DEFAULT 'default_avatar.png',
    urole ENUM('standard', 'admin') NOT NULL DEFAULT 'standard',
    bio TEXT,

    gender ENUM('male', 'female', 'other') NULL,
    birth_date DATE NULL,
    city VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    profile_is_public BOOLEAN NOT NULL DEFAULT 1,
    is_username_changed BOOLEAN DEFAULT 0,
    total_watch_time_minutes INT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_watchlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    production_id VARCHAR(12) NOT NULL,
    status ENUM('watching', 'completed', 'plan_to_watch', 'dropped') 
        NOT NULL DEFAULT 'plan_to_watch',
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_watchlist_user
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_watchlist_production
        FOREIGN KEY (production_id) REFERENCES productions(production_id) ON DELETE CASCADE,

    UNIQUE KEY uq_user_production (user_id, production_id),
    KEY idx_watchlist_user_status (user_id, status),
    KEY idx_watchlist_production (production_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    production_id VARCHAR(12) NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    review TEXT,
    rated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 10),

    CONSTRAINT fk_ratings_user
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_ratings_production
        FOREIGN KEY (production_id) REFERENCES productions(production_id) ON DELETE CASCADE,

    UNIQUE KEY uq_user_production_rating (user_id, production_id),
    KEY idx_ratings_production (production_id),
    KEY idx_ratings_user (user_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    production_id VARCHAR(12) NOT NULL,
    body TEXT NOT NULL,
    has_spoiler BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_production
        FOREIGN KEY (production_id) REFERENCES productions(production_id) ON DELETE CASCADE,

    KEY idx_comments_production_created (production_id, created_at),
    KEY idx_comments_user (user_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    reported_user_id INT NULL,
    production_id VARCHAR(12) NULL,
    comment_id INT NULL,
    reason VARCHAR(255) NOT NULL,
    details TEXT,
    status ENUM('open', 'reviewing', 'resolved', 'dismissed') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reports_reporter
        FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_reports_user
        FOREIGN KEY (reported_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_reports_production
        FOREIGN KEY (production_id) REFERENCES productions(production_id) ON DELETE SET NULL,
    CONSTRAINT fk_reports_comment
        FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;