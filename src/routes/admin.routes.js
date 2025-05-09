const express = require('express')

const { authAdmin } = require('../controllers/admin/auth.controllers')

const router = express.Router()

// Admin login path
router.post('/login', authAdmin)

module.exports = router // ✅ This must be present
