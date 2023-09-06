const nodemailer = require('nodemailer')
const Client = require('../models/clients')


const serviceEmail = async(date, req, res) => {
    const createTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kutubxona655@gmail.com',
            pass: 'afrbijcfijrbmhzk'
        }
    })

    var mailOptions = {
        from: date.from,
        to: date.to,
        subject: date.subject,
        text: date.text
    }

    createTransport.sendMail(mailOptions)
}

module.exports = serviceEmail