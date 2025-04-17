CREATE TABLE
  users (
    id SERIAL PRIMARY KEY NOT NUll,
    name VARCHAR(50),
    username VARCHAR(50) UNIQUE NOT NULL,
    profile_pic_file BYTEA,
    profile_pic_url TEXT email VARCHAR(254) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    join_date DATE DEFAULT CURRENT_DATE,
    bio VARCHAR(255),
    profile_url VARCHAR(2083),
    location TEXT,
  );

CREATE TABLE
  posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category TEXT,
    raw_content TEXT NOT NULL,
    processed_content TEXT NOT NULL
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NULL,
    cover_image BYTEA,
    author_username VARCHAR(50) NOT NULL,
    author_id INT,
  );

CREATE TABLE
  reactions (
    interacted_user_id INT NOT NULL,
    author_id INT NOT NULL,
    post_id INT NOT NULL,
    love_count INT DEFAULT 0,
    agree_count INT DEFAULT 0,
    mind_blown_count INT DEFAULT 0,
    on_fire_count INT DEFAULT 0,
    -- Conditional BOOLEAN Columns (Using CASE expressions)
    is_love BOOLEAN GENERATED ALWAYS AS (
      CASE
        WHEN love_count = 1 THEN TRUE
        ELSE FALSE
      END
    ) STORED,
    is_agree BOOLEAN GENERATED ALWAYS AS (
      CASE
        WHEN agree_count = 1 THEN TRUE
        ELSE FALSE
      END
    ) STORED,
    is_mindBlown BOOLEAN GENERATED ALWAYS AS (
      CASE
        WHEN mind_blown_count = 1 THEN TRUE
        ELSE FALSE
      END
    ) STORED,
    is_onFire BOOLEAN GENERATED ALWAYS AS (
      CASE
        WHEN on_fire_count = 1 THEN TRUE
        ELSE FALSE
      END
    ) STORED,
    -- Total reaction count (using stored generated column)
    total_reaction_count INT GENERATED ALWAYS AS (
      love_count + agree_count + mind_blown_count + on_fire_count
    ) STORED
  );

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  post_id INT,
  type VARCHAR(50) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  reactors INT[] DEFAULT '{}' --  reactors INT[] DEFAULT ARRAY[]::INT[]
);