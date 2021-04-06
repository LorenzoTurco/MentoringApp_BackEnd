const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const searchRoute = require('./routes/search')

const cors = require('cors')
dotenv.config()

connectDB()
app.use(cors())
app.use(express.json())

app.use('/user',authRoute)
app.use('/search',searchRoute)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


const UserProfile = require('./model/UserProfile')
app.post('/newmentor', async (req,res) =>{
   console.log("hey")
  const user = new UserProfile({
      userId : req.body.userId,
      name : req.body.name,
      header: req.body.header
  })
  try{
      const savedUser = await user.save();
      res.send(savedUser)
  }
  catch(err){
      res.status(400).send(err)
  }

})


io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(process.env.PORT, () => {
  console.log('listening on:' + process.env.PORT);
});


