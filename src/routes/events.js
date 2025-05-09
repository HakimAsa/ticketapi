const express = require('express')

const { sendTicketEmail } = require('../utils/sendEmail')
const authenticateAdmin = require('../middleware/authenticateAdmin')

const router = express.Router()

// ADMINS ROUTES
// Create event
router.post('/admin/events', authenticateAdmin, async (req, res) => {
  const { title, description, start_date, end_date, max_participants } =
    req.body
  await req.db.query(
    `INSERT INTO events (title, description, start_date, end_date, max_participants)
       VALUES ($1, $2, $3, $4, $5)`,
    [title, description, start_date, end_date, max_participants]
  )
  res.sendStatus(201)
})

// Update event
router.put('/admin/events/:id', authenticateAdmin, async (req, res) => {
  const { title, description, start_date, end_date, status, max_participants } =
    req.body
  await req.db.query(
    `UPDATE events SET title=$1, description=$2, start_date=$3, end_date=$4,
       status=$5, max_participants=$6 WHERE id=$7`,
    [
      title,
      description,
      start_date,
      end_date,
      status,
      max_participants,
      req.params.id,
    ]
  )
  res.sendStatus(200)
})

// PATCH event
router.patch('/admin/events/:id', authenticateAdmin, async (req, res) => {
  const { title, description, start_date, end_date, status, max_participants } =
    req.body
  await req.db.query(
    `UPDATE events SET title=$1, description=$2, start_date=$3, end_date=$4,
       status=$5, max_participants=$6 WHERE id=$7`,
    [
      title,
      description,
      start_date,
      end_date,
      status,
      max_participants,
      req.params.id,
    ]
  )
  res.sendStatus(200)
})

// Soft delete event
router.delete('/admin/events/:id', authenticateAdmin, async (req, res) => {
  await req.db.query(`UPDATE events SET deleted=TRUE WHERE id=$1`, [
    req.params.id,
  ])
  res.sendStatus(200)
})

// Get participants of an event
router.get(
  '/admin/events/:id/participants',
  authenticateAdmin,
  async (req, res) => {
    const result = await req.db.query(
      `SELECT * FROM participants WHERE event_id=$1`,
      [req.params.id]
    )
    res.json(result.rows)
  }
)

// Get stats per event
router.get('/admin/events/:id/stats', authenticateAdmin, async (req, res) => {
  const result = await req.db.query(
    `SELECT COUNT(*) AS total_participants FROM participants WHERE event_id=$1`,
    [req.params.id]
  )
  res.json(result.rows[0])
})
// 📊 GET - Récupérer les stats des participants par événement
router.get('/admin/events/stats', authenticateAdmin, async (req, res) => {
  try {
    const result = await req.db.query(`
        SELECT
          events.id as event_id,
          events.title,
          COUNT(participants.id) as participant_count
        FROM events
        LEFT JOIN participants ON participants.event_id = events.id
        GROUP BY events.id, events.title
        ORDER BY events.start_date ASC
      `)
    res.json(result.rows)
  } catch (err) {
    console.error('Error getting stats', err)
    res.status(500).json({ message: 'Server error while fetching stats' })
  }
})
//   PUBLIC ROUTES
// List all non-deleted events
router.get('/events', async (req, res) => {
  try {
    if (!req.db?.query) {
      throw new Error('req.db is not a valid pool')
    }
    const result = await req.db.query(
      `SELECT * FROM events WHERE deleted = FALSE`
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching events', error)
    return res.status(500).send('Server error')
  }
})

// Participate in an event
router.post('/events/:id/participate', async (req, res) => {
  const { first_name, last_name, email } = req.body
  const eventId = req.params.id

  const event = await req.db.query(
    `SELECT * FROM events WHERE id=$1 AND deleted=FALSE`,
    [eventId]
  )
  if (!event.rows.length) return res.status(404).send('Event not found')

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

// 📊 GET - Récupérer les stats des participants par événement
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        events.id as event_id,
        events.title,
        COUNT(participants.id) as participant_count
      FROM events
      LEFT JOIN participants ON participants.event_id = events.id
      GROUP BY events.id, events.title
      ORDER BY events.start_date ASC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('Error getting stats', err)
    res.status(500).json({ message: 'Server error while fetching stats' })
  }
})

module.exports = router // ✅ This must be present
