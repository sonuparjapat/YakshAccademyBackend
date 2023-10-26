const express=require("express")
const { AdminModel } = require("../Medels/AdminModel")
const bcrypt = require('bcrypt');
const AdminRouter=express.Router()
var jwt = require('jsonwebtoken');
const { loginmodel } = require("../Medels/AuthenticationModel");

AdminRouter.post("/register",async(req,res)=>{
    const {name,Id,email,password}=req.body

    const already=await AdminModel.findOne({email})
    const searchbyid=await AdminModel.findOne({Id})
    if(already){
        res.status(400).json({msg:"This User Is Already Registered"})
    }else if(searchbyid){
        res.status(400).json({msg:"Id is Already Present"})}else{
        try{
            bcrypt.hash(password, 5, async(err, hash)=> {
            if(err){
                res.status(400).json({msg:"Not Able To Register"})
            }else{
                const data=new AdminModel({email,Id,name,password:hash})
                await data.save()
                res.status(200).json({msg:"Registered Successfully",data})
            }
            })
        }catch(err){
            res.status(400).json({msg:"Something going wrong!!"})
        }
    }
})

AdminRouter.post("/user/register",async(req,res)=>{

  
        const {email,password,name,type,field,unqId}=req.body
        const data=await loginmodel.findOne({email})
        const datawithid=await loginmodel.findOne({unqId})
        if(email&&password&&name&&type&&field,unqId){
    
        
        if(data){
            res.status(400).json({msg:"This User is already registered"})
        }else if(datawithid){
            res.status(400).json({msg:"Given Id is Already Present "})}else{
            try{
                bcrypt.hash(password, 5, async(err, hash)=> {
                    if(hash&&!err){
    
                        const data=new loginmodel({email,name,password:hash,type,field,unqId})
                        await data.save()
                        res.status(200).json({msg:"Registered Successfully"})
                    }else{
                        res.status(400).json({msg:err})
                    }
                    // Store hash in your password DB.
                });
            }catch(err){
    res.status(400).json({msg:err})
            }
        }}else{
            res.status(400).json({msg:"Please provide all the required details"})
        }
    
})

AdminRouter.get("/admins",async(req,res)=>{
    const admindata=await AdminModel.find()
   
    try{

res.status(200).json({msg:admindata})
    }catch(err){
        res.status(400).json({msg:"something going wrong"})
    }
})
AdminRouter.get("/students",async(req,res)=>{
const {name,limit,page,order,sort,unqId,field,email}=req.query
console.log("hi")
    const query={}
    if(name){
        query.name={ $regex: name, $options: "i" }
    }
    if(unqId){
        query.unqId={ $regex: unqId, $options: "i" }
    }
    if(field){
        query.field={ $regex: field, $options: "i" }
    }
    if(email){
        query.email={ $regex: email, $options: "i" }
    }

    try{
        const alldata=await loginmodel.find({"type":"student"})
        // console.log(alldata)
        if(limit&&page){
            const studentsdata=await loginmodel.find({"type":"student"}).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""}).skip(
          (page-1)*limit       
            ).limit(limit)
            res.status(200).json({msg:studentsdata,totalpage:Math.ceil(alldata.length/limit)})
        }else{
            const studentsdata=await loginmodel.find({"type":"student"}).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""})
            // console.log(studentsdata)
            res.status(200).json({msg:studentsdata})
        }
       
    }catch(err){
        res.status(400).json({msg:"something going wrong"})
    }
})
AdminRouter.get("/instructers",async(req,res)=>{
    const {name,limit,page,order,sort,unqId,field,email}=req.query

    const query={}
    if(name){
        query.name={ $regex: name, $options: "i" }
    }
    if(unqId){
        query.unqId={ $regex: unqId, $options: "i" }
    }
    if(field){
        query.field={ $regex: field, $options: "i" }
    }
    if(email){
        query.email={ $regex: email, $options: "i" }
    }

    try{
        const alldata=await loginmodel.find({"type":"instructer"})
        if(limit&&page){
            const instdata=await loginmodel.find({"type":"instructer"}).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""}).skip(
          (page-1)*limit       
            ).limit(limit)
            res.status(200).json({msg:instdata,totalpage:Math.ceil(alldata.length/limit)})
        }else{
            const instdata=await loginmodel.find({"type":"instructer"}).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""})
            res.status(400).json({msg:instdata})
        }
    }catch(err){
        res.status(400).json({msg:'something going wrong'})
    }
})
AdminRouter.delete("/removeadmin/:id",async(req,res)=>{
    const {id}=req.params
try{
    await AdminModel.findOneAndDelete({"_id":id})
    res.status(200).json({msg:"Admin Removed Successfully"})
}catch(err){
    res.status(400).json({msg:"Something going wrong"})
}
})
module.exports={AdminRouter}