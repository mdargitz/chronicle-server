module.exports = {
  development : {
    DATABASE_URL :  process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/chronicle',
    client: 'pg',
    pool: {min: 1, max: 3}
  },
  production : {
    DATABASE_URL : process.env.DATABASE_URL
  },
  test : {
    DATABASE_URL : process.env.TEST_DATABASE_URL || 'postgres//postgres@localhost:5432/chronicletest',
    client: 'pg',
    pool: {min:1, max: 3}
  }
};