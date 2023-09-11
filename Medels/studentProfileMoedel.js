const mongoose=require("mongoose")
const studentprofileschema={
    studentId:{type:String,required:true},
    name:{type:String,required:true},
    gender:{type:String,required:true},
    major:{type:String,required:true},
    email:{type:String,required:true},
    mob:{type:String,required:true},
    dob:{type:String,required:true},
    date:String,
    userId:{type:String,required:true}

}
const studentProfileModel=mongoose.model("studentprofile",studentprofileschema)
module.exports={studentProfileModel}