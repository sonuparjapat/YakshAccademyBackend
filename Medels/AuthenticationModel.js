const mongoose=require("mongoose")
require("dotenv").config()
const connection=mongoose.connect(process.env.MongoUrl)
const loginSchema=mongoose.Schema({
email:{type:String,required:true},
password:{type:String,required:true},
name:{type:String,required:true},
type:{type:String,required:true},
field:{type:String,required:true},
unqId:{type:String,required:true},

})

const loginmodel=mongoose.model("Authenticationdata",loginSchema)
module.exports={connection,loginmodel}