const mongoose = require('mongoose');


const active = new mongoose.Schema({
    identity:String,
    status:Boolean,
    first:Boolean,
    meetingid:Number
})


const status = mongoose.model("status",active,"status")


module.exports=status