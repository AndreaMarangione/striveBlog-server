const express = require('express');
const { createTransport } = require('nodemailer');
const email = express.Router();

const Transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rosamond.beer18@ethereal.email',
        pass: 'vFVECdjF9duXF6XX4E'
    }
})

email.post('/sendemail', async (req, res) => {
    const { subject, text } = req.body;
    const mailOptions = {
        from: 'provola@affumicata.com',
        to: 'marangione9@gmail.com',
        subject,
        text
    }
    Transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(400).send('Error during send email' + error.message)
        } else {
            res.status(200).send('Email sent correctly')
        }
    })
})

module.exports = email;
