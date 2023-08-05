const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

// create access token
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// verify access token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

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

const attachTokenToCookies = ({res, user, token}) => {
    
    const accessToken = generateToken({
        payload: {user}
    })

    const refreshToken = generateToken({
        payload: {user}
    })

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresInToSeconds(expiresIn),
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresInToSeconds(expiresIn),
      });

}

module.exports = { 
    generateToken, 
    verifyToken,
    attachTokenToCookies  
};