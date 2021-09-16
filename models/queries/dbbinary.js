const convo = require('../meeting')


module.exports.convo1 = function(mainemail,grpname,meetid,myname,fromemail,mymsg,fileexist,filename){
convo.findOneAndUpdate(
    {email:mainemail,groupname:grpname,meetingid:meetid},
    {"$push":{chats:{name:myname,from:fromemail,msg:mymsg,file:fileexist,filename:filename}}}
).exec()

}