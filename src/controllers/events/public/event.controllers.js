const asyncHandler = require('express-async-handler')
const Joi = require('joi')

const { sendTicketEmail } = require('../../../utils/sendEmail')

// @desc    List all non-deleted events
// @route   GET api/v1/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  if (!req.db?.query) {
    throw new Error('req.db is not a valid pool')
  }
  const { rows } = await req.db.query(
    `SELECT * FROM events WHERE deleted = FALSE`
  )
  res.json(rows)
})

// @desc    Participate to an event
// @route   POST api/v1/events/:id/participate
// @access  Public
const participateToEvent = asyncHandler(async (req, res) => {
  const { error } = validateEventParticipation(req.body)
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })

  const { first_name, last_name, email } = req.body
  const eventId = req.params.id

  const event = await req.db.query(
    `SELECT * FROM events WHERE id=$1 AND deleted=FALSE`,
    [eventId]
  )
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Event not found' })
  }

  const count = await req.db.query(
    `SELECT COUNT(*) FROM participants WHERE event_id=$1`,
    [eventId]
  )
  if (parseInt(count.rows[0].count) >= event.rows[0].max_participants)
    return res.status(400).send('Event is full')

  //node crypto
  const ticket = require('crypto').randomUUID()
  await req.db.query(
    `INSERT INTO participants (event_id, first_name, last_name, email, ticket_code)
           VALUES ($1, $2, $3, $4, $5)`,
    [eventId, first_name, last_name, email, ticket]
  )

  await sendTicketEmail(email, ticket, event.rows[0].title)
  res.status(201).json({ message: 'Participation confirmed', ticket })
})

function validateEventParticipation(body) {
  const schema = Joi.object({
    first_name: Joi.string().required().min(2).max(50),
    last_name: Joi.string().required().min(2).max(50),
    email: Joi.string().required().email(),
  })

  return schema.validate(body)
}

module.exports = {
  getEvents,
  participateToEvent,
}
