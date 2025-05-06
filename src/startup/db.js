const { Client } = require('pg')

// Create a new instance of the Client
const client = new Client({
  host: 'localhost', // PostgreSQL server host
  port: 5432, // Default PostgreSQL port
  user: 'your-username', // Your PostgreSQL username
  password: 'your-password', // Your PostgreSQL password
  database: 'your-database-name', // Your database name
})

// Connect to PostgreSQL
client
  .connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack))

module.exports = client
