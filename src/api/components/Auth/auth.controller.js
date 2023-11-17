const Token = require('../../tokens/token');
const User = require('../User/user.model');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { attachTokenToCookies, generateToken } = require('../../../utils');
const { BadRequestError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } = require('../../errors');
const sendPasswordResetMail = require('../../services/emails/sendPasswordResetMail');

const register = async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  if (!email || !username || !password) {
    throw new BadRequestError('Make sure all required fields are filled');
  }

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new ConflictError('Email already exists');
  }

  const usernameExists = await User.findOne({ username });

  if (usernameExists) {
    throw new ConflictError('Username taken');
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    username,
    password,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: newUser,
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError('Please provide the need values');
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new NotFoundError(`User doesn't exist, Please sign up`);
  }

  const isPasswordCorrect = await user.matchedPassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestError(`Invalid password, check and try again`);
  }

  var givenToken = '';

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthorizedError('your are temporarily restricted from this app.');
    }

    givenToken = existingToken.refreshToken;

    const userToken = { username: user.username, email: user.email, role: user.role, userId: user._id };
    attachTokenToCookies({ res, user: userToken, givenToken });

    res.status(StatusCodes.OK).json({ success: true, user: userToken });
    return;
  }

  givenToken = crypto.randomBytes(40).toString('hex');

  const userAgent = req.headers['user-agent'];

  const userT = { givenToken, userAgent, user: user._id };

  await Token.create(userT);

  const userToken = { username: user.username, email: user.email, role: user.role, userId: user._id };
  attachTokenToCookies({ res, user: userToken, givenToken });

  res.status(StatusCodes.OK).json({ success: true, user: userToken });
};

const adminLogin = async (req, res) => {
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
  res.status(StatusCodes.OK).json({
    success: true,
    user: user,
    token: generateToken(user._id),
  });
};

const handleRefreshToken = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie.refreshToken) {
    throw new BadRequestError('No refresh token');
  }

  const { refreshToken } = cookie;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new BadRequestError('No user found/ Please login or register/ No refresh token');
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new BadRequestError('Invalid refresh token');
    }

    const accessToken = generateToken(user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      token: accessToken,
    });
  });
};

const logout = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie.refreshToken) {
    throw new BadRequestError('No refresh token');
  }

  const { refreshToken } = cookie;

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

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Logged out successfully',
  });
};

const updatePassword = async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;

  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedPassword = await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      user: updatedPassword,
    });
  } else {
    throw new BadRequestError('Please provide a valid data');
  }
};

const resetPasswordToken = async (req, res) => {
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

  res.status(StatusCodes.OK).json({
    success: true,
    resetToken,
  });
};

const resetPassword = async (req, res) => {
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

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Password reset successful',
  });
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
