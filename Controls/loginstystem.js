const exp = require("constants")
const express=require("express")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")

const {  loginmodel } = require("../Medels/AuthenticationModel")
const authRouter=express.Router()
// starting
// authrouter


authRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const data=await loginmodel.findOne({email})
    if(email&&password){

    
    if(data){
        try{
            bcrypt.compare(password,data.password, function(err, result) {
               if(result){
                var token = jwt.sign({ userId:data._id }, 'masai');
                
                res.status(200).json({msg:"Login Successfully",useremail:data.email,"token":token,username:data.name,type:data.type,field:data.field,unqId:data.unqId})
               }else{
                res.status(400).json({msg:"Wrong Password"})
               }
            });
        }catch(err){
res.status(400).json({msg:err})
        }
    }else{
        res.status(400).json({msg:"Not a Registered User"})
    }}else{
        res.status(400).json({msg:"Please provide all the required details"})
    }
})
module.exports={authRouter}