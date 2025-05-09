require('colors')
const { Pool } = require('pg')
const config = require('config')

// Create a new instance of the Client
module.exports = function () {
  const db = config.get('db')
  const pool = new Pool({
    connectionString: db,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  // Connect to PostgreSQL
  pool
    .query('SELECT NOW()')
    .then(() =>
      console.info(`connected to PostgeSQL at ${db}...`.cyan.underline.bold)
    )
    .catch((err) => console.log(err.message.red.underline.bold))

  return pool
}
