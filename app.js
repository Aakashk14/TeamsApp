const express = require('express');
const socket = require('socket.io');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/teamspace',{autoIndex:true})
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var cookieparser =  require('cookie-parser');
const Time = 1000*60*60*2
const path = require('path');
const session = require('express-session');
app = express();
global.sessionMiddleware=session({
    secret:"123pvt",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:Time,
        sameSite: true
    
   }
})
app.use(sessionMiddleware);
app.use(cookieparser())
const host="0.0.0.0";

const server = app.listen(3000,host,()=>console.log("listening"));
const io = socket(server);



app.set("view engine","ejs");
app.use(express.static('public'));


app.use("/thumbnail/",express.static(path.join(__dirname,'public/images/')));
app.get("/signup",(req,res)=>{

    res.sendFile(path.join(__dirname,"signup.html"))
})
app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.render("index.ejs")
})

app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ extended: true ,limit:'50mb',parameterLimit: 1000000}));


app.use(require('./main/main'));

app.use(require('./main/files'));

app.use(require('./main/dashboard'));
app.use(require('./main/group'))


require('./main/discussion')(app)
app.use(require('./main/newuser'))









app.post("/checkpermission",(req,res)=>{
    if(req.session.permission=="admin"){
        let t = req.body.groupname
        res.redirect(`/group/${req.body.groupname}`)
    }
})



app.get("/",(req,res)=>{
    console.log("Working")

    if(req.session.userid){
        res.redirect("/homepage")
    }else{
    res.render("index.ejs")
    }

})


require('./main/socket')(io)
