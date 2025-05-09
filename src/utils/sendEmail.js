const nodemailer = require('nodemailer')
const config = require('config')

exports.sendTicketEmail = async function (email, ticket, eventTitle) {
  let transporter = nodemailer.createTransport({
    host: config.get('mail_host'),
    port: config.get('mail_port'),
    auth: {
      user: config.get('mail_user'),
      pass: config.get('mail_pass'),
    },
  })

  await transporter.sendMail({
    from: '« Équipe événementielle » <noreply@events.com>',
    to: email,
    subject: ` Votre billet pour ${eventTitle}`,
    html: `<html>
    <body>
      <p>Merci de votre inscription.</p>
      <p>Votre code de billet est : <strong>${ticket}</strong></p>
    </body>
  </html>`,
  })
}
