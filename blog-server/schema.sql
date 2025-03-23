CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NUll,
  name VARCHAR(50),
  username VARCHAR(50) UNIQUE NOT NULL,
  profile_pic_file BYTEA,
  profile_pic_url TEXT
  email VARCHAR(254) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  join_date DATE DEFAULT CURRENT_DATE,
  bio VARCHAR(255),
  profile_url VARCHAR(2083),
  location TEXT
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category TEXT,
    content TEXT NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NULL,
    cover_image BYTEA,
    author_username VARCHAR(50) NOT NULL,
    CONSTRAINT fk_author_username FOREIGN KEY (author_username) REFERENCES users(username)
);

CREATE TABLE reactions (
interacted_user_id INT UNIQUE NOT NULL,
author_id INT UNIQUE NOT NULL,
post_id INT UNIQUE NOT NULL,
love_count INT DEFAULT 0,
agree_count INT DEFAULT 0,
mind_blown_count INT DEFAULT 0,
on_fire_count INT DEFAULT 0,
total_reaction_count INT GENERATED ALWAYS AS (love_count + agree_count + mind_blown_count + on_fire_count) STORED
);

