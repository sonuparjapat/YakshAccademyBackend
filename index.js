const express=require('express')
const cors=require("cors")
const {auth}=require("./Middleware/auth")
const {connection}=require("./Medels/AuthenticationModel")
const { authRouter } = require('./Controls/loginstystem')
const {  profileRouter } = require('./Controls/controlsystem')

const { assignmentRouter } = require('./Controls/assignmentControl')
const app=express()
app.use(cors())
app.use(express.json())
// ||||||||||||||||||||||||||||||||||||||||||||||
app.use("/user",authRouter)
app.use("/assignment",auth,assignmentRouter)

app.use("/userdata",auth,profileRouter)
app.listen(8080,async()=>{
   try{

   await connection
    console.log("connected to database ") }catch(err){
        console.log(err)
    }
    console.log("port is running fine at port no.8080")
})
