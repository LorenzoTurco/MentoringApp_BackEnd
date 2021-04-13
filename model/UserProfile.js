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
  },
  tags: {
    type: [String],
    }


})

module.exports = mongoose.model('UserProfile', userProfileSchema)