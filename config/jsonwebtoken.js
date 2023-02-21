const jwt = require('jsonwebtoken')

const generateAccessToken = (username) => {
    return jwt.sign({username}, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 });
}

module.exports = { generateAccessToken };