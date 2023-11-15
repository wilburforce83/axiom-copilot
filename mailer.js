const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./process.env" });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: process.env.EMAIL_PORT,
  secure: true, // STARTTLS
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = {
  send: function (message, recipient, subject) {
    let mail = {
      from: process.env.EMAIL_ADDRESS,
      to: recipient,
      subject: subject,
      html: message,
    };
    console.log("transporter", transporter);
    console.log("mail", mail);
    transporter.sendMail(mail, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent successfully!");
      }
    });
  },
};
