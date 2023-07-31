const jwt = require('jsonwebtoken')

// create access token
const generateRefreshToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = { generateRefreshToken }
