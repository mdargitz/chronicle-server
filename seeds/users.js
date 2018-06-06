
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, 
          username: 'username1',
          password: '$2b$10$GHpZSJQt1OjbLZw0KLKzgegAxoyP5A.tTjpaxDiOdS7etNuj9N0RG'}, //unencrypted: password10
        {id: 2, 
          username: 'username2',
          password: '$2b$10$GHpZSJQt1OjbLZw0KLKzgegAxoyP5A.tTjpaxDiOdS7etNuj9N0RG'}, //unencrypted: password10
        {id: 3, 
          username: 'username3',
          password: '$2b$10$GHpZSJQt1OjbLZw0KLKzgegAxoyP5A.tTjpaxDiOdS7etNuj9N0RG'} //unencrypted: password10
      ]);
    });
};
