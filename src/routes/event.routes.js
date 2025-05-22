const express = require('express')

const authenticateAdmin = require('../middleware/authenticateAdmin')
const validateId = require('../middleware/validateId')
const {
  createEvent,
  getStats,
  getEventSummary,
  getEventParticipants,
  getAllEvents,
} = require('../controllers/events/admin/event.admin.controllers')

const { ep } = require('../utils/endpoints')
const { doSetForwardslash: dsf } = require('../utils/lib')
const {
  participateToEvent,
  getEvents,
} = require('../controllers/events/public/event.controllers')

const { ADMIN, CONS_ID, EVENTS, PARTICIPATE, PARTICIPANTS, STATS, SUMMARY } = ep

const router = express.Router()

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

// PUBLIC ROUTES
router.get(dsf(EVENTS), getEvents)

// Admin events path
router.get(dsf(ADMIN, EVENTS, STATS), authenticateAdmin, getStats)
router.get(dsf(ADMIN, EVENTS), authenticateAdmin, getAllEvents)
router.post(dsf(ADMIN, EVENTS), authenticateAdmin, createEvent)

//dynamic paths such as :/id must be last
router.get(
  dsf(ADMIN, EVENTS, CONS_ID, SUMMARY),
  [validateId, authenticateAdmin],
  getEventSummary
)
router.get(
  dsf(ADMIN, EVENTS, CONS_ID, PARTICIPANTS),
  [validateId, authenticateAdmin],
  getEventParticipants
)

// PUBLIC DYNAMIC ROUTES
router.post(dsf(EVENTS, CONS_ID, PARTICIPATE), [validateId], participateToEvent)

module.exports = router // ✅ This must be present
