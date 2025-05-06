const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')

const client = require('./src/startup/db')
const events = require('./src/routes/events')
const auth = require('./src/routes/admins')
require('./src/jobs/expireEvents') // runs the daily job

const app = express()
app.use(express.json())

const port = process.env.PORT || 3025
const env = process.env.NODE_ENV || 'development'

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/auth/admin', auth)
app.use('/api/v1', events)

app.get('/users', async (req, res) => {
  const result = await client.query('SELECT * FROM users')
  res.json(result.rows)
})

app.listen(port, () => {
  console.log(
    `🚀Example app listening on port ${port} in ${env} mode...`.yellow.underline
      .bold
  )
})
