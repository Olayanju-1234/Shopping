const nodemailer = require('nodemailer');

const sendEmail = async (message, req, res) => {
    let transporter = nodemailer.createTransport({
        host: process.env.GMAIL_HOST,
        port: process.env.GMAIL_PORT,
        secure: false, 
        auth: {
          user: process.env.GMAIL_ID, 
          pass: process.env.GMAIL_PASSWORD,
        },
      });
    
      const info = await transporter.sendMail({
        from: `${process.env.GMAIL_ID}`, 
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
    
      console.log("Message sent: %s", info.messageId);
    }


module.exports = sendEmail;