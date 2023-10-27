const express=require('express')
const { studentticketModel } = require('../Medels/StudentTicketModel')

const ticketRouterfunction=(io)=>{

const ticketrouter=express.Router()
ticketrouter.post("/studentcreate",async(req,res)=>{
    try{
const data=new studentticketModel({...req.body,reply:""})
await data.save()
io.emit("studentticket",{data})
res.status(200).json({"msg":"Thanks for asking your doubt"})
    }catch(err){
        res.status(400).json({msg:"Not able to raise ticket"})
    }
})

ticketrouter.get('/studenttickets',async(req,res)=>{
    try{
const data=await studentticketModel.find({userId:req.body.userId})
res.status(200).json({msg:data})
    }catch(err){
        res.status(400).json({msg:"something going wrong"})
    }
})
return ticketrouter
}

module.exports={ticketRouterfunction}