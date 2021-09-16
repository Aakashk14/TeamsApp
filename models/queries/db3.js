 const express = require('express');

 const groups = require('../groups');

 const online = require('../uniqueness')

 const allusers = require('../relationship')

 const notification = require('../notifications')
 module.exports.channel=function(email,socket){

    return new Promise((resolve,reject)=>{
    groups.aggregate([{ "$unwind": { "path": "$group", "preserveNullAndEmptyArrays": true } },
    { "$unwind": { "path": "$group.members", "preserveNullAndEmptyArrays": true }},
    {"$project":{
           name: "$group.nameofgroup",
           email:"$group.members.memberemail"
        }
    },{$match:{"email":email}},
    {"$project":{
        groupname:"$name"
    }}
    ]).then((result)=>{
        for(let i=0;i<result.length;i++){
            var t = result[i].groupname;
        online.aggregate([{ "$unwind": { "path": "$group", "preserveNullAndEmptyArrays": true }},
        { "$project":{
            group:"$group.groupname",
            identity:"$group.identity"
       
        }},{"$match":{"group":result[i].groupname}},
       ]).then((result,t)=>{
           let tt  = t
           socket.join(result[i].identity,function(){
               

        })
           socket.request.session.save();

           })}
           resolve(1)
        }
           
           )
           
           resolve(1)
        
        })}



module.exports.meeting =function(group,socket,msg){
    return new Promise((resolve,reject)=>{

    online.aggregate([{$match:{"email":socket.request.session.userid}}
,{"$unwind": { "path": "$group", "preserveNullAndEmptyArrays": true } },
{"$project":{
    name:"$group.groupname",
    identity:"$group.identity"
}},{"$match":{
    "name":group
}}
]).then((res)=>{
    resolve(res[0].identity)


})})}

module.exports.authgroup =function(email,group){

    return new Promise((resolve,reject)=>{
     

        groups.aggregate([{ "$unwind": { "path": "$group", "preserveNullAndEmptyArrays": true } },
        { "$unwind": { "path": "$group.members", "preserveNullAndEmptyArrays": true }},
        {"$project":{
               name: "$group.nameofgroup",
               email:"$group.members.memberemail"
            }
        },{$match:{"email":email}},
        {"$project":{
            groupname:"$name"
        }}
        ]).then((result)=>{
            if(result || result.length >0){
            resolve(result)
            }else{
                resolve(0)
            }
    })
})}

module.exports.mygroup=function(mail,grpname){
    return new Promise((resolve,reject)=>{
        groups.find({"email":mail,"group.nameofgroup":grpname}).then((result)=>{
            if(!result || result.length==0){
                resolve(0)
            }else{
                resolve(1)
            }
        })
    })
}

module.exports.adduser = function(myemail,username,useremail){
    return new Promise((resolve,reject)=>{
        allusers.findOneAndUpdate({email:myemail},{'$push':{employees:{name:username,email:useremail}}}).then((result)=>{
            if(result){
                resolve(1)
            }else{
                reject(0)
            }
        })
})}

module.exports.notifications=function(email,text){

    notification.find({email:email}).then((result)=>{

        if(result.length==0){
            let t = new notification({
                email:email,
                noti:{
                    text:text
                }
            })
            t.save()
        }else{
            notification.findOneAndUpdate({email:email},{'$push':{noti:{text:text}}}).exec();
        }
    })
}

