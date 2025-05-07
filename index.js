const cors = require('cors')
const helmet = require('helmet')
const express = require('express')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')

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
// secure headers

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      //CSP issue on production
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          // Add the hash from my browser error: need to be updated
          "'sha256-ZomnyosL2bmZ79LmErHEhL+1fVaBj9NngvpOK/l4qio='",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"], // Optional, needed if styles are inline too
        objectSrc: ["'none'"],
        imgSrc: ["'self'", 'data:'], // Allow images if needed
      },
    },
  })
)

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 min
  max: 25, // 25 requests can be made in 10 min
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers,
  message: 'Too many requests, please try again later.',
})

app.use(limiter)

// Enable trust proxy
app.set('trust proxy', 'loopback, linklocal, uniquelocal')
app.get('/ip', (request, response) => response.send(request.ip))
app.get('/x-forwarded-for', (request, response) =>
  response.send(request.headers['x-forwarded-for'])
)

app.use('/api/v1/auth/admin', auth)
app.use('/api/v1', events)

app.get('/users', async (req, res) => {
  const result = await client.query('SELECT * FROM users')
  res.json(result.rows)
})

app.get('/api/v1', (req, res) => {
  res.json({ message: 'Welcome to Ticket API version 1' })
})

app.get('/', (req, res) => {
  res.send('Hello  Waouh Monde!')
})

app.get('/favicon.ico', (req, res) => {
  res.send('favicon.icon')
})

app.listen(port, () => {
  console.log(
    `🚀Example app listening on port ${port} in ${env} mode...`.yellow.underline
      .bold
  )
})
