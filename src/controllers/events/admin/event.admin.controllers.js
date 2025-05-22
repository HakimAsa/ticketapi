const asyncHandler = require('express-async-handler')
const Joi = require('joi')

// @desc    Get all events including deleted one
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

// @desc    Create event
// @route   POST /admin/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { error } = validateEvent(req.body)
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })

  const { title, description, start_date, end_date, max_participants } =
    req.body
  const { rows } = await req.db.query(
    `INSERT INTO events (title, description, start_date, end_date, max_participants)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, start_date, end_date, max_participants]
  )
  res.status(201).json(rows[0])
})

// @desc    Get  event Stats summary
// @route   GET /admin/events/:id/stats
// @access  Private
const getEventSummary = asyncHandler(async (req, res) => {
  const result = await req.db.query(
    `SELECT
      e.id,
      e.title AS event_title,
      e.max_participants,
      e.start_date,
      e.end_date,
      COUNT(p.id) AS total_participants,
      (e.max_participants - COUNT(p.id)) AS left_places,
      ROUND(100.0 * COUNT(p.id) / NULLIF(e.max_participants, 0), 2) AS percentage_filled
    FROM events e
    LEFT JOIN participants p ON p.event_id = e.id
    WHERE e.id = $1
    GROUP BY e.id`,
    [req.params.id]
  )
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Event not found' })
  }
  res.json(result.rows[0])
})

// @desc    fetch participants of an event
// @route   GET /admin/events/:id/participants
// @access  Private
const getEventParticipants = asyncHandler(async (req, res) => {
  const result = await req.db.query(
    `SELECT * FROM participants WHERE event_id=$1`,
    [req.params.id]
  )
  res.json(result.rows)
})

// 📊 GET - Récupérer les stats des participants par événement
// @desc    Get  event Stats
// @route   GET /admin/events/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const { rows } = await req.db.query(`
        SELECT
        events.id as event_id,
        events.title,
        events.max_participants,
        COUNT(participants.id) as participant_count
        FROM events
        LEFT JOIN participants ON participants.event_id = events.id
        GROUP BY events.id, events.title,events.max_participants
        ORDER BY events.start_date ASC
    `)
  res.status(200).json(rows)
})

function validateEvent(body) {
  const schema = Joi.object({
    title: Joi.string().required().min(2).max(50),
    description: Joi.string().required(),
    status: Joi.string().required().valid('active', 'expired'),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    max_participants: Joi.number().required().min(1),
  })

  return schema.validate(body)
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  getEventParticipants,
  getEventSummary,
  getStats,
  // Add other event admin controllers here
  // e.g., createEvent, updateEvent, deleteEvent, etc.
}
