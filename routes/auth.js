const router = require('express').Router();
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//todo make it using then instead
router.post('/signup', async (req,res) =>{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    
    const user = new User({
        email : req.body.email,
        password : hashedPassword
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
    if (!userExists) return res.status(400).send('Email doesn\'t exist') 

    const validatePassword = await bcrypt.compare(req.body.password, userExists.password)

    if(!validatePassword) return res.status(400).send('Incorrect Password') 
    // res.send("Successful")
    
    const token = jwt.sign({_id: userExists._id}, process.env.SECRET_TOKEN)
    res.header('auth-token', token).send(token)

})



module.exports = router