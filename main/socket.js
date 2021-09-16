const relations= require('../models/relationship')
const main = require('../app');
const session = require('express-session');
const discussion = require('./discussion');
const meeting = require('../models/meeting');

const groups = require('../models/groups')
const online = require('../models/uniqueness');
const db2 = require('../models/queries/db2');
const update = require('../models/queries/status');
const db3 = require('../models/queries/db3')
const db4 = require('../models/queries/db4')


module.exports = function(io){

    var t;

    io.use(function(socket,next){

        sessionMiddleware(socket.request, socket.request.res,next);
        
    })


io.on('connection',async(socket)=>{

    socket.on("join me",(data,meetid)=>{
        socket.request.session.index=0;
        let t = data.groupname+"_id";
        socket.request.session[t]=data.meetid
        socket.request.session.save();
        data=data.groupname+"[Admin] started meeting "
        db3.notifications(socket.request.session.userid,data)

    
    })

    if(socket.request.session.permission=="user"){
        await db3.channel(socket.request.session.userid,socket).then((result)=>{
            
        })}else{

                online.find({email:socket.request.session.userid}).then((res)=>{
                    for(let i=0;i<res[0].group.length;i++){
                    socket.join(res[0].group[i].identity)
                    }
                })
            }
    

socket.on('new meeting',async(t_g)=>{
 
 await db3.mygroup(socket.request.session.userid,t_g).then(async(result)=>{
                if(result==1){

        

        await db4.getid(socket.request.session.userid,t_g).then(async(result)=>{
            let t_gm = t_g+"_id"
            socket.request.session[t_gm]=result

        
            await db3.meeting(t_g,socket,socket.request.session[t_gm]).then((result)=>{
                socket.request.session[t_g]=result
                let t = t_g+"_id";
                t= socket.request.session[t];
                socket.broadcast.to(result).emit("Alert",{groupname:t_g,meetid:t});
                update.meeting(result,t)
      
                
                socket.request.session.save();
      
      
          })})
        }})
    socket.request.session.save();

})

socket.on("new message",(data)=>{
data_firstmsg= data.group+"_firstmsg";
socket.request.session[data_firstmsg]=1;
socket.request.session.save()
let tmp_name = data.group


let room = socket.request.session[tmp_name]

if(data.filename && data.message) {
    
    socket.broadcast.to(room).emit("new message",{message:data.message,file:data.filename,name:socket.request.session.name})
}
else if(data.filename){

        socket.broadcast.to(room).emit("new message",{file:data.filename,name:socket.request.session.name})
    
 }else{
    socket.broadcast.to(room).emit("new message",{message:data.message,name:socket.request.session.name})

     }
     update.started(room)

})

socket.on("closing",(group)=>{
    let t = group+"_id";
    let tt=group+"_firstmsg"
    socket.request.session[t]=null;
    socket.request.session[group]=null;
    socket.request.session[tt]=null;
    socket.request.session.save();

})

socket.on("close con",(group)=>{
    let room = socket.request.session[group]
    update.end(socket.request.session[group]);

    let t = group+"_id";
    let tt = group+"_firstmsg"
    socket.request.session[t]=null;
    socket.request.session[tt]=null
    socket.request.session[group]=null;
    socket.broadcast.to(room).emit("end meeting",{message:group})

    socket.request.session.save();

})


})}