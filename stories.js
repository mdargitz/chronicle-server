
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('stories').del()
    .then(function () {
      // Inserts seed entries
      return knex('stories').insert([
        {id: 1, 
          user_id: '1',
          title: 'A cool title',
          description: 'Fun stuff',
          picture: 'thing.jpg',
          genre: 'Horror',
          period: 'Now',
          plotsummary: 'Nothing happens',
          settingsummary: 'In a land far away'},
        {id: 2, 
          user_id: '1',
          title: 'Some stuff',
          description: 'Woot',
          picture: 'fun.jpg',
          genre: 'yep',
          period: 'awk',
          plotsummary: 'woot',
          settingsummary: 'wowza'},
        {id: 3, 
          user_id: '3',
          title: 'ugg',
          description: 'seed data',
          picture: 'boring.jpeg',
          genre: 'luckily',
          period: 'only 3',
          plotsummary: 'to insert',
          settingsummary: 'per table'},
      ]);
    });
};
