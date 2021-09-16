const mongoose = require('mongoose');


const employees  = new mongoose.Schema({
    name:String,
    email:String
},{_id: false})
const users = new mongoose.Schema({
    email:String,
    employees:[employees]

})
const allusers = mongoose.model("allusers",users,"allusers")


module.exports=allusers
