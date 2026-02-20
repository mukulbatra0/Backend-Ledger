
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});
// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendRegistermail(userEmail , name) {
  const subject = 'Welcome to Backend-Ledger';
  const text = `Hi ${name},\n\nWelcome to our application! We're excited to have you on board.\n\nBest regards,\nThe Team Backend-Ledger`;
  const html = `<p>Hi <strong>${name}</strong>,</p><p>Welcome to our application! We're excited to have you on board.</p><p>Best regards,<br>The Team Backend-Ledger</p>`;
  await sendEmail(userEmail,subject,text,html)
}

module.exports = {
  sendRegistermail,
  sendEmail
}