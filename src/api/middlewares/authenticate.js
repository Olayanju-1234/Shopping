
const {
    verifyToken,
    attachTokenToCookies
} = require('../utils/index')

const Token = require('../tokens/token')
const User = require('../components/User/UserModel')

const { UnauthorizedError, BadRequestError,  } = require('../errors')

const authenticateUser = (req,res,next) =>{

  const {accessToken} = req.signedCookies;

  try {
      if(accessToken){
          const payload = verifyToken(accessToken);
          req.user = payload.user;
          return next()
      }    

      const payload =  verifyToken(accessToken);
      const existingToken = Token.findOne({
          user: payload.user.userId,
          refreshToken: payload.refreshToken
      });

      if(!existingToken || !existingToken?.isValid){
          throw new UnauthorizedError('Authentication Failed')
      }

      attachTokenToCookies({res, user: payload.user, refreshToken:existingToken.refreshToken});
      req.user = payload.user;
      next();

  } catch (error) {
      throw new BadRequestError('Authentication failed');
  }
}

const isAdmin = async (req, res, next) => {
    const { username } = req.user
    const adminRole = await User.findOne({ username });
    if (adminRole.role !== "admin") {
        throw new UnauthorizedError("You are not an admin")
    } else {
        next();
    }
}


module.exports = {
                  isAdmin,
                  authenticateUser, 
                }
