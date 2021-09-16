const backend = require('../models/backend') 
const main = require('../app')
const multer = require('multer');
const path = require('path');
const convo = require('../models/meeting')

const rel = require('../models/relationship');
const { getMaxListeners } = require('process');
const fs = require('fs')
const filedb = require('../models/sharedfiles')
const dbbinary = require('../models/queries/dbbinary')


// I havent added group permission check for file uploads [IDOR vuln's there]

const storage= multer.diskStorage(
    {destination:function(req,file,cb){
        if(req.session.permission=="admin"){
            let dr= "users/"+req.session.userid.split("@")[0]+"/"+req.cookies['group']+"/uploads"
            console.log("uploading file to",dr)
    
            if(fs.access(dr,(err)=>{
                if(err) console.log(err)
            }))
            {
            cb(null,dr)
            }else{
                fs.mkdirSync(dr,{recursive:true},function(err){
                    if(err) console.log(err)
                })
                cb(null,dr)
            }


        }else{
       let dr= "users/"+req.session.myboss.split("@")[0]+"/"+req.cookies['group']+"/uploads"
       if(fs.access(dr,(err)=>{
        if(err) console.log(err)
    }))
    {
    cb(null,dr)
    }else{
        fs.mkdirSync(dr,{recursive:true},function(err){
            if(err) console.log(err)
        })
        cb(null,dr)
    }
 
    }},
filename: function(req,file,cb){
    let a = file.originalname.slice(-4);
    let b = file.originalname.split(".");
    cb(null,b[0]+a)}


})





            
const upload=multer({storage:storage});

module.exports=(app)=>{

    app.post("/incoming",upload.single("newfile"),async(req,res,next)=>{
      
     if(!req.file){
         next()
     }else{

        let tmp = req.body.currentpath;
        var fileexist=1;


        if(req.session.permission=="admin"){
            tmpemail= req.session.userid
        }else if(req.session.permission=="user"){
            tmpemail=req.session.myboss;
        }
        filedb.find({email:tmpemail,groupname:req.cookies['group']}).then((result)=>{
            if(result.length >0){
            filedb.findOneAndUpdate({email:tmpemail,groupname:req.cookies['group']},{'$push':{groupfiles:{filename:req.file.filename}}}).then((result)=>{
            })}else{
          let tf = new filedb({
              email:tmpemail,
              groupname:req.cookies['group'],
              groupfiles:{
                  filename:req.file.filename,
              }

          })
          tf.save((err,doc)=>{
              if(err) console.log(err)

          })}})



      
       if(req.body.imp==1){
           console.log("lets see ",req.session)
        
            req.session.index=1;
        let meeting_tmp = req.body.currentpage+"_id";
           console.log()

              dbbinary.convo1(tmpemail,req.body.currentpage,req.session[meeting_tmp],req.session.name,req.session.userid,req.body.mymessage,fileexist,req.file.filename)
            }else if(!req.session.index){
               
                if(req.session.permission=="admin"){
                let meeting_tmp = req.body.currentpage+"_id";
                let t = new convo({
                    email:req.session.userid,
                    groupname:req.body.currentpage,
                    meetingid:req.session[meeting_tmp],
                    chats:{
                        name:req.session.name,
                        from:req.session.userid,
                        msg:req.body.mymessage,
                        file:fileexist,
                        filename:req.file.filename
                    }})
                    t.save((err,data)=>{
                        if(err) console.log(err)
    
                    })

            }else{
                console.log("else",req.session)
                let meeting_tmp = req.body.currentpage + "_id";

                let t = new convo({
                    email:req.session.myboss,
                    groupname:req.body.currentpage,
                    meetingid:req.session[meeting_tmp],
                    chats:{
                        name:req.session.userid,
                        from:req.session.userid,
                        msg:req.body.mymessage,
                        file:fileexist,
                        filename:req.file.filename
                    }
                })
                t.save((err,data)=>{
                    if(err) console.log(err)
                })}
            }}})
        
            

app.post("/incoming",(req,res)=>{
    var fileexist=0;
    let meeting_tmp = req.body.currentpage+"_id";
    if(req.session.permission=="admin"){
        tmpemail= req.session.userid
    }else if(req.session.permission=="user"){
        tmpemail=req.session.myboss;
    }
            if(req.body.imp==1){
                convo.findOneAndUpdate(
                    {email:tmpemail,meetingid:req.session[meeting_tmp]},
                    {"$push":{chats:{name:req.session.name,from:req.session.userid,msg:req.body.mymessage,file:fileexist}}}
               ).exec()
            
        }else if(!req.session.index){

          
           

            if(req.session.permission=="admin"){
                let meeting_tmp = req.body.currentpage + "_id";

            let t = new convo({
                email:req.session.userid,
                groupname:req.body.currentpage,
                meetingid:req.session[meeting_tmp],
                chats:{
                    name:req.session.name,
                    from:req.session.userid,
                    msg:req.body.mymessage,
                    file:fileexist
                }})
                t.save((err,data)=>{
                    if(err) console.log(err)

                })
            }else{
                let meeting_tmp = req.body.currentpage + "_id";

                let t = new convo({
                    email:req.session.myboss,
                    groupname:req.body.currentpage,
                    meeting:req.session[meeting_tmp],
                    chats:{
                        name:req.session.userid,
                        from:req.session.userid,
                        msg:req.body.mymessage,
                        file:fileexist
                    }
                })
                t.save((err,data)=>{
                    if(err) console.log(err)
                })
                
                

            }
        }
    })
}
    
    
    
  

 
   
