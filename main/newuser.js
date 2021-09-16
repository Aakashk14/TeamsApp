const express=require('express');

var router = express.Router();
const login = require('../models/login')
const groups = require('../models/groups')

const relations = require('../models/relationship')
const db4 = require('../models/queries/db4');




    router.post("/create", (req, res) => {


        login.find({ email: req.body.email }).then(async(result) => {
            if(!result || result.length==0){


            if(req.body.role=="user"){
            

            await db4.getbossemail(req.body.email).then( async(result)=>{
                if(result!=0){
                        await db4.add(req.body.email,req.body.name,req.body.password,req.body.role).then((result)=>{
                            if(result!= 0){
                           
                            res.render("index.ejs", { created: 1 })
                            }else{
                                res.end("hmm got some error")
                            }

                        })
                        
                    }else{
                        res.end(" Your email is not registered by any org. You can only sign up as Admin")
                    }
                })
              }  else{

                let tm = new login({
                    Name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role

                })
                tm.save((err, doc) => {
                    if (err) console.log(err)
                })
                let tm2 = new relations({
                    email:req.body.email,
                })
                tm2.save()
                res.render("index.ejs",{created:1})

            }
        }else{
            res.end("Already an account")
        }
    })})
        module.exports=router