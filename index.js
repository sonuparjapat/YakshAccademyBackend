

const express=require('express')
const cors=require("cors")

const {Server}=require("socket.io")
const {createServer}=require("http")
const {auth}=require("./Middleware/auth")
const {connection}=require("./Medels/AuthenticationModel")
const { authRouter } = require('./Controls/loginstystem')
const {  profileRouter } = require('./Controls/controlsystem')

const { assignmentRouter } = require('./Controls/assignmentControl')
const app=express()


app.use(cors())
app.use(express.json())
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000"
    }
  });

// Set up a WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
//
// |||||||||||||||||||||||||||
app.get("/",async(req,res)=>{
    res.status(200).json({msg:"Welcome To The YakshAcademy Backend"})
})
app.use("/user",authRouter)
app.use("/assignment",auth,assignmentRouter)

app.use("/userdata",auth,profileRouter)
httpServer.listen(8080,async()=>{
   try{

   await connection
    console.log("connected to database ") }catch(err){
        console.log(err)
    }
    console.log("port is running fine at port no.8080")
})

module.exports={httpServer,io}