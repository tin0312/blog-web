-- POSTS
CREATE TABLE (
    id integer NOT NULL,
    title character varying(50) NOT NULL,
    content text NOT NULL,
    created_at date DEFAULT CURRENT_DATE,
    updated_at date DEFAULT CURRENT_DATE,
    cover_image bytea
);

-- USERS 
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  username VARCHAR(50),
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- make username unique
ALTER TABLE users
ADD CONSTRAINT unique_username UNIQUE (username);
-- add username to posts table
ALTER TABLE posts
ADD author_username VARCHAR(50),
ADD CONSTRAINT fk_author_username FOREIGN KEY(author_username) REFERENCES users(username); 