const mongoose = require('mongoose')

const Experience = new mongoose.Schema({
    title: {
        type : String,
        requried: true
    },
    monthFrom: {
        type : String,
    },
    monthTo: {
        type : String,
    },
    fromYr: {
        type : String,
    },
    toYr: {
        type : String,
    },
    desc: {
        type : String,
    }
})

const mentorProfileSchema = new mongoose.Schema({
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
  },
  experiences: {
    type: [Experience]
  },
  aboutMe: {
      type: String
  },
})

module.exports = mongoose.model('MentorProfile', mentorProfileSchema)