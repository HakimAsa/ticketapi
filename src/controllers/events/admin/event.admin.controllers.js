const asyncHandler = require('express-async-handler')
const { authenticateAdmin } = require('../../../middleware/authenticateAdmin')

// @desc    Get all events
// @route   GET /admin/events
// @access  Private
const getAllEvents = asyncHandler(async (req, res) => {
  const { rows } = await req.db.query('SELECT * FROM events')
  res.status(200).json(rows)
})

// @desc    Get event by id
// @route   GET /admin/events/:id
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { rows } = await req.db.query('SELECT * FROM events WHERE id=$1', [id])
  if (rows.length === 0) {
    res.status(404)
    throw new Error('Event not found')
  }
  res.status(200).json(rows[0])
})

module.exports = {
  getAllEvents,
  getEventById,
  // Add other event admin controllers here
  // e.g., createEvent, updateEvent, deleteEvent, etc.
}
