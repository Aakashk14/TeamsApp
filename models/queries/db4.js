const express= require('express');
const meeting = require('../meeting')
const allusers = require('../relationship')

const logins = require('../login')



module.exports.convo = function(email,groupname){

    return new Promise((resolve,reject)=>{
  meeting.find({email:email,groupname:groupname}).sort({meetingid:-1}).then((result)=>{

      resolve(result)

  })
})}

module.exports.getid=function(email,groupname){
    return new Promise((resolve,reject)=>{
        meeting.find({email:email,groupname:groupname}).sort({meetingid:-1}).then((result)=>{
      
            if(!result || result.length ==0){
                result=1;
            }else{
            result=result[0].meetingid+1;
            }

            resolve(result)
      
        })
      })}

module.exports.getbossemail=function(mail){
    return new Promise((resolve,reject)=>{
        
allusers.find({"employees.email":mail}).exec((err, result)=>{
    if(result.length >0){
    resolve(result[0].email)
    }else{
        resolve(0)
    }
})})}

module.exports.add=function(email,myname,pass,role){
    return new Promise((resolve,reject)=>{
        let t  = new logins({
            Name:myname,
            email:email,
            password:pass,
            role:role
        })
        t.save()
        resolve(1)
        
    })
}