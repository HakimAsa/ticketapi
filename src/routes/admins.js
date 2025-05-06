// routes/adminAuth.js
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = express.Router()

const pool = require('../startup/db') // your PostgreSQL pool

const JWT_SECRET = config.get('jwtPrivateKey') || 'supersecret'
const JWT_EXPIRES_IN = config.get('jwtExpiresIn')

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [
      email,
    ])
    const admin = result.rows[0]
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })
    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router // ✅ This must be present
