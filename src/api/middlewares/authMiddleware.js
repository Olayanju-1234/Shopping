const {
    generateToken, 
    verifyToken,
    attachTokenToCookies
} = require('../utils/index')

const User = require('../components/User/UserModel')

const { UnauthorizedError } = require('../errors/')



const authenticateUser = (req, res, next) => {
  // Check if the request contains a token in the cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token and store the user data in the request object
    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // If the token is valid, attach it to the response cookies for future requests
    attachTokenToCookies(res, token);

    // Store the user data in the request object for further use in protected routes
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};



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
