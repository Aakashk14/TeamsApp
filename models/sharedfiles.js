const mongoose = require('mongoose');

mongoose.set("debug",true)

const file = new mongoose.Schema({
    filename:String,
    date:{type:Date,default:Date.now}
})


const sharedfiles = new mongoose.Schema({
    email:String,
    groupname:String,
    groupfiles:[file]
})

const sharedfile = mongoose.model("files",sharedfiles,"files")



module.exports=sharedfile;

