const mongoose = require('mongoose')


const Message = new mongoose.Schema({
    receiverId: {
        type: String,
        requried: true,
    },
    text: {
        type : String,
        requried: true
    },
    createdAt: {
        type : String,
    }
})

const MessageLog = new mongoose.Schema({
    userId: {
        type: String,
        requried: true,
    },
    messages: {
        type: [Message]
    }
})

module.exports = mongoose.model('MessageLog', MessageLog)
