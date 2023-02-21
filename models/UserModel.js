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
    }
})

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchedPassword = async (checkPassword) => {
    return await bcrypt.compare(checkPassword, this.password)
}
module.exports = mongoose.model('User', userSchema);