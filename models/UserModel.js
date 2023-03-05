const mongoose = require("mongoose");
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new Schema({
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role: {
        type : String,
        default : "user"
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    cart: {
        type :  Array,
        default : []
    },
    address : {
        type : String
    },
    wishlist : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken : {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},
{
    timestamps: true
}
);

userSchema.pre("save",  async function(next) {
    if (!this.isModified("password")) { 
        next()
    };
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.methods.matchedPassword = async function (checkPassword) {
    return await bcrypt.compare(checkPassword, this.password)
}

userSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return resetToken;
    
}

module.exports = mongoose.model('User', userSchema);