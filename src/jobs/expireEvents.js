const cron = require('node-cron')
const db = require('../db')

cron.schedule('59 23 * * *', async () => {
  await db.query(
    `UPDATE events SET status = 'expired' WHERE end_date = CURRENT_DATE AND status = 'active'`
  )
  console.log('✅ Events updated to expired')
})
