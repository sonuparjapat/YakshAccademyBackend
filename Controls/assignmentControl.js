const { loginmodel } = require("../Medels/AuthenticationModel")
const { notificationsModel } = require("../Medels/NoificationModel")



const assignmentRouterfunction=(io)=>{
    const express=require("express")
   
    
    const { instructerassignmentModel } = require("../Medels/instructerAssignment")
    const { studentProfileModel } = require("../Medels/studentProfileMoedel")
    const { studentassignemntModel } = require("../Medels/studentassignementMoel")
    const assignmentRouter=express.Router()
assignmentRouter.post("/instructerassignment",async(req,res)=>{
    const newdata={...req.body,status:false}
 try{
const data=new instructerassignmentModel(newdata)
await data.save()
// console.log(data)

const students=await loginmodel.find({type:"student" ,field:req.body.field})
const currentDate = new Date();
const notificationdata=students.map((student)=>{
const notification=new notificationsModel({
    msg:"A new asssignment added by instructer",
    sender:req.body.instructername,
    instructerId:req.body.userId,
    field:req.body.field,
    
    reciever:student._id,
    assignmentname:req.body.name,
    createdAt:currentDate,
    isRead:false,
    instructer:data._id
})
return notification.save()


})
await Promise.all(notificationdata)




io.emit('new-assignment', { assignment: data });
res.status(200).json({msg:"You added a new assignment successfully"})
 }catch(err){
    res.status(400).json({msg:"something going wrong"})
 }


})











assignmentRouter.get("/allinstructerassignment",async(req,res)=>{
const {date,deadline,name,limit,page,order,sort}=req.query
// console.log(req.query)
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

    const maindata=await instructerassignmentModel.find(myquery)
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
    // console.log(id)
    const data=await instructerassignmentModel.findOne({"_id":id})
  
    if(data){
        try{
            // console.log(data)
            res.status(200).json({msg:data})
        }catch(err){
            res.status(400).json({msg:"something went wrong"})
        }
    }else{
        res.status(400).json({msg:"No information available"})
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
// getting notifications ...............................


assignmentRouter.get("/notifications",async(req,res)=>{
    const {userId}=req.body
    const data=await loginmodel.findOne({_id:userId})
    // console.log(data)
    // console.log(userId)
    if(data){

    
    try{
        // const mydata=await notificationsModel.find()
        // console.log(mydata)
        const notificationdata=await notificationsModel.find({reciever:userId,isRead:false,field:data.field}).populate("instructer")
        // console.log(notificationdata)
        res.status(200).json({msg:notificationdata})
    }catch(err){
        res.status(400).json({msg:"something going wrong",err:err.error})
    }}else{
        res.status(400).json({msg:"Not a Registerd user"})
    }
})
// get singlenotidetails
assignmentRouter.get("/notifications/:id",async(req,res)=>{
    const {id}=req.params
try{
const singledata=await notificationsModel.findOne({"_id":id}).populate("instructer")
res.status(200).json({msg:singledata})
}catch(err){
    res.status(400).json({msg:"Something going wrong"})
}

})
// assignmentMark as read
assignmentRouter.patch("/notifications/patch",async(req,res)=>{
    const {userId}=req.body
    const data=await loginmodel.findOne({_id:userId})
    try{
await notificationsModel.updateMany({reciever:userId,isRead:false,field:data.field},{isRead:true})
res.status(200).json({msg:"Marked As Read"})
    }catch(err){
        res.status(400).json({msg:"something going wrong"})
    }
})









assignmentRouter.get("/getassignments",async(req,res)=>{
const {userId}=req.body
const {sort,order,limit,page,date,name,deadline}=req.query
const myquery={}
if(date){
    myquery.date=date
}
if(name){
    myquery.name={ $regex: name, $options: "i" }
}
if(deadline){
    myquery.deadline=deadline
}
// console.log(myquery)
const userprofile=  await studentProfileModel.findOne({"userId":userId})
// console.log(userprofile,"userprofile")
const studentfield=userprofile.field
// console.log(studentfield,"studentfield")
if(studentfield){
    myquery.field=studentfield
}

if(userprofile){
    try{

if(limit&&page){
    const maindata=await instructerassignmentModel.find(myquery)
    const assignmentdata=await instructerassignmentModel.find(myquery).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""}).skip((page-1)*limit).limit(limit)
    res.status(200).json({msg:assignmentdata,totalpages:Math.ceil(maindata.length/limit)}) }
    else{
        const data=await instructerassignmentModel.find(myquery).sort({[sort]:order=="asc"?"1":order=="desc"?"-1":""})
        res.status(200).json({msg:data})}
     


    }catch(err){
        res.status(400).json({"msg":"something going wroing"})
    }
}else{
    res.status(400).json({msg:"Please Create Profile first"})
}


})
assignmentRouter.get("/getassignment/:id",async(req,res)=>{
    const {id}=req.params
    const data=await instructerassignmentModel.findOne({"_id":id})
    if(data){
        try{
            res.status(200).json({msg:data})
        }catch(err){
            res.status(400).json({msg:"something went wrong"})
        }
    }else{
        res.status(400).json({msg:"No information available"})
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
// submittion status is complete or not 

assignmentRouter.get("/submittedassignment/:assignmentId",async(req,res)=>{
  
    const {userId}=req.body
    const {assignmentId} =req.params
    const data=await studentassignemntModel.findOne({assignmentId,userId})
    if(data){
        try{
            res.status(200).json({msg:data.status})
        }catch(err){
            res.status(400).json({msg:"something going wrong"})
        }
    }else{
res.status(200).json({msg:false})
    }
})
// status completion
// fs
assignmentRouter.patch("/statuschange/:id",async(req,res)=>{

    const {id}=req.params
    const {userId}=req.body
    // console.log(id)
    const data=await studentassignemntModel.findOne({"assignmentId":id,userId})
    // console.log(data)
    const {assignmentId}=data
    const instructerassignment=await instructerassignmentModel.findOne({_id:assignmentId})
    const {deadline}=instructerassignment
    // console.log(deadline)
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
                await studentassignemntModel.findOneAndUpdate({assignmentId:id,userId},newdata)


                res.status(200).json({msg:`assignment with  completed on/before time`})
                // console.log('Assignment is not late.');

            } else if (formattedCurrentDate > deadline) {
                // console.log('Assignment is late.');
                // Calculate how many milliseconds the assignment is late
                const timeDifferenceMs = new Date(formattedCurrentDate) - new Date(deadline);
                // Calculate how many days the assignment is late
                const daysLate = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
                const newdata={...req.body,"submissiondate":formattedCurrentDate,"assignmentTime":`submitted  ${daysLate} days late`,status:true}
                await studentassignemntModel.findOneAndUpdate({assignmentId:id,userId},newdata)


                res.status(200).json({msg:`assignment  completed ${daysLate} ${daysLate<10?"day":"days"} late`})
                // console.log(`It is ${daysLate} days late.`);
            } else {
                const newdata={...req.body,"submissiondate":formattedCurrentDate,"assignmentTime":"submitted on time",status:true}
                await studentassignemntModel.findOneAndUpdate({assignmentId:id,userId},newdata)


                res.status(200).json({msg:`assignment completed on time`})
            }


        
        }else{
            res.status(400).json({msg:"You are not authorised to do this task"})
        }
    }catch(err){
        res.status(400).json({msg:"Something going wrong"})
    }
})
return assignmentRouter

}








module.exports={assignmentRouterfunction}