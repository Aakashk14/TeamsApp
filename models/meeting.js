const mongoose = require('mongoose');
const { discriminator } = require('./groups');



const groupdata = new mongoose.Schema({
    name:String,
    from:String,
    msg:String,
    file:Boolean,
    filename:String  
})
const chats = new mongoose.Schema({
    email:String,
    groupname:String,
    meetingid:Number,
    chats:[groupdata]

})
   


const discussion = mongoose.model("discussion",chats,"discussion");








     module.exports=discussion;