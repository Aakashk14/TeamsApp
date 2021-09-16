const express = require('express')
const groups = require('../groups');
const auth = require('../login')


module.exports.grps= function(email){
return new Promise((resolve,reject)=>{
    groups.find(({
        email:email

    }
    )).then((result)=>{
        if(!result || result.length==0){
            resolve(0)
        }else if(result.length >0)
        resolve(1)
    })

})}

module.exports.logins = function(email,pass){
    return new Promise((resolve,reject)=>{
auth.find({
    email:email,
    password:pass
}).then((result)=>{
    if(result && result.length >0){
    resolve(result)
    }else{
        resolve(0)
    }
})

    })}

    module.exports.emailchk = function(email){
        return new Promise((resolve,reject)=>{
            auth.find({
                email:email,
            }).then((result)=>{
                if(result && result.length >0){
                resolve(1)
                }else{
                    resolve(0)
                }
            })
            
                })}
            
