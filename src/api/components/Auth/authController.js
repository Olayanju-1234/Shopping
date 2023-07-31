const User = require('../User/UserModel')
const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateAccessToken} = require('../../../config/tokens')
const AppError = require('../../Errors')
const validateMongoId = require('../../../utils/validateMongoId');
const sendEmail = require('../../../utils/nodemailer');


const register = async (req, res) => {
    const {firstName, lastName, email, username, password} = req.body

    if (!email || !username || !password) {
        throw new AppError.BadRequestError('Make sure all required fields are filled')
    }

    const emailExists = await User.findOne({email})
    if(emailExists) {
        throw new AppError.ConflictError("Email taken")
    }
   
    if (Object.keys(req.body).length === 0) {
        throw new AppError.BadRequestError("Please provide a valid data")
    }

    const usernameExists = await User.findOne({username})
    if(usernameExists) {
        throw new AppError.ConflictError("Username taken")
    }

    const newUser = await User.create({
        firstName, lastName, email, username, password
    })

    res.status(StatusCodes.CREATED).json({
        success : true,
        user: newUser
    })

}

const login = async (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        throw new AppError.BadRequestError('Make sure all required fields are filled')
    }

    const usernameExists = await User.findOne({username})
    if(!usernameExists) {
        throw new AppError.NotFoundError("User not found, Please register")
    }

    if (Object.keys(req.body).length === 0) {
        throw new AppError.BadRequestError("Please provide a valid data")
    }

    const passwordMatch = await usernameExists.matchedPassword(password)
    if(!passwordMatch) {
        throw new AppError.UnauthorizedError("Incorrect password")
    }
    const refreshToken = await generateRefreshToken(usernameExists._id)
    await User.findByIdAndUpdate(usernameExists._id, {refreshToken: refreshToken},
        {new:true});
    res.cookie('refreshToken', refreshToken, {
        httpOnly:true,
        maxAge:72 * 60 * 60 * 1000
    }
    )
    res.status(StatusCodes.OK).json({
        success : true,
        user: usernameExists,
        token: generateAccessToken(usernameExists._id)
    })
}

const adminLogin = async (req, res) => {
    const {username, password} = req.body
 
    if (!username || !password) {
        throw new AppError.BadRequestError('Make sure all required fields are filled')
    }

    const user = await User.findOne({username})
    if(!user) {
        throw new AppError.NotFoundError("User not found, Please register")
    }
    
    if( user.role !== 'admin') {
        throw new AppError.UnauthorizedError("You are not an admin")
    }

    if (Object.keys(req.body).length === 0) {
        throw new AppError.BadRequestError("Please provide a valid data")
    }

    const passwordMatch = await user.matchedPassword(password)

    if(!passwordMatch) {
        throw new AppError.BadRequestError("Incorrect password")
    }
    const refreshToken = await generateRefreshToken(user._id)

    await User.findByIdAndUpdate(user._id, {refreshToken: refreshToken},
        {new:true});

    res.cookie('refreshToken', refreshToken, {
        httpOnly:true,
        maxAge:72 * 60 * 60 * 1000
    }
    )
    res.status(StatusCodes.OK).json({
        success : true,
        user: user,
        token: generateAccessToken(user._id)
    })
}

const handleRefreshToken = async (req, res) => {
    const cookie = req.cookies
    if(!cookie.refreshToken) {
        throw new AppError.BadRequestError("No refresh token")
    }

    const refreshToken = cookie.refreshToken

    const user = await User.findOne({refreshToken});
    if(!user) {
        throw new AppError.BadRequestError("No user found/ Please login or register/ No refresh token")
    }   
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new AppError.BadRequestError("Invalid refresh token")
        }
        const accessToken = generateAccessToken(user.id)
        res.status(StatusCodes.OK).json({
            success : true,
            token: accessToken
    })
})}

const logout = async (req, res) => {
    const cookie = req.cookies

    if(!cookie.refreshToken) {
        throw new AppError.BadRequestError("No refresh token")
    }

    const refreshToken = cookie.refreshToken

    const user = await User.findOne({ refreshToken });

    if(!user) {
        res.clearCookie('refreshToken', {
            httpOnly:true,
            secure : true})
        throw new AppError.ForbiddenError("No user found/ Please login or register/ No refresh token")
    }

    await User.findOneAndUpdate({refreshToken}, {refreshToken: null})
    
    res.clearCookie('refreshToken', {
        httpOnly:true,
        secure : true})
    res.status(StatusCodes.OK).json({
        success : true,
        message: "Logged out successfully"
    })
}

const updatePassword = async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoId(_id)
    const user = await User.findById(_id)

    if(password) {
        user.password = password
        const updatedPassword = await user.save()

        res.status(StatusCodes.OK).json({
            success : true,
            user: updatedPassword
            
        })
    } else {
        throw new AppError.BadRequestError("Please provide a valid data")

    }
}

const resetPasswordToken = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new AppError.BadRequestError('Make sure all required fields are filled')
    }
    const user = await User.findOne({email})

    if(!user) {
        throw new AppError.NotFoundError("User not found")
    }
    const resetToken = await user.getResetPasswordToken()
    await user.save()

    const resetUrl = `Hi, ${user.username} \n\n Please click on the link below to reset your password \n\n ${process.env.CLIENT_URL}/api/v1/auth/resetpassword/${resetToken}, it expires in 10 minutes`
    
    const message = {
        to: user.email,
        text: "Hey there, you're receiving this email because you (or someone else) have requested the reset of a password",
        subject: "Password Reset",
        html: resetUrl,
    }

    await sendEmail(message)

    res.status(StatusCodes.OK).json({
        success : true,
        resetToken
    })

}

const resetPassword = async(req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
        throw new AppError.BadRequestError('Make sure all required fields are filled')
    }

    if (!token) {
        throw new AppError.UnauthorizedError('Token not found')
    }

    const hashedToken = crypto.createHash('sha256')
                            .update(token)
                            .digest('hex')

    const user = await User.findOne({passwordResetToken: hashedToken,
                            passwordResetExpires: {
                                $gt: Date.now()
                            },
                        })

    if (!user) {
        throw new AppError.BadRequestError("Token Expired, try again")
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save()

    res.status(StatusCodes.OK).json({
        success : true,
        message: "Password reset successful"
    })
}


module.exports = {
    register,
    login,
    adminLogin,
    logout,
    handleRefreshToken,
    updatePassword,
    resetPasswordToken,
    resetPassword
}