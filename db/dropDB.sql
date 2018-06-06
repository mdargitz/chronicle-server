DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
  id serial PRIMARY KEY,
  username VARCHAR(72) UNIQUE NOT NULL ,
  password VARCHAR(72) NOT NULL
);

DROP TABLE IF EXISTS stories CASCADE;

CREATE TABLE stories (
  id serial PRIMARY KEY ,
  user_id integer REFERENCES users ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description text,
  picture VARCHAR,
  genre VARCHAR,
  period VARCHAR,
  plotsummary text,
  settingsummary text
);


DROP TABLE IF EXISTS characters CASCADE;

CREATE TABLE characters(
  id serial PRIMARY KEY,
  story_id INTEGER REFERENCES stories ON DELETE CASCADE,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  age VARCHAR,
  occupation text,
  description text,
  personality text,
  background text,
  picture VARCHAR
);

DROP TABLE IF EXISTS settings CASCADE;

CREATE TABLE settings(
  id serial PRIMARY KEY,
  story_id INTEGER REFERENCES stories ON DELETE CASCADE,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  picture VARCHAR,
  description text,
  notes text
);

DROP TABLE IF EXISTS plots CASCADE;

CREATE TABLE plots (
  id serial PRIMARY KEY,
  story_id INTEGER REFERENCES stories ON DELETE CASCADE,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  name VARCHAR,
  picture VARCHAR,
  description text,
  notes text
);

