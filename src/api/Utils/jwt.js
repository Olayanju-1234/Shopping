const jwt = require('jsonwebtoken')

// create access token
const generateToken = ({payload}) =>{
  const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
          expiresIn: process.env.JWT_EXPIRES
      }
  );
  return token; 
};

// verify access token
const verifyToken = (token) => {
    const tk = jwt.verify(token, process.env.JWT_SECRET);
    return tk;
};

// attach access token to cookies
const attachTokenToCookies = ({res,user,refreshToken}) =>{
  const accesssTokenJ = generateToken({payload: {user}})
  const refreshTokenJ = generateToken({payload: {user,refreshToken}})

  // cookies setup
  const oneDay = 1000 * 60 * 60 * 24;
  const longExp = 1000 * 60 * 60 * 24 * 30;


  res.cookie('accessToken', accesssTokenJ, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      signed: true        
  });

  res.cookie('refreshToken', refreshTokenJ, {
      httpOnly: true,
      expires: new Date(Date.now() + longExp),
      secure: process.env.NODE_ENV === 'production',
      signed: true        
  });
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



module.exports = { 
    generateToken, 
    verifyToken,
    attachTokenToCookies  
};