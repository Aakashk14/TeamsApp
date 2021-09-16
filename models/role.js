const mongoose = require('mongoose');

const role = new mongoose.Schema({
    email:String,
    permission:String
})

const Access = mongoose.model("access",role,"access")


module.exports=Access