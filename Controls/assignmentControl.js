const express=require("express")
const ObjectId = require('mongodb').ObjectId;
const { instructerassignmentModel } = require("../Medels/instructerAssignment")
const { studentProfileModel } = require("../Medels/studentProfileMoedel")
const { studentassignemntModel } = require("../Medels/studentassignementMoel")
const assignmentRouter=express.Router()

assignmentRouter.post("/instructerassignment",async(req,res)=>{
    const newdata={...req.body,status:false}
 try{
const data=new instructerassignmentModel(newdata)
await data.save()
res.status(200).json({msg:"You added a new assignment successfully"})
 }catch(err){
    res.status(400).json({msg:"something going wrong"})
 }


})
assignmentRouter.get("/allinstructerassignment",async(req,res)=>{
const {date,deadline,name,limit,page,order,sort}=req.query
const {userId}=req.body
const myquery={}
if(date){
    myquery.date=date
}
if(deadline){
    myquery.deadline=deadline
}
if(name){
    myquery.name={ $regex: name, $options: "i" }
}
if(userId){
    myquery.userId=userId
}


try{
    if(page&&limit){

    const maindata=instructerassignmentModel.find(myquery)
const data=await instructerassignmentModel.find(myquery).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""}).skip((page-1)*limit).limit(limit)
res.status(200).json({msg:data,totalpages:Math.ceil(maindata.length/limit)}) }else{
    const data=await instructerassignmentModel.find(myquery).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""})
    res.status(200).json({msg:data})
}
}


catch(err){
    res.status(400).json({msg:"something going wrong"})
}
})
assignmentRouter.get("/getinstructerassignment/:id",async(req,res)=>{
    const {id}=req.params
    const data=await instructerassignmentModel.findOne({"_id":id})
    if(data){

    }else{
        res.status(400).json({msg:"No information available"})
    }
    try{
        res.status(200).json({msg:data})
    }catch(err){
        res.status(400).json({msg:"something went wrong"})
    }
})

assignmentRouter.delete("/deleteassignment/:id",async(req,res)=>{
const {id}=req.params
const data=await instructerassignmentModel.findOne({_id:id})
try{
    if(req.body.userId!==data.userId){
        res.status(400).json({msg:"You are not authorised to do this task"})
    }else{
        await instructerassignmentModel.findOneAndDelete({_id:id})
    res.status(200).json({msg:`task deleted with id:${id} successfully`})
    }
}catch(err){
    res.status(400).json({msg:"something going wrong"})
}
})

assignmentRouter.patch("/patchassignment/:id",async(req,res)=>{
    const {id}=req.params
    const data=await instructerassignmentModel.findOne({_id:id})
    try{
        if(req.body.userId!==data.userId){
            res.status(400).json({msg:"You are not authorised to do this task"})
        }else{
            await instructerassignmentModel.findOneAndUpdate({_id:id},req.body)
        res.status(200).json({msg:`task updated with id:${id} successfully`})
        }
    }catch(err){
        res.status(400).json({msg:"something going wrong"})
    }
    })
    // checking assignment submission of students by instructer
    assignmentRouter.get("/assignments/:studentId",async(req,res)=>{
        const {studentId}=req.params
        const {userId}=req.body
        const completedassignmentdata=await studentassignemntModel.find({"userId":studentId,status:true})
        const notcompletedassignmentdata=await instructerassignmentModel.find({ "userId":userId})
//      
        const completedAssignmentIds = completedassignmentdata.map(item => item.assignmentId);

        const filteredNotCompletedAssignmentData = notcompletedassignmentdata.filter(item => {
            return !completedAssignmentIds.some(id => id === item._id.toString());
          });








    try{
        res.status(200).json({msg:"yourdata",completedassignmentdata,filteredNotCompletedAssignmentData})
    }catch(err){
        res.status(400).json({msg:"something going wrong"})
    }
       
    })



// studentsidemanagement************************************************************************************************

