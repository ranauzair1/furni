require("dotenv").config()
const nodemailer = require("nodemailer")
const status = require("http-status")
const APIError = require("./APIError")
const { MESSAGES } = require("./constants")
const twilio = require('twilio');

const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)


exports.sendEmailSendGrid = async (email, subject, link) => {

  console.log("from", process.env.MAIL_USERNAME)
  console.log("email", email)
  const msg = {
    to: email, // Change to your recipient
    from: process.env.MAIL_USERNAME, // Change to your verified sender
    subject: subject,
    html: link
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent")
    })
    .catch((error) => {
      console.log("email send error---------", error)

    })
}




