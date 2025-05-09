const express = require('express')

const { authAdmin } = require('../controllers/admin/auth.controllers')
const { doSetForwardslash: dsf } = require('../utils/lib')
const { ep } = require('../utils/endpoints')

const router = express.Router()

const { LOGIN } = ep

// Admin login path
router.post(dsf(LOGIN), authAdmin)

module.exports = router // ✅ This must be present
