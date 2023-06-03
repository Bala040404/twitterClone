if (process.env.NODE_ENV !== "productions") {
    require('dotenv').config()
}

const express = require('express')

const passport = require('passport')
const router = express.Router()
const { User } = require('../schemas/user.js')
const { Tweet } = require('../schemas/tweet.js')

const multer = require('multer')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.secret
})


const { CloudinaryStorage } = require('multer-storage-cloudinary')
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'twitter',
        allowedFormats: ['jpeg', 'png', 'jpg',]
    }

})

const upload = multer({ storage })

router.get('/', async (req, res) => {

    if (req.user) {
        const curuser = await User.findById(req.user._id)
        const followers = curuser.followers
        followers.push(curuser._id)


        const tweets = await Tweet.find({ user: { $in: followers } }).populate('user');

        res.render('home.ejs', { tweets: tweets, req })
    } else {
        res.render('front.ejs')
    }
})
router.post('/', upload.single("img"), async (req, res) => {
    const { tweet } = req.body
    const { path } = req.file
    const id = req.user._id
    await Tweet.insertMany({ tweet, user: id, img: path })


    res.redirect('/twitter')
})
router.get('/find', async (req, res) => {
    const id = req.user._id
    const users = await User.find()
    const cur_user = await User.findOne({ _id: id });
    const cur_user_age = cur_user.age



    res.render('find.ejs', { id, users, cur_user_age })
})
router.get("/follow/:id", async (req, res) => {
    const { id } = req.params
    await User.updateOne({ _id: req.user._id }, {
        $push: {
            followers: id
        }
    })
    res.redirect('/twitter')

})
router.get('/new', (req, res) => {
    res.render('new.ejs')
})


router.get('/edit/:id', async (req, res) => {

    const { id } = req.params
    const tweet = await Tweet.findOne({ _id: id });

    res.render('edit.ejs', { tweet })
})

router.patch('/:id', upload.single('img'), async (req, res) => {

    const { id } = req.params
    const { path } = req.file
    const { tweet } = req.body;
    await Tweet.findByIdAndUpdate(id, { tweet: tweet, img: path })

    res.redirect('/twitter')
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    await Tweet.findByIdAndDelete(id);
    res.redirect('/twitter')
})




router.get('/register', (req, res) => {
    res.render('register.ejs')
})
router.post('/register', upload.single("dp"), async (req, res) => {
    const { username, password, age } = req.body
    const newuser = await new User({ username: username, age: age, picture: req.file.path })
    await User.register(newuser, password)

    res.redirect('/twitter')
})


router.get('/login', (req, res) => {
    res.render('login.ejs')
})
router.post('/login', passport.authenticate('local', { failureRedirect: "/twitter/login", failureMessage: "incorrects" }), (req, res) => {


    res.redirect('/twitter')
})



module.exports.twitterRouter = router