const jwt = require('jsonwebtoken')

// create access token
const generateAccessToken = ({username}) => {
    const token =  jwt.sign({username}, process.env.TOKEN_SECRET, { expiresIn: process.env.expiresIn });
    return token
};

// verify access token
const verifyAccessToken = ({token}) => {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    return user
};


module.exports = { generateAccessToken, verifyAccessToken };