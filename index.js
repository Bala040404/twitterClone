const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocal = require('passport-local')
const session = require('express-session')
const app = express()
const { User } = require('./schemas/user.js')
const methodOverride = require('method-override');
app.use(methodOverride('_method'))



app.use(express.static('public'));
//tweets will also be stored inside User
//User
// |__tweets
// |__users


mongoose.connect('mongodb://127.0.0.1:27017/User');


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

passport.use(User.createStrategy())



const { twitterRouter } = require('./router/twitter.js')


app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use('/twitter', twitterRouter)


app.listen(8000)
