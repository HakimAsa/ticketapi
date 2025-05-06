const nodemailer = require('nodemailer')

exports.sendTicketEmail = async function (email, ticket, eventTitle) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: '"Event Team" <noreply@events.com>',
    to: email,
    subject: `Your Ticket for ${eventTitle}`,
    text: `Thank you for registering. Your ticket code is: ${ticket}`,
  })
}
