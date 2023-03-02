const nodemailer = require('nodemailer');
require('express-async-errors');

const sendEmail = async (message, req, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.GMAIL_ID, // generated ethereal user
          pass: process.env.GMAIL_PASSWORD, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <horlarhyanjuhjoseph@gmail.com>', // sender address
        to: message.to,// list of receivers
        subject: message.subject, // Subject line
        text: message.text, // plain text body
        html: message.html, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }


module.exports = sendEmail;