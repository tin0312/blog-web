CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  username VARCHAR(50) UNIQUE NOT NULL,
  profile_pic_file BYTEA,
  profile_pic_url TEXT
  email VARCHAR(254) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    likecount integer DEFAULT 0,
    helpfulcount integer DEFAULT 0,
    brilliantcount integer DEFAULT 0,
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NULL,
    cover_image BYTEA,
    author_username VARCHAR(50) NOT NULL,
    CONSTRAINT fk_author_username FOREIGN KEY (author_username) REFERENCES users(username)
);

ALTER table users 
ALTER column username VARCHAR(50) NOT NULL;

ALTER TABLE users
ADD COLUMN join_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN bio VARCHAR(255),
ADD COLUMN profile_url VARCHAR(2083),
ADD COLUMN location TEXT;

