const jwt = require('jsonwebtoken')
const config = require('config')

const JWT_SECRET = config.get('jwtPrivateKey') || 'supersecret'

// Middleware to protect admin routes
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.sendStatus(401)
  }
  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.adminId = decoded.adminId
    next()
  } catch (err) {
    console.error('JWT verification failed:', err.message)
    res.sendStatus(403)
  }
}

module.exports = authenticateAdmin
