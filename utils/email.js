const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1️⃣ Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // ✅ lowercase 'pass'
    },
  });

  // 2️⃣ Define email options
  const mailOptions = {
    from: 'Omar <omar@example.com>', // Sender
    to: options.email, // Recipient
    subject: options.subject, // Subject line
    text: options.message, // Plain text
    // html: '<h1>Hello</h1>'         // Optional HTML version
  };

  // 3️⃣ Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
