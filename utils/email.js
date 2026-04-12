const nodemailer = require('nodemailer');

//new user sighnup
// new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Omar AbdElaty <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      //sendgrid for latter
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  //send Method send the actual email
  send(template, subject) {
    // 1) Render the HTML based on a pug template

    // 2) Define Email Options
    const mailOptions = {
      from: `Omar AbdElaty <${process.env.EMAIL_FROM}>`, // Sender
      to: options.email, // Recipient
      subject: options.subject, // Subject line
      text: options.message, // Plain text
      // html: '<h1>Hello</h1>'         // Optional HTML version
    };
    // 2) Create a Transport and send Email
  }
  //call send function with the paramiters
  sendWelcome() {
    //the <template paramiter> is bug template we create
    this.send('Welcome', 'Welcome to the Tour Booking App Family!');
  }
};

const sendEmail = async (options) => {};

// 2️) Define email options

// 3️) Send the email
await transporter.sendMail(mailOptions);
