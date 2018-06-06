function createUserTable(knex){
  return knex.schema.createTable('users', function(table){
    table.increments();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
  }
  );}

function createStoryTable(knex){
  return knex.schema.createTable('stories', function(table){
    table.increments();
    table.integer('user_id').notNullable().unsigned();
    table.string('title').notNullable();
    table.text('description');
    table.string('picture');
    table.string('genre');
    table.string('period');
    table.text('plotsummary');
    table.text('settingsummary');

    table.foreign('user_id').references('id').inTable('users').onDelete('cascade');
  }
  );}

function createCharacterTable(knex){
  return knex.schema.createTable('characters', function(table){
    table.increments();
    table.integer('user_id').notNullable().unsigned();
    table.integer('story_id').notNullable().unsigned();
    table.string('name').notNullable();
    table.text('description');
    table.string('picture');
    table.string('age');
    table.string('occupation');
    table.text('personality');
    table.text('background');

    table.foreign('user_id').references('users.id').onDelete('cascade');
    table.foreign('story_id').references('stories.id').onDelete('cascade');
  }
  );}

function createSettingTable(knex){
  return knex.schema.createTable('settings', function(table){
    table.increments();
    table.integer('user_id').notNullable().unsigned();
    table.integer('story_id').notNullable().unsigned();
    table.string('name').notNullable();
    table.text('description');
    table.text('notes');  

    table.foreign('user_id').references('users.id').onDelete('cascade');
    table.foreign('story_id').references('stories.id').onDelete('cascade');
  }
  );}

function createPlotTable(knex){
  return knex.schema.createTable('plots', function(table){
    table.increments();
    table.integer('user_id').notNullable().unsigned();
    table.integer('story_id').notNullable().unsigned();
    table.string('name').notNullable();
    table.text('description');
    table.text('notes');  

    table.foreign('user_id').references('users.id').onDelete('cascade');
    table.foreign('story_id').references('stories.id').onDelete('cascade');
  }
  );}


exports.up = function(knex, Promise) {

  return Promise.all([
    createUserTable(knex),
    createStoryTable(knex),
    createCharacterTable(knex),
    createSettingTable(knex),
    createPlotTable(knex)
  ]);
};

exports.down = function(knex, Promise) {

  return Promise.all([
    knex.schema.dropTable('plots'),
    knex.schema.dropTable('settings'),
    knex.schema.dropTable('characters'),
    knex.schema.dropTable('stories'),
    knex.schema.dropTable('users')
  ]);
};
