// Middleware to protect admin routes
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.adminId = decoded.adminId
    next()
  } catch {
    res.sendStatus(403)
  }
}

module.exports = authenticateAdmin
