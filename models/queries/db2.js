const express = require('express')

const online =require('../uniqueness');

module.exports = function(data){
  
    return new Promise((resolve,reject)=>{
    online.find({"group.identity":data}).then((result)=>{
        if(!result || result.length==0){
            resolve(1)
        }else{
            resolve(0)
        }
    })})
}







