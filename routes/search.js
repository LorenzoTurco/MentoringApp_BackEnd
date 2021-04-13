const router = require('express').Router()
const verify = require('../middlewares/authorise')
const User = require('../model/User')
const UserProfile = require('../model/UserProfile')

const TAGLIST =  ["AI", "HR", "Scientist", "Career", "Music", "Leadership"]

router.get('/name/:name', async (req,res) =>{
    const name = req.params.name
    console.log(name)
    const mentors = await UserProfile.find({name: {$regex: name, $options: 'i'}}).limit(10);

    res.send({mentors: mentors})
})

router.get('/taglist', (req,res) =>{
    res.send({list: TAGLIST})
})

router.post('/bytags', async (req,res) =>{
    console.log(req.body.selectedTags)
    var selectedTags = []
    req.body.selectedTags.forEach((item,i) =>{
        if(item){
            selectedTags.push(i.toString())
        }
    })

    console.log(selectedTags);
    const mentors = await UserProfile.find({tags: {$in : selectedTags} }).limit(10)
    res.send({mentors: mentors})


})



//search by name
//search by tags
//search by 



module.exports = router