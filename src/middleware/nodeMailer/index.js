const nodemailer = require("nodemailer");
const { EmailToken } = require("../../models");
const { uniqid } = require("../../constants");

async function sendMail(token, email) {
    let transport = nodemailer.createTransport({
        host: 'ysumail.am',
        port: 25,
        secure: false,
        requireTLS: true,
        auth: {
            user: "arsen.matevosyan@ysumail.am",
            pass: "6432438292"
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    const mailOptions = {
        from: "HelpMe",
        to: email,
        subject: "HelpMe Registration code",
        text: `Your registration code\`: ${token}`
    };
    
    transport.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
            throw new Error(error);
        } else {
            console.log("Email sent: " + info.response);
            const createdDate = new Date();

            const emailToken = new EmailToken({
                token,
                email,
                createdDate,
            });

            emailToken.id = emailToken._id;
            await emailToken.save();
        }
    });
}

module.exports = {
    sendMail,
};