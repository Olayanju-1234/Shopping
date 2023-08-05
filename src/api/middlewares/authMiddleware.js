const {
    generateToken, 
    verifyToken,
    attachTokenToCookies
} = require('../utils/index')

const User = require('../components/User/UserModel')

const { UnauthorizedError } = require('../errors/')


const authenticateUser = (req, res, next) => {

    const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    attachTokenToCookies(res, token);

    req.user = user;
    next();

  } catch (err) {

    return res.status(401).json({ error: 'Invalid token' });
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


module.exports = {authenticateUser, 
                  isAdmin
                }
