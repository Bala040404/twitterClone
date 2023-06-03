const mongoose = require('mongoose')
const { User } = require('./user')


const tweetSchema = mongoose.Schema(
    {
        tweet: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        },
        img: String
    }
)

const Tweet = mongoose.model('Tweet', tweetSchema)

module.exports.Tweet = Tweet