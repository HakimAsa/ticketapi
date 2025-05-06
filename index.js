const express = require('express')
const client = require('./src/startup/db')

const app = express()
app.use(express.json())
const port = process.env.PORT || 3025
const env = process.env.NODE_ENV || 'development'

app.use(cors())
app.use(express.json())

app.get('/users', async (req, res) => {
  const result = await client.query('SELECT * FROM users')
  res.json(result.rows)
})

app.listen(3025, () => {
  console.log(
    `Example app listening on port ${port} in ${env} mode...`.yellow.underline
      .bold
  )
})
