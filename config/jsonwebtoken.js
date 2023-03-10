const jwt = require('jsonwebtoken')

// create access token
const generateAccessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// verify access token
const verifyAccessToken = (token) => {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user
};


module.exports = { generateAccessToken, verifyAccessToken };