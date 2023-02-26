const mongoose = require("mongoose");
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

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
    address : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    wishlist : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
},
    {timestamps: true})

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchedPassword = async function (checkPassword) {
    return await bcrypt.compare(checkPassword, this.password)
}

module.exports = mongoose.model('User', userSchema);