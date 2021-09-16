const express= require('express');
const login = require('./models/login')

async function checkemail(user){

    login.find({email:user}).then((result)=>{
        if(!result){
        return 1;
    }else{
        return 0
    }
})
}


module.exports=function(app){
    app.get("/signup",(req,res)=>{

        if(req.body.permission=="admin"){
        checkemail(req.body.email).then((result)=>{
            if(result){

        let tm = new login({
            Name:req.body.name,
            email:req.body.email,
            password:req.body.password

        })
        tm.save((err,doc)=>{
            if(err) console.log(err)
        })
        
        res.render("index.html",{created:1})
        }



})}})}