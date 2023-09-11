const express=require("express")
const mongoose=require("mongoose")
const instructerassignmentschema=mongoose.Schema({
    name:String,
    description:String,
    instructername:String,
    deadline:String,
    type:String,
    userId:String,
    link:String,
    date:String,
    status:Boolean

})

const instructerassignmentModel=mongoose.model("instructerassignment",instructerassignmentschema)
module.exports={instructerassignmentModel}