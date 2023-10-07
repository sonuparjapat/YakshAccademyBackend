const express=require("express")
const { AdminModel } = require("../Medels/AdminModel")
const bcrypt = require('bcrypt');
const AdminRouter=express.Router()
var jwt = require('jsonwebtoken');

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
module.exports={AdminRouter}