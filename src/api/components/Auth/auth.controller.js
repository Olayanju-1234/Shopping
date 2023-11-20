const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Token = require('@token/token');
const User = require('@user/user.model');
const { 
  attachTokenToCookies, 
  generateToken, 
  SuccessResponse, 
  ErrorResponse } = require('@utils');
const { 
  BadRequestError, 
  ConflictError, 
  ForbiddenError, 
  NotFoundError, 
  UnauthorizedError } = require('@errors');
const sendPasswordResetMail = require('@services/emails/sendPasswordResetMail');

const register = async (req, res) => {
  try {
    const { email, username, password, ...other } = req.body;

    if (!email || !username || !password) {
      throw new BadRequestError('Make sure all required fields are filled');
    }

    const usernameOrEmailExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (usernameOrEmailExists) {
      throw new ConflictError('Username or email already exists');
    }

    const newUser = await User.create(req.body);

    SuccessResponse(res, newUser, 'User created successfully');
  } catch (error) {
    ErrorResponse(res, error.statusCode || 500, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError('Please provide the required values');
    }

    const user = await User.findOne({ username });

    if (!user || !(await user.matchedPassword(password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    let givenToken = '';
    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken?.isValid) {
      givenToken = existingToken.refreshToken;
    } else {
      givenToken = existingToken?.refreshToken || crypto.randomBytes(40).toString('hex');

      if (!existingToken) {
        const userAgent = req.headers['user-agent'];
        await Token.create({ givenToken, userAgent, user: user._id });
      }
    }

    const userToken = {
      username: user.username,
      email: user.email,
      role: user.role,
      userId: user._id,
    };

    attachTokenToCookies({ res, user: userToken, givenToken });
    SuccessResponse(res, userToken, 'Login successful');
  } catch (error) {
    ErrorResponse(res, error.statusCode || 500, error.message);
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError('Make sure all required fields are filled');
    }

    const user = await User.findOne({ username });

    if (!user) {
      throw new NotFoundError('User not found, Please register');
    }

    if (user.role !== 'admin') {
      throw new UnauthorizedError('You are not an admin');
    }

    const passwordMatch = await user.matchedPassword(password);

    if (!passwordMatch) {
      throw new BadRequestError('Incorrect password');
    }

    const refreshToken = await generateToken(user._id);

    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken }, { new: true });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    SuccessResponse(res, user, 'Login successful');
  } catch (error) {
    ErrorResponse(res, error.statusCode || 500, error.message);
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new BadRequestError('No refresh token');
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      throw new BadRequestError('No user found/ Please login or register/ No refresh token');
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new BadRequestError('Invalid refresh token');
      }

      const accessToken = generateToken(user.id);

      SuccessResponse(res, accessToken, 'Token refreshed successfully');
    });
  } catch (error) {
    ErrorResponse(res, error.statusCode || 500, error.message);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new BadRequestError('No refresh token');
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
      });

      throw new ForbiddenError('No user found/ Please login or register/ No refresh token');
    }

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });

    SuccessResponse(res, { success: true }, 'Logout successful');
  } catch (error) {
    ErrorResponse(res, error.statusCode || 500, error.message);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { user: { _id }, body: { password } } = req;

    const user = await User.findById(_id);

    if (password) {
      user.password = password;
      const updatedPassword = await user.save();

      SuccessResponse(res, user, 'Password updated successfully');
    } else {
      throw new BadRequestError('Please provide a valid data');
    }
  } catch (error) {
    ErrorResponse(res, error.statusCode || 500, error.message);
  }
};

const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError('Make sure all required fields are filled');
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const resetToken = await user.getResetPasswordToken();
    await user.save();

    await sendPasswordResetMail(email, resetToken);

    SuccessResponse(res, { success: true }, 'Password reset token sent to email');
  } catch (error) {
    ErrorResponse(res, error.statusCode || 500, error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      throw new BadRequestError('Make sure all required fields are filled');
    }

    if (!token) {
      throw new UnauthorizedError('Token not found');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      throw new BadRequestError('Token Expired, try again');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    SuccessResponse(res, { success: true }, 'Password reset successful');
  } catch (error) {
    ErrorResponse(res, error.statusCode || 500, error.message);
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  logout,
  handleRefreshToken,
  updatePassword,
  resetPasswordToken,
  resetPassword,
};
