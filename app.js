const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const userRoute = require('./routes/user')
const searchRoute = require('./routes/search')
const chatRoute = require('./routes/chat')
const chatMod = require('./routes/chatSocket')

const cors = require('cors')
dotenv.config()

connectDB()
app.use(cors())
app.use(express.json())

app.use('/user',userRoute)
app.use('/search',searchRoute)
app.use('/chat',chatRoute)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const UserProfile = require('./model/UserProfile')
const MentorProfile = require('./model/MentorProfile')
app.post('/newmentor', async (req,res) =>{
   console.log("hey")
   console.log(req.body.tags)
  const mentor = new MentorProfile({
      userId : req.body.userId,
      name : req.body.name,
      header: req.body.header,
      tags: req.body.tags,
      experiences: req.body.experiences,
      aboutMe: req.body.aboutMe
  })
  try{
      const savedMentor = await mentor.save();
      res.send(savedMentor)
  }
  catch(err){
      res.status(400).send(err)
  }

})

app.get('/test', (req,res) =>{
  console.log("contacted backend")
  res.send(req.body)
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', ()=>{
    console.log("disconnected")
  })
  socket.on("chat message", (data) =>{
    chatMod.chatMessage(data)
    io.emit("update messages", {yes:"hi"})
  });
});

io.on("Test",(d)=>{
  console.log("hit")
})

http.listen(process.env.PORT, () => {
  console.log('listening on:' + process.env.PORT);
});





