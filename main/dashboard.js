const express=require('express');

 var router = express.Router();
 const userdb= require('../models/queries/user')
 const groups=  require('../models/groups')
 const db3 = require('../models/queries/db3')
 const db4 = require('../models/queries/db4')
const admin = require('../models/queries/admin')

const check = function(req,res,next){

    
    if(!req.session.userid){


        res.render("index.ejs")
    }else{
        next();
    }
}
router.get("/group/:name",check,async(req,res,next)=>{
    let data = req.params.name;
    if(req.session.permission=="user"){
    await db3.authgroup(req.session.userid,data).then((result)=>{
        if(result[0].groupname==req.params.name){
            next()
    }else{


        res.send(" You'r not Auth to this group")

    }
})}else if (req.session.permission=="admin"){
        await db3.mygroup(req.session.userid,req.params.name).then((result)=>{
            if(result==1){
                next()
            }else{
                res.send(" You'r not Auth to this group")
            }
        })
        

    }})

    
router.get("/group/:name",async(req,res)=>{

    let data = req.params.name;
    let data_firstmsg=data+"_firstmsg"
    var tosend={};
    tosend.role=req.session.permission
    tosend.name=req.session.name;
    tosend.notification=""
    tosend.groupname=data;
    tosend.email=req.session.userid

    if(req.session.permission=="admin"){
        await admin.getgroupmembers(req.session.userid,req.params.name).then((result)=>{
            if(result!=0){
                tosend.users=result;
            }
        })

    }
    await userdb.user2(req.session.userid).then((result)=>{
        if(result!=0){
            tosend.notification=result[0]
        }

    })
    if(req.session.permission=="user"){
        tempemail=req.session.myboss
    }else{
        tempemail=req.session.userid
    }
    await userdb.user3(tempemail,req.params.name).then(async(result)=>{
        if(result!=0){
            tosend.temp = result
            await userdb.user4(result[0].identity).then((result)=>{
                if(result!=0){
                    if(result[0].status){
                    req.session[req.params.name]=tosend.temp[0].identity;
                    let t = req.params.name+"_id"
                    req.session[t]=result[0].meetingid
                
                    } if(result[0].first){
                    let t = req.params.name;
                    t= t+"_firstmsg";
                    req.session[t]=1
                }
            }
        })
    }})
       
    res.cookie('group',data)
    if(req.session.permission=="admin" && !req.session[data]){
      
        res.render("group.ejs",{meeting:2,email:req.session.userid,name:req.session.name,notifications:tosend})
     } else if(req.session.permission=="admin" && !req.session[data_firstmsg] && req.session[data]){
       
         res.render("group.ejs",{meeting:5,email:req.session.userid,name:req.session.name,notifications:tosend})
     }else if(req.session.permission=="admin" &&  req.session[data_firstmsg]==1){
        

          await db4.convo(req.session.userid,data).then((result)=>{
           

            res.render("group.ejs",{meeting:1,data:result[0],email:req.session.userid,notifications:tosend})
            if(req.session.permission=="user"){
            }}
          )
    }else if(req.session.permission=="user" && !req.session[data_firstmsg] && req.session[data]){
      
            res.render("meeting.ejs",{meeting:5,email:req.session.userid,name:req.session.name,notifications:tosend})

          }else if (req.session.permission=="user" &&  req.session[data_firstmsg]==1){
            await db4.convo(req.session.myboss,data).then((result)=>{
            

                res.render("meeting.ejs",{meeting:1,data:result[0],name:req.session.name,email:req.session.userid,notifications:tosend})
          })}
         else if(req.session.permission=="user"){
          
             res.render("meeting.ejs",{meeting:0,notifications:tosend})
         }
        })


router.get("/homepage",check,async(req,res)=>{
            var tosend={};
            tosend.name=req.session.name;
            tosend.role=req.session.permission
            tosend.email=req.session.userid
          
            if(req.session.permission=="user"){
                res.end("You'r not an admin")
            }else{

                res.cookie('boss',req.session.userid)
                await userdb.user2(req.session.userid).then((result)=>{
                    if(result!=0){
                        
                    tosend.notifications=result
                    }})
            await  groups.find({email:req.session.userid}).then((result)=>{
                   if(!result || result.length==0){
                        res.render("homepage.ejs",{group:tosend})
        
                    }else if(result.length >0){
                        tosend.group=result[0].group
                        
                        res.render("homepage.ejs",{group:tosend});
        
                    }
                 }
                 )
                }
                })
        
        
        module.exports = router;