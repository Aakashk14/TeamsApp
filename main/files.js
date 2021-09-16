const express=require('express');

var router = express.Router();
const db3 = require('../models/queries/db3')
const getfiles= require('../models/queries/db_files')
const path = require('path')


const check = function(req,res,next){


    if(!req.session.userid){
        res.render("index.ejs")
    }else{
        next()
    }
}
router.get("/group/:name/files",check,(req,res)=>{


    
    if(req.session.permission=="admin"){
        db3.mygroup(req.session.userid,req.cookies['group']).then(async(result)=>{
            if(result==1){
                await getfiles(req.session.userid,req.cookies['group']).then((result)=>{
                    res.render("files.ejs",{file:result[0],group:req.cookies['group']});
                })}
                else{
                res.end("You r not allowed")
            }

        })
    }else{
        db3.authgroup(req.session.userid,req.cookies['group']).then(async(result)=>{
            if(result && result.length >0){
                await getfiles(req.session.userid,req.session.tempgroup).then((result)=>{
                    res.render("files.ejs",{file:result[0],group:req.cookies['group']});
                })
            }
        })
    }


})


router.get("/group/:name/:filename",check,(req,res)=>{
    // will add the advanced security verification later , a unique hash to each groups 
    
    let t  = req.session.userid.split("@")[0]
    t = "../users/"+t+"/"+req.params.name+"/"+"uploads/"+req.params.filename;

    res.sendFile(path.join(__dirname,t));
    


})

module.exports=router