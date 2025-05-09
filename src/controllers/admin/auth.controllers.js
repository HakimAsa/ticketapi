const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

const JWT_SECRET = config.get('jwtPrivateKey') || 'supersecret'
const JWT_EXPIRES_IN = config.get('jwtExpiresIn')

// @desc    Authenticate admin
// @route   POST /auth/admin/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check if admin exists
  const { rows } = await req.db.query('SELECT * FROM admins WHERE email=$1', [
    email,
  ])
  const admin = rows[0]
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' })

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, admin.password)
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

  // Generate JWT token
  const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })

  res.status(200).json({ token })
})

module.exports = {
  authAdmin,
}
