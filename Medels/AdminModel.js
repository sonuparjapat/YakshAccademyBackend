const mongoose=require("mongoose")

const AdminSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    Id:{type:String,required:true},
    password:{type:String,required:true}
})

const AdminModel=mongoose.model("admindata",AdminSchema)
module.exports={AdminModel}