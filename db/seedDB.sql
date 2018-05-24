DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
  id serial PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL ,
  password VARCHAR NOT NULL
);

-- determine max length for username and password
-- add line to set username as indexed, also unique
-- refrences keyword

INSERT INTO users (username, password) VALUES 
('JohnSmith', '1234'),
('JaneDoe', '1234'),
('JoeBlou', '1234');

DROP TABLE IF EXISTS stories CASCADE;
-- how to store photos?
-- how to connect tables?
CREATE TABLE stories (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users,
  title VARCHAR NOT NULL,
  description text,
  picture VARCHAR,
  genre VARCHAR,
  period VARCHAR,
  plotsummary text,
  settingsummary text
);

--index by title

INSERT INTO stories 
(title, description, picture, genre, period, plotsummary, settingsummary) VALUES
('Story 1', 'this is the first story', 'banner.img', 'fantasy', 'mideval', 'some cool stuff happens', 'this is a cool world'),
('Story 2', 'this is the second story', 'banner.img', 'fantasy', 'mideval', 'some cool stuff happens', 'this is a cool world'),
('Story 3', 'this is the third story', 'banner.img', 'fantasy', 'mideval', 'some cool stuff happens', 'this is a cool world')


DROP TABLE IF EXISTS characters CASCADE;

CREATE TABLE characters(
  id serial PRIMARY KEY,
  story_id INTEGER REFERENCES stories,
  name text NOT NULL,
  age text,
  occupation text,
  description text,
  personality text,
  background text
)

INSERT INTO characters 
(name, age, occupation, description, personality, background) VALUES
('Princess BunBun', '34 years old', 'Ruler of WhateverLand', 'A regular princess', 'Came from nowhere'),
('Prince BunBun', '36 years old', 'Ruler of WhateverLand', 'A regular prince', 'Came from nowhere'),
('That one guy', '56 years old', 'Pastry chef', 'A cool dude', 'Born in West Africa')

DROP TABLE IF EXISTS settings CASCADE;

CREATE TABLE settings(
  id serial PRIMARY KEY,
  description text,
  notes text
);

INSERT INTO settings (description, notes) VALUES 
('A tavern on the edge of town', 'this is where all the stuff goes down'),
('Spaceport B7-03J, orbiting an obscure gas giant', 'main characters meet here'),
('Castle of doom', 'Big bad battle happens here')

DROP TABLE IF EXISTS plots CASCADE;

CREATE TABLE plots (
  id serial PRIMARY KEY,
  description text,
  notes text
);

INSERT INTO plots (description, notes) VALUES 
('The hero is presented with a problem', 'beginning of act 1'),
('The hero does some awesome stuff but it totally goes wrong', 'Heroes journey af'),
('The hero faces big bad', 'climax of plot')

