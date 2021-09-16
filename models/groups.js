const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const members = mongoose.Schema({
    memberemail:String
})
const group = mongoose.Schema({
    nameofgroup:String,
    members:[members]
})
const Managegroups = mongoose.Schema({
    email:String,
    group:[group]
})


const groups = mongoose.model("groups",Managegroups,"groups")
groups.aggregate([{"$match":{"email":"twitter@gmail.com"}},{ "$unwind": { "path": "$group", "preserveNullAndEmptyArrays": true } },
{"$project":{
    groupname:"$group.nameofgroup",
}},{"$match":{
    groupname:"ss"
}}
]).then((result)=>{
    console.log("here",result)

})
module.exports=groups


