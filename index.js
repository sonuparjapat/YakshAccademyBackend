const express=require('express')
const cors=require("cors")
const http = require('http'); // Import the HTTP module
const socketIo = require('socket.io'); // Import Socket.io
const {Server}=require("socket.io")
const {auth}=require("./Middleware/auth")
const {connection}=require("./Medels/AuthenticationModel")
const { authRouter } = require('./Controls/loginstystem')
const {  profileRouter } = require('./Controls/controlsystem')

const { assignmentRouter } = require('./Controls/assignmentControl')
const app=express()


app.use(cors())
app.use(express.json())
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000', // Replace with your frontend's URL
      methods: ['GET', 'POST'],
      credentials: true, // If needed
    },
  });

// Set up a WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });
 
});
io.emit('new-assignment', { assignment:"a new assignment added" });
//
// |||||||||||||||||||||||||||
app.get("/",async(req,res)=>{
    res.status(200).json({msg:"Welcome To The YakshAcademy Backend"})
})
app.use("/user",authRouter)
app.use("/assignment",auth,assignmentRouter)

app.use("/userdata",auth,profileRouter)
server.listen(8080,async()=>{
   try{

   await connection
    console.log("connected to database ") }catch(err){
        console.log(err)
    }
    console.log("port is running fine at port no.8080")
})

module.exports={server,io}