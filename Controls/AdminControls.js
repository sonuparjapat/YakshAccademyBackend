const express=require("express")
const { AdminModel } = require("../Medels/AdminModel")
const bcrypt = require('bcrypt');
const AdminRouter=express.Router()
var jwt = require('jsonwebtoken');
const { loginmodel } = require("../Medels/AuthenticationModel");

AdminRouter.post("/register",async(req,res)=>{
    const {name,Id,email,password}=req.body

    const already=await AdminModel.findOne({email})
    if(already){
        res.status(400).json({msg:"This User Is Already Registered"})
    }else{
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
AdminRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const admindata=await AdminModel.findOne({email})
    if(admindata){
        try{
            bcrypt.compare(password, admindata.password, function(err, result) {
              if(result){
                var token = jwt.sign({ adminId:admindata._id }, 'masai',{ expiresIn: '1h' });
                res.status(200).json({msg:"Login Successfully",adminname:admindata.name,adminemail:admindata.email,admintoken:token})
              }else{
                res.status(400).json({msg:"Password Mismatch!!"})
              }
            });
        }catch(err){
            res.status(400).json({msg:"Something going wrong!!"})
        }
    }else{
        res.status(400).json({msg:"No Data Found!!"})
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
module.exports={AdminRouter}