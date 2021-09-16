const express = require('express')

const groups = require('../groups')
const st = require('../active')
const notifications = require('../notifications')
const online = require('../uniqueness')


module.exports.user1 = function(usermail)
{

    return new Promise((resolve,reject)=>{
    groups.aggregate([{ "$unwind": { "path": "$group", "preserveNullAndEmptyArrays": true } },
{ "$unwind": { "path": "$group.members", "preserveNullAndEmptyArrays": true }},
{"$project":{
name: "$group.nameofgroup",
email:"$group.members.memberemail"
}
},{$match:{"email":usermail}},
{"$project":{
groupname:"$name"
}}
]).then((result)=>{
if(!result || result.length ==0){

    resolve(0)
}else{
    resolve(result)
}})})}


// for users notifications - user 2 
module.exports.user2 = function(useremail){
    return new Promise((resolve,reject)=>{

        notifications.find({email:useremail}).sort('-date').then((result)=>{
            if(result.length >0){
            resolve(result[0].noti)
        }else{
            resolve(0)
        }}
        )

    })
}

module.exports.user3= function(email,name){
    return new Promise((resolve,reject)=>{

    online.aggregate([{'$match':{"email":email}},
    {"$unwind": { "path": "$group", "preserveNullAndEmptyArrays": true }},
    {"$match":{"group.groupname":name}},
    {'$project':{
        identity:"$group.identity"
    }}
     ]).then((result,t)=>{
         if(result || result.length >0){
             resolve(result)
         }else{
             resolve(0)
         }
        })})}
        
        
        
module.exports.user4 = function(identity){

return new Promise((resolve,reject)=>{
 st.find({identity:identity}).then((result)=>{
             if(result || result.length >1){
                
                 resolve(result)
             }else{
                 resolve(0)
             }
         })
        })}

 