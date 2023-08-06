const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

// create access token
const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.expiresIn });

// verify access token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const expiresInToSeconds = (expiresIn) => {
    const [amount, unit] = expiresIn.split(/(\d+)/).filter(Boolean);
    const unitInSeconds = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 60 * 60 * 24,
    };
  
    return amount * unitInSeconds[unit];
}

const attachTokenToCookies = (res, token) => {
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresInToSeconds(expiresIn),
    });
  };

module.exports = { 
    generateToken, 
    verifyToken,
    attachTokenToCookies  
};