const mongoose=require('mongoose');



const identity =new mongoose.Schema({
    email:String,
    group:[{
        groupname:String,
        identity:String
    }]
})


const online = mongoose.model("online",identity,"online");


module.exports=online;