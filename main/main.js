const express=require('express');
const db1 = require('../models/queries/db1')
const group = require('../models/groups')
const db4 = require('../models/queries/db4')
const userdb = require('../models/queries/user')


var router = express.Router();
router.post("/login",async(req,res,next)=>{

    await db1.logins(req.body.email,req.body.password).then((result)=>{
        if(result.length >0 && result!=0){
            req.session.name=result[0].Name;
            req.session.permission=result[0].role;
            next();
        }else{
            db1.emailchk(req.body.email).then((result)=>{
                if(result==1){
                    res.end("wrong password")
                }else{
                    res.end("No Account Found , If your admin invited you then create account with user role.")
                }
            })
        }
    })
  
         
               
     
         
      },async function(req,res){
         req.session.userid=req.body.email
         if(req.session.permission=="admin"){
             req.session.meetingid=0;
     
             res.redirect("/homepage")
     
          }else{
              res.redirect("/userpage")
             
          }})
 

const chk = function(req,res,next){
    if(!req.session.userid){
        res.render("index.ejs")
    }else{
        next()
    }
}
router.get("/userpage",chk,async(req,res)=>{
 var tosend={};
 tosend.notifications={};
 tosend.group={};
 tosend.name=req.session.name;
 tosend.role=req.session.permission
 tosend.email=req.session.userid
    await db4.getbossemail(req.session.userid).then((result)=>{
        req.session.myboss=result
        res.cookie('boss',result)
      })
    await userdb.user2(req.session.userid).then((result)=>{
        if(result!=0){
    tosend.notifications=result
      }  })


  await userdb.user1(req.session.userid).then((result)=>{
if( result ==0){
res.render("userpage.ejs")

}else{
    tosend.group=result;
res.render("userpage.ejs",{group:tosend})
}})})

 module.exports=router