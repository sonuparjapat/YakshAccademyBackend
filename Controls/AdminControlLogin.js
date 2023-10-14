
const express=require("express")
const { AdminModel } = require("../Medels/AdminModel")
const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');
const { loginmodel } = require("../Medels/AuthenticationModel");
const AdminLoginRouter=express.Router()
AdminLoginRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const admindata=await AdminModel.findOne({email})
    const alldata=await loginmodel.find()
const students=await loginmodel.find({"type":"student"})
const instructer=await loginmodel.find({"type":"instructer"})
const frontendstudents=await loginmodel.find({"field":"frontend"})
const backendstudents=await loginmodel.find({"field":"backend"})
const fullstackstudents=await loginmodel.find({"field":"fullstack"})
const frontendinstructers=await loginmodel.find({"type":"instructer","field":"frontend"})
const backendinstructers=await loginmodel.find({"type":"instructer","field":"backend"})
const fullstackinstructers=await loginmodel.find({"type":"instructer","field":"fullstack"})
const admins=await AdminModel.find()

    // console.log(email)
    // console.log(admindata)
    if(admindata){
        try{
            bcrypt.compare(password, admindata.password, function(err, result) {
              if(result){
                var token = jwt.sign({ adminId:admindata._id }, 'masai',{ expiresIn: '1h' });
                res.status(200).json({msg:"Login Successfully",adminname:admindata.name,adminemail:admindata.email,admintoken:token,adminId:admindata.Id,
                alldata:alldata.length,"studentscount":students.length,instructerscount:instructer.length,"frontendstudentscount":frontendstudents.length,backendstudentscount:backendstudents.length,fullstackstudentscount:fullstackstudents.length,
            frontendinstructerscount:frontendinstructers.length,backendinstructerscount:backendinstructers.length,fullstackinstructerscount:fullstackinstructers.length,
      students,instructer,frontendinstructers,backendinstructers,fullstackinstructers,frontendstudents,backendstudents,fullstackstudents,adminscount:admins.length,admins})
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
module.exports={AdminLoginRouter}
