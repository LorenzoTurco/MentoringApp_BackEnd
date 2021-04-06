const router = require('express').Router()
const verify = require('../middlewares/authorise')
const User = require('../model/User')
const UserProfile = require('../model/UserProfile')

router.get('/name/:name', async (req,res) =>{
    const name = req.params.name
    console.log(name)
    const mentors = await UserProfile.find({name: {$regex: name, $options: 'i'}}).limit(10);

    res.send({mentors: mentors})
    
})




//search by name
//search by tags
//search by 



module.exports = router