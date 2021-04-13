const MessageLog = require('../model/MessageLog')
const jwt = require('jsonwebtoken')

module.exports.chatMessage = function (data){
    console.log(data);
    saveMessageInMessageLog(data)
}

function verifyUser(data){
    const token = data.userToken
    console.log(token)
    try{
        return jwt.verify(token, process.env.SECRET_TOKEN)
    }catch (err){
        console.log(error)
    }
}
async function saveMessageInMessageLog(data){
    const senderId = verifyUser(data)
    var senderMessageLog = await MessageLog.findOne({userId: senderId})
    if(!senderMessageLog){
        const newSenderMessageLog = new MessageLog({userId : senderId, messages: []}) //changed to messages from message??
        try{
           const savedMessageLog = await newSenderMessageLog.save()
            if(savedMessageLog) {senderMessageLog = await MessageLog.findOne({userId: senderId})}
        }catch(err){
            console.log(err)
        }
    }
    senderMessageLog.messages.push({receiverId: data.receiverId, text: data.message[0].text, createdAt: data.message[0].createdAt})
    
    senderMessageLog.save()
    
}




