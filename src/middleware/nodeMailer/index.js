const nodemailer = require("nodemailer");
const { EmailToken } = require("../../models");
const { uniqid } = require("../../constants");

async function sendMail(token, email) {
    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "matevosyandev2000@gmail.com",
            pass: "ars022074"
        }
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