assignmentRouter.get("/getassignments",async(req,res)=>{
const {userId}=req.body
const {sort,order,limit,page,date,name}=req.query
const myquery={}
if(date){
    myquery.date=date
}
if(name){
    myquery.name={ $regex: name, $options: "i" }
}
const userprofile=  studentProfileModel.findOne({"userId":userId})
const studentfield=userprofile.major
if(studentfield){
    myquery.type=studentfield
}
if(userprofile){
    try{

if(limit&&page){
    const maindata=await instructerassignmentModel.find(myquery)
    const assignmentdata=await instructerassignmentModel.find(myquery).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""}).skip((page-1)*limit).limit(limit)
    res.status(200).json({msg:assignmentdata,totalpages:Math.ceil(maindata.length/limit)}) }else{
        const data=await instructerassignmentModel.find(myquery).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""})
        res.status(200).json({msg:data})}
     


    }catch(err){
        res.status(400).json({"msg":"something going wroing"})
    }
}


})
assignmentRouter.get("/getassignment/:id",async(req,res)=>{
    const {id}=req.params
    const data=await instructerassignmentModel.findOne({"_id":id})
    if(data){

    }else{
        res.status(400).json({msg:"No information available"})
    }
    try{
        res.status(200).json({msg:data})
    }catch(err){
        res.status(400).json({msg:"something went wrong"})
    }
})

assignmentRouter.post("/submitassignment",async(req,res)=>{
    // we have to provide assignmenId,link,instructerId

    const newdata={...req.body,status:false,submissiondate:"",assignmentTime:""}
    const {assignmentId}=req.body
    await studentassignemntModel.findOneAndDelete({"assignmentId":assignmentId})


    
    








    try{
        const data=new studentassignemntModel(newdata)
        await data.save()
        res.status(200).json({msg:"Assignment submitted successfully"})
    }catch(err){
        res.status(400).json({msg:"something going wrong"})
    }
})

// status completion
assignmentRouter.patch("/statuschange/:id",async(req,res)=>{

    const {id}=req.params
    const data=await studentassignemntModel.findOne({"_id":id})
    const {assignmentId}=data
    const instructerassignment=await instructerassignmentModel.findOne({_id:assignmentId})
    const {deadline}=instructerassignment
// Get the current date in "yyyy-mm-dd" format
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const formattedCurrentDate = `${year}-${month}-${day}`;

// Specify the submission date to compare (in "yyyy-mm-dd" format)


// Compare the dates


// console.log(formattedDate);
    try{

        if(req.body.userId==data.userId){
            if (formattedCurrentDate < deadline) {
                const newdata={...req.body,"submissiondate":formattedCurrentDate,"assignmentTime":"submitted on/before deadline",status:true}
                await studentassignemntModel.findOneAndUpdate({_id:id},newdata)


                res.status(200).json({msg:`assignment with id:${id} completed on/before time`})
                // console.log('Assignment is not late.');

            } else if (formattedCurrentDate > deadline) {
                // console.log('Assignment is late.');
                // Calculate how many milliseconds the assignment is late
                const timeDifferenceMs = new Date(formattedCurrentDate) - new Date(deadline);
                // Calculate how many days the assignment is late
                const daysLate = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
                const newdata={...req.body,"submissiondate":formattedCurrentDate,"assignmentTime":`submitted  ${daysLate} days late`,status:true}
                await studentassignemntModel.findOneAndUpdate({_id:id},newdata)


                res.status(200).json({msg:`assignment  completed ${daysLate} days late`})
                // console.log(`It is ${daysLate} days late.`);
            } else {
                const newdata={...req.body,"submissiondate":formattedCurrentDate,"assignmentTime":"submitted on time",status:true}
                await studentassignemntModel.findOneAndUpdate({_id:id},newdata)


                res.status(200).json({msg:`assignment with id:${id} completed on time`})
            }


        
        }else{
            res.status(400).json({msg:"You are not authorised to do this task"})
        }
    }catch(err){
        res.status(400).json({msg:"Something going wrong"})
    }
})











module.exports={assignmentRouter}