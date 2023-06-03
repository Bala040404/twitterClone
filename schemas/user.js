const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = mongoose.Schema({
    age: Number,
    followers: [{ type: mongoose.Schema.Types.ObjectId }],
    picture: String

})
userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema)

module.exports.User = User



