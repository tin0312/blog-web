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
    content TEXT NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NULL,
    cover_image BYTEA,
    author_username VARCHAR(50) NOT NULL,
    CONSTRAINT fk_author_username FOREIGN KEY (author_username) REFERENCES users(username)
);

