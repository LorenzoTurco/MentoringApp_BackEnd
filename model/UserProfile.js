const mongoose = require('mongoose')

const userProfileSchema = new mongoose.Schema({
  userId: {
      type: String,
      requried: true,
  },
  name:{
      type: String,
  },
  header:{
      type: String, 
  }

  //need to store tags to search them by 

})

module.exports = mongoose.model('UserProfile', userProfileSchema)