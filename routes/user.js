const router = require('express').Router();
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verify = require('../middlewares/authorise')
const UserProfile = require('../model/UserProfile')





//user/profile  GET
router.get('/profile',verify, async(req,res)=>{
    const userId = req.userId
    const user = await UserProfile.findOne({userId: userId})    
    if(user){
        res.send({
            name: user.name,
            tags: user.tags,
            aboutMe: user.aboutMe,
            exp: user.experiences
        })
    }
    res.send("ERROR")
})

router.post('/profile/add', async (req,res)=>{
    const userProfile = new UserProfile({
        userId : req.body.userId,
        name : req.body.name,
        header: req.body.header,
        tags: req.body.tags,
        experiences: req.body.experiences,
        aboutMe: req.body.aboutMe,
        calendar:req.body.calendar,
    })
    try{
        const userProfile = await mentor.save();
        res.send(userProfile)
    }
    catch(err){
        res.status(400).send(err)
    }
})

router.post('/signup', async (req,res) =>{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    
    const user = new User({
        email : req.body.email,
        password : hashedPassword,
        isAdmin : req.body.isAdmin
    })

    try{
        const savedUser = await user.save();
        res.send(savedUser)
    }
    catch(err){
        res.status(400).send(err)
    }

})

router.post('/signin', async (req,res) =>{
    console.log(req.body.email)

    const userExists = await User.findOne({email: req.body.email})
    if (!userExists) return res.status(400).send({msg: 'Email doesn\'t exist'}) 
    const validatePassword = await bcrypt.compare(req.body.password, userExists.password)
    if(!validatePassword) return res.status(400).send({msg: 'Incorrect Password'}) 
    // res.send("Successful")
    const token = jwt.sign({_id: userExists._id}, process.env.SECRET_TOKEN)
    res.header('auth-token', token).send({token: token, isAdmin: userExists.isAdmin})

})

router.get('/isAdmin', verify,  async(req,res) =>{
    const userExists = await User.findOne({userId: req.userId})
    console.log(userExists)
    return res.send({msg:userExists.isAdmin})
    
})


module.exports = router

