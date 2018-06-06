module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://postgres@localhost/chronicle',
    debug: false, // http://knexjs.org/#Installation-debug
    pool: { min: 1, max: 2 }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  test : {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL || 'postgres://postgres@localhost/chronicletest',
    pool: {min:1, max:2}
  }
};
