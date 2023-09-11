
const mongoose=require("mongoose")
const courseSchema=mongoose.Schema({
coursecode:String,
coursename:String,
department:String,
description:String
})


const courseModel=mongoose.model("coursedata",courseSchema)
moduule.exports={courseModel}