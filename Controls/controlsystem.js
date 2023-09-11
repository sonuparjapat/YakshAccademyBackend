const express=require('express')
const {  instructerProfileModel } = require('../Medels/instructerProfileModel')
const { studentProfileModel } = require('../Medels/studentProfileMoedel')

const profileRouter=express.Router()


// instructer

profileRouter.get("/instructerprofile",async(req,res)=>{
    const {userId}=req.body
 
    const data=await instructerProfileModel.findOne({"userId":userId })
    // console.log(data)
  res.status(200).json({msg:data
})


})
profileRouter.get("/instructers",async(req,res)=>{
    const {name,department,mob,gender,email,sort,order,limit,page}=req.query
//    console.log(req.query)
    const querydata={}
    if(name){
        querydata.name={ $regex: name, $options: "i" }
    }
    if(department){
        querydata.department=department
    }
    if(mob){ 
        querydata.mob={ $regex:mob, $options: "i" }
    }
    if(gender){
        querydata.gender=gender
    }
    if(email){
        querydata.email={ $regex: email, $options: "i" }
    }
  
    try{
       const maindata=await instructerProfileModel.find(querydata)
    if(limit&&page){
        const data=await instructerProfileModel.find(querydata).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""}).skip((page-1)*limit).limit(limit)
        res.status(200).json({msg:data,totalpages:Math.ceil(maindata.length/limit)}) 
    }
      else{
        const data=await instructerProfileModel.find(querydata).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""})
        res.status(200).json({msg:data}) 
      }
     
            

       
        }catch(err){
            res.status(400).json({msg:err})
        }
    
})
// getting student which are enrolled in related field
profileRouter.get("/fieldstudents",async(req,res)=>{
    const {userId}=req.body
    const data=await instructerProfileModel.findOne({"userId":userId})
    const {department}=data
    try{
        const studentsdata=await studentProfileModel.find({"major":department})
        res.status(200).json({msg:studentsdata})
    }catch(err){
        res.status(400).json({msg:"something going wrong"})
    }
})
profileRouter.post("/instructerprofile",async(req,res)=>{
    const {email}=req.body
    const data=await instructerProfileModel.findOne({email})
    if(!data){
        try{
            const specificDate = new Date(2023, 7, 29, 12, 0, 0);
            const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const formattedDate = specificDate.toLocaleString('en-IN', options);
    const newdata={...req.body,date:formattedDate}
    
            const data=new instructerProfileModel(newdata)
            await data.save()
            res.status(200).json({msg:"Profile Created Successfully"})
        }catch(err){
            res.status(400).json({msg:err})
        }
    }else{
        res.status(400).json({msg:"profile Already created you can edit it"})
    }
    
})
profileRouter.patch("/instructerprofile/edit/:id",async(req,res)=>{
    const {id}=req.params
    const {userId}=req.body
    const data=await instructerProfileModel.findOne({_id:id})
    // console.log(instId,data)
    try{
if(req.body.userId==data.userId){
    await instructerProfileModel.findOneAndUpdate({_id:id},req.body)
    res.status(200).json({msg:`Instructer with ${id} updated successfully`})
}else{
    res.status(400).json({msg:"You are not authorised to do this"})
}
    }catch(err){
        res.status(400).json({"msg":err})
    }
})

profileRouter.delete("/instructerprofile/delete/:id",async(req,res)=>{
    const {id}=req.params

    const data=await instructerProfileModel.findOne({_id:id})
    // console.log(instId,data)
    try{
if(req.body.userId==data.userId){
    await instructerProfileModel.findOneAndDelete({_id:id})
    res.status(200).json({msg:`Instructer with ${id} deleted successfully`})
}else{
    res.status(400).json({msg:"You are not authorised to do this"})
}
    }catch(err){
        res.status(400).json({"msg":err})
    }
})


// student**************************************************************student router**************************

profileRouter.get("/studentprofile",async(req,res)=>{
    const {userId}=req.body
    // console.log(instId)
    const data=await studentProfileModel.findOne({"userId":userId })
    // console.log(data)
  res.status(200).json({msg:data
})


})

profileRouter.get("/students",async(req,res)=>{
    const {name,major,mob,gender,email,sort,order,limit,page}=req.query
//    console.log(req.query)
    const querydata={}
    if(name){
        querydata.name={ $regex: name, $options: "i" }
    }
    if(major){
        querydata.major=major
    }
    if(mob){ 
        querydata.mob={ $regex:mob, $options: "i" }
    }
    if(gender){
        querydata.gender=gender
    }
    if(email){
        querydata.email={ $regex: email, $options: "i" }
    }
  
    try{
       const maindata=await studentProfileModel.find(querydata)
    if(limit&&page){
        const data=await studentProfileModel.find(querydata).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""}).skip((page-1)*limit).limit(limit)
        res.status(200).json({msg:data,totalpages:Math.ceil(maindata.length/limit)}) 
    }
      else{
        const data=await studentProfileModel.find(querydata).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""})
        res.status(200).json({msg:data}) 
      }
     
            

       
        }catch(err){
            res.status(400).json({msg:err})
        }
    
})
profileRouter.post("/studentprofile",async(req,res)=>{
    const {email}=req.body
    const data=await studentProfileModel.findOne({email})
    if(!data){
        try{
            const specificDate = new Date(2023, 7, 29, 12, 0, 0);
            const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const formattedDate = specificDate.toLocaleString('en-IN', options);
    const newdata={...req.body,date:formattedDate}
    
            const data=new studentProfileModel(newdata)
            await data.save()
            res.status(200).json({msg:"Profile Created Successfully"})
        }catch(err){
            res.status(400).json({msg:err})
        }
    }else{
        res.status(400).json({msg:"profile Already created you can edit it"})
    }
    
})
profileRouter.patch("/studentprofile/edit/:id",async(req,res)=>{
    const {id}=req.params
    
    const data=await studentProfileModel.findOne({_id:id})
    // console.log(instId,data)
    try{
if(req.body.userId==data.userId){
    await studentProfileModel.findOneAndUpdate({_id:id},req.body)
    res.status(200).json({msg:`student with ${id} updated successfully`})
}else{
    res.status(400).json({msg:"You are not authorised to do this"})
}
    }catch(err){
        res.status(400).json({"msg":err})
    }
})

profileRouter.delete("/studentprofile/delete/:id",async(req,res)=>{
    const {id}=req.params

    const data=await studentProfileModel.findOne({_id:id})
    // console.log(instId,data)
    try{
if(req.body.userId==data.userId){
    await studentProfileModel.findOneAndDelete({_id:id})
    res.status(200).json({msg:`stuedent with ${id} deleted successfully`})
}else{
    res.status(400).json({msg:"You are not authorised to do this"})
}
    }catch(err){
        res.status(400).json({"msg":err})
    }
})


module.exports={profileRouter}