const express = require('express')
const router = express.Router();
const grp = require('../models/groups')
const db2 = require('../models/queries/db2')
const allusers = require('../models/relationship')
const admin = require('../models/queries/admin')
const db3 = require('../models/queries/db3')
const online = require('../models/uniqueness')
const generaterand = async()=>{
        var string = "abcdefghijklmnopqrstuvwxyz1234567890"
        var str="";
                      
              for(let i=0;i<10;i++){
                 var rand = (Math.random()*36).toString().split(".");
                 str = str + string[rand[0]];
        }
        let value
       await db2(str).then((result)=> value=result)
        if(value==1){
            return str
        }else{
            generaterand()
        }
    }

    
router.post("/addgroup",(req,res)=>{
grp.find({
    email:req.session.userid,
}).then((result)=>{
    
    if(!result || result.length==0){

        let t = new grp({
            email:req.session.userid,
            group:{
                nameofgroup:req.body.value,
            }
        })
        t.save((err,data)=>{
            if(err) console.log(err)
        })
            generaterand().then((result)=>{
            let t = new online({
                email:req.session.userid,
                group:{
                groupname:req.body.value,
                identity:result
                }

            })
            t.save((err,doc) =>{ if(err) {
                console.log(err)}
                console.log(doc)}
            )
            })
    
        res.send("done")

    }else {
        grp.find({
            email:req.session.userid,
            group:{
                nameofgroup:req.body.value
            }}).then((result)=>{
                if(!result || result.length==0){
                    grp.findOneAndUpdate({
                        email:req.session.userid
                    },{$push:{group:{
                        nameofgroup:req.body.value
                    }}}).then((err)=>{
                        if(err) console.log(err)
                    })
                }
            })
            generaterand().then((result)=>{
            online.findOneAndUpdate({email:req.session.userid},{'$push':{group:{groupname:req.body.value,identity:result}}}).then((result)=>{
                console.log("done",result)
            })

    })}})})


router.post("/addmember/:group",(req,res)=>{

    
            
allusers.findOneAndUpdate({email:req.session.userid},{'$push':{employees:{email:req.body.value}}}).exec(function(err, user){
    
})
    grp.findOneAndUpdate({"email":req.session.userid,"group.nameofgroup":req.params.group},{$addToSet:{"group.$.members":{memberemail:req.body.value}}})
    .then((result)=>{ 
            
        res.send("done")
    })
}

)

router.post("/removemember/:group",async (req,res)=>{

    await admin.memberexist(req.body.value,req.params.name).then((result)=>{

        if(result!=0){

    grp.findOneAndUpdate({"email":req.session.userid,"group.nameofgroup":req.params.group},{'$pull':{
        "group.$.members":{
            memberemail:req.body.value
        }
    
    }}).then((result)=>{
        if(!result){
            res.send("error")
        }
    })
}else{
    res.send("not a member")
}})})

router.post("/delgroup",async(req,res)=>{


    if(req.session.permission=="admin"){
        await db3.mygroup(req.session.userid,req.body.value).then((result)=>{
            if(result!=0){
                grp.findOneAndUpdate({"email":req.session.userid},{$pull:{'group':{'nameofgroup':req.body.value}}}).then((result)=>{
                    res.send("done")
                })

            }
        })

    }
})


module.exports= router;
 