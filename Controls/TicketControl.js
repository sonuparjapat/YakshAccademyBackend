const express=require('express')
const { studentticketModel } = require('../Medels/StudentTicketModel')
const { loginmodel } = require('../Medels/AuthenticationModel')

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



// instructerside

ticketrouter.get("/fieldtickets",async(req,res)=>{
const userId=req.body
const instructerdata=await loginmodel.findOne({userId})

try{
const data=await studentticketModel.find({field:instructerdata.field})
res.status(200).json({msg:data})
}catch(err){
    res.status(400).json({msg:"something going wrong"})
}
})

ticketrouter.patch("/reply/:id",async(req,res)=>{
    const userId=req.body
    const {id}=req.params
    const ticket=await studentticketModel.findOne({_id:id})
    if(ticket){
await studentticketModel.findOneAndUpdate({_id:id},req.body)
res.status(200).json({msg:"You Replied Successfully"})
io.emit("replied",{data:"Your Instructer Replied on ticket"})
    }else{
        res.status(400).json({msg:"No ticket found"})
    }
})
ticketrouter.patch("/isRead/:id",async(req,res)=>{
    const {id}=req.params
    const {userId}=req.body
    const data=await studentticketModel.findOne({_id:id})
    try{
if(data.userId==userId){
await studentticketModel.findOneAndUpdate({_id:id},req.body)
}else{
    res.status(400).json({msg:"You are not authorised to do this task"})
}
    }catch(err){
        res.status(400).json({msg:"something going wrong"})
    }
})
return ticketrouter
}


module.exports={ticketRouterfunction}