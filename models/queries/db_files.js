const express = require('express')

const getfiles = require('../sharedfiles');


module.exports= function(myemail,name){

    return new Promise((resolve,reject)=>{
getfiles.find({email:myemail,groupname:name}).then((result)=>{
    resolve(result)
})
    })}