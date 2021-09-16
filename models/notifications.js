const mongoose = require('mongoose');

const noti = new mongoose.Schema({
    text:String,
    Date:{type:Date, default:Date.now}
})

const notification =new mongoose.Schema({
    email:String,
    noti:[noti]
    
})


const notifications = mongoose.model("notifications",notification,"notifications")






module.exports= notifications;