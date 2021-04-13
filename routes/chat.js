const router = require('express').Router()
const verify = require('../middlewares/authorise')
const MessageLog = require('../model/MessageLog')


router.post('/latestmessages',verify, async (req,res) =>{
    console.log("hit")
    const userId = req.userId
    console.log(userId)
    const messageLog = await MessageLog.findOne({userId: userId})
    if(messageLog){
        const latestMessages = getLatestMessages(messageLog.messages)
        return res.send({messages : latestMessages})
    }
    res.send({messages: []})
})

function getLatestMessages(messages){
    let hashMap = new Map()
    messages.forEach((item) =>{
        if(!hashMap.has(item.receiverId)){
            hashMap.set(item.receiverId, 
                {receiverId: item.receiverId,
                 receiverName: "num1",
                 createdAt: item.createdAt,
                 text : item.text
                })
        }else{
            if(getTimeCreated(hashMap.get(item.receiverId).createdAt) < getTimeCreated(item.createdAt)){
                hashMap.set(item.receiverId, 
                    {receiverId: item.receiverId,
                     receiverName: "num1",
                     createdAt: item.createdAt,
                     text : item.text
                    })
            } 
        }
    })
    var output = []
    hashMap.forEach((item) =>{
        output.push(item)
    })
    return output
}
const Data = {
    messages: [
        {
            receiverId: "606a6926370df01aff131237",
            text: 'new text' + new Date(),
            createdAt: new Date()
        }
    ]
}
router.post('/dummydata', async (req,res)=>{
    const senderId = req.body.userId;
    const newSenderMessageLog = new MessageLog({userId : senderId, messages: []})
        try{
           const savedMessageLog = await newSenderMessageLog.save()
            if(savedMessageLog) {senderMessageLog = await MessageLog.findOne({userId: senderId})}
        }catch(err){
            console.log(err)
        }
    senderMessageLog.messages.push({receiverId: Data.messages[0].receiverId, text: Data.messages[0].text, createdAt: Data.messages[0].createdAt})
    
    senderMessageLog.save()
})




const getTimeCreated = (timeString) => {
    return new Date(timeString).getTime()
}

const DEFAULT_SENDER_ID = 999

router.post('/contactmessages',verify, async (req,res) =>{
    const userId = req.userId
    const receiverId = req.body.receiverId
    console.log(receiverId)
    //NEED RECEIVER ID THEN CHECK THEY SENT MESSAGES
    var output = []
    const userMessageLog = await MessageLog.findOne({userId: userId})
    const receiverMessageLog = await MessageLog.findOne({userId : receiverId})
    if(userMessageLog){
        output = appendSentMessages(userMessageLog,receiverId,output)
        //console.log("userMessages: " + output)
    }
    if(receiverMessageLog){
        appendSentMessages(receiverMessageLog,userId,output)
    }

    console.log(output)
    res.send({messages: output})
})

function appendSentMessages(userMessageLog,receiverId,output){
    userMessageLog.messages.forEach((item)=>{
       // console.log(item.receiverId)
        if(item.receiverId == receiverId){
            output.push(formatMessage(item,receiverId))
        }
    })
    return output
}

function formatMessage(item,receiverId){
    return ({
        _id: item._id,
            text: item.text,
            createdAt: item.createdAt,
            user: {
              _id: DEFAULT_SENDER_ID,
            //   name: "receiverName",
            //   avatar: 'https://placeimg.com/140/140/any',
            }
    })
}

// setMessages([
//     //   {
//     //     _id: 1,
//     //     text: 'Hello developer',
//     //     createdAt: new Date(),
//     //     user: {
//     //       _id: receiverId,
//     //       name: receiverName,
//     //       avatar: 'https://placeimg.com/140/140/any',
//     //     },
//     //   },
//     // ])


module.exports = router