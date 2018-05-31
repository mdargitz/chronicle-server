DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
  id serial PRIMARY KEY,
  username VARCHAR(72) UNIQUE NOT NULL ,
  password VARCHAR(72) NOT NULL
);

CREATE UNIQUE INDEX username_id ON users (username);

INSERT INTO users (id, username, password) VALUES 
(1, 'JohnSmith', '1234'),
(2, 'JaneDoe', '1234'),
(3, 'JoeBlou', '1234');

DROP TABLE IF EXISTS stories CASCADE;
-- how to store photos?
-- how to connect tables?
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

CREATE UNIQUE INDEX title_id ON stories (title);

-- will need to add id's
INSERT INTO stories 
(id, user_id, title, description, picture, genre, period, plotsummary, settingsummary) VALUES
(10, 1, 'Story 1', 'this is the first story', 'banner.img', 'fantasy', 'mideval', 'some cool stuff happens', 'this is a cool world'),
(11, 1, 'Story 2', 'this is the second story', 'banner.img', 'fantasy', 'mideval', 'some cool stuff happens', 'this is a cool world'),
(12, 3, 'Story 3', 'this is the third story', 'banner.img', 'fantasy', 'mideval', 'some cool stuff happens', 'this is a cool world');


DROP TABLE IF EXISTS characters CASCADE;

CREATE TABLE characters(
  id serial PRIMARY KEY,
  story_id INTEGER REFERENCES stories ON DELETE CASCADE,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  name text NOT NULL,
  age text,
  occupation text,
  description text,
  personality text,
  background text
);

INSERT INTO characters 
(story_id, name, age, occupation, description, personality, background) VALUES
(10, 'Princess BunBun', '34 years old', 'Ruler of WhateverLand', 'A regular princess','a bratty girl', 'Came from nowhere'),
(10, 'Prince BunBun', '36 years old', 'Ruler of WhateverLand', 'A regular prince', 'a cowardly boy','Came from nowhere'),
(12, 'That one guy', '56 years old', 'Pastry chef', 'A cool dude','stoic', 'Born in West Africa');

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

CREATE INDEX name_id ON settings (name);

INSERT INTO settings (story_id, name, picture, description, notes) VALUES 
(10, 'The Drunken Star', 'pic.img','A tavern on the edge of town', 'this is where all the stuff goes down'),
(10, 'Space Station', 'pic.img','Spaceport B7-03J, orbiting an obscure gas giant', 'main characters meet here'),
(12, 'Castle', 'pic.img','Castle of doom', 'Big bad battle happens here');

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

CREATE INDEX name_id ON plots (name);

INSERT INTO plots (story_id, name, picture, description, notes) VALUES 
(10, 'Conflict', 'pic.img', 'The hero is presented with a problem', 'beginning of act 1'),
(10, 'Betrayal', 'pic.img', 'The hero does some awesome stuff but it totally goes wrong', 'Heroes journey af'),
(12, 'Battle', 'pic.img', 'The hero faces big bad', 'climax of plot');

