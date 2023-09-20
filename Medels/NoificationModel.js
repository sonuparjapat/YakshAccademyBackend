const mongoose=require("mongoose")
const { instructerassignmentModel } = require("./instructerAssignment")
const notificationSchema=mongoose.Schema({
    msg:String,
    sender:String,
    reciever:String,
    createdAt:String,
    isRead:Boolean,
    field:String,
    instructerId:String,
    title:String,
    assignmentname:String,
    instructer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"instructerassignment"
    }
})
const notificationsModel=mongoose.model("notifications",notificationSchema)
module.exports={notificationsModel}

