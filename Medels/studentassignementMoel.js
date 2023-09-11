const mongoose=require("mongoose")

const studentassignmentschema=mongoose.Schema({
    link:String,
    status:Boolean,
    name:String,
    instId:String,
    assignmentId:String,
    submissiondate:String,
    type:String,
    assignmentTime:String,
    userId:String,
    instructername:String
})

const studentassignemntModel=mongoose.model("studentassignmentsubmission",studentassignmentschema)
module.exports={studentassignemntModel}