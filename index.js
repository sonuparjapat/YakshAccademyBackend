const express=require('express')
const cors=require("cors")
const http = require('http'); // Import the HTTP module
const socketIo = require('socket.io'); // Import Socket.io
const {auth}=require("./Middleware/auth")
const {connection}=require("./Medels/AuthenticationModel")
const { authRouter } = require('./Controls/loginstystem')
const {  profileRouter } = require('./Controls/controlsystem')

const { assignmentRouter } = require('./Controls/assignmentControl')
const app=express()
const corsOptions = {
    origin: 'http://your-frontend-domain.com', // Replace with your frontend's actual domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable credentials (cookies, headers) if needed
  };
app.use(cors(corsOptions))
app.use(express.json())

//
// |||||||||||||||||||||||||||
app.get("/",async(req,res)=>{
    res.status(200).json({msg:"Welcome To The YakshAcademy Backend"})
})
app.use("/user",authRouter)
app.use("/assignment",auth,assignmentRouter)

app.use("/userdata",auth,profileRouter)
const server=app.listen(8080,async()=>{
   try{

   await connection
    console.log("connected to database ") }catch(err){
        console.log(err)
    }
    console.log("port is running fine at port no.8080")
})
const io = socketIo(server);

// Set up a WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
module.exports={server,io}