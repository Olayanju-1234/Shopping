const sendEmail = require('./nodemailer')

const sendPasswordResetMail = async (to, token) => {
    const subject = 'Password Reset'

    const html_content = `
        <h1>Reset your password</h1>
        <p>Click <a href="http://localhost:3000/reset-password/${token}">here</a> to reset your password</p>
    `

    await sendEmail(to,
        subject,
        html_content)
}

module.exports = sendPasswordResetMail