require('colors')
const { Client } = require('pg')
const config = require('config')

// Create a new instance of the Client
const db = config.get('db')
const client = new Client({
  connectionString: db,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Connect to PostgreSQL
client
  .connect()
  .then(() =>
    console.info(`connected to PostgeSQL at ${db}...`.cyan.underline.bold)
  )
  .catch((err) => console.log(err.message.red.underline.bold))

module.exports = client
