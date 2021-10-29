const nodemailer = require("nodemailer");
const { TokenPhone } = require("../../models");
const { uniqid } = require("../../constants");

async function sendMail(email) {
    let txt = Math.floor(Math.random() * 10000);
    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "drivehopedevelopment@gmail.com",
            pass: "Aa123456!"
        }
    });

    const mailOptions = {
        from: "DriveHop",
        to: email,
        subject: "DriveHop Admin Registration code",
        text: `Your registration code\`: ${txt}`
    };
    transport.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
            throw new Error(error);
        } else {
            console.log("Email sent: " + info.response);
            const tokenAdmin = new TokenPhone({
                id: `tok_${uniqid()}`,
                token: txt,
                for: "admin",
                createdDate: new Date()
            });
            await tokenAdmin.save();
        }
    });
}

module.exports = {
    sendMail,
};