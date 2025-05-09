const express = require('express')

const app = express()

const db = require('./src/startup/db')() // connect to the database
app.set('db', db) // Attach it to the app instance before using it in routes

require('./src/jobs/expireEvents') // runs the daily job
require('./src/startup/routes')(app)

const port = process.env.PORT || 3025
const env = process.env.NODE_ENV || 'development'

app.listen(port, () => {
  console.log(
    `🚀Example app listening on port ${port} in ${env} mode...`.yellow.underline
      .bold
  )
})
