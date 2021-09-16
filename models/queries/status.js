const act = require('../active')
module.exports.meeting=function(identifier,meetid){


        
            let t = new act({
                identity:identifier,
                status:1,
                first:0,
                meetingid:meetid
            })
            t.save((err,doc)=>{
                console.log("done")
            })
        }


module.exports.started=function(identifier){

    act.findOneAndUpdate({
        identity:identifier
    },{first:1}).then((result)=>{
        console.log("done")
    })
}
        

module.exports.end=function(identifier){
    act.findOneAndDelete({identity:identifier}).then((
        console.log("done")
    ))


}
