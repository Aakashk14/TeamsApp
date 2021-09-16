const mongoose = require('mongoose');


const discussions = new mongoose.Schema({
    Name:{type:String},
    msg:{type:String},
    image:{type:String}
})


module.exports =mongoose.model("message",discussions,'userDiscussion');


