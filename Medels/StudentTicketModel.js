const mongoose=require("mongoose")

const studentticketSchema=mongoose.Schema({
    username:String,
    useremail:String,
    type:String,
    field:String,
    unqId:String,
    userId:String,
    reply:String,
    studentisRead:Boolean
})

const studentticketModel=mongoose.model("studenttickets",studentticketSchema)
module.exports={studentticketModel}