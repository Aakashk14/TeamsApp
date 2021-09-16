const groups = require('../groups')

    
module.exports.getgroupmembers = function(email,groupname){
    return new Promise((resolve,reject)=>{
        groups.aggregate([{$match:{"email":email}},{ "$unwind": { "path": "$group", "preserveNullAndEmptyArrays": true } },
        {"$unwind":{"path":"$group"}},
        {"$project":{
            groupname:"$group.nameofgroup",
            members:"$group.members"
        }},{"$match":{groupname:groupname}}
        ]).then((res)=>{
            if(res.length >0){
            resolve(res[0].members)}
            else{
                resolve(0)
            }
        })
    })
}


module.exports.memberexist=function(email,groupname){
    return new Promise((resolve,reject)=>{
    
    groups.aggregate([{$match:{"email":"aakash.kumar.cs.2016@miet.ac.in"}},{ "$unwind": { "path": "$group", "preserveNullAndEmptyArrays": true } },
{"$unwind":{"path":"$group"}},
{"$project":{
    groupname:"$group.nameofgroup",
    members:"$group.members"
}},{"$unwind":{"path":"$members"}},
{"$match":{"members.memberemail":"rahul@miet.ac.in"}},
]).then((res)=>{
    if(res.length >0 || result){
    resolve(1)
    }else{
        resolve(0)
    }
})
    })}

module.exports.groupcheck=function(email,groupname){

    return new Promise((resolve,reject)=>{
        groups.aggregate([{$match:{"email":"aakash.kumar.cs.2016@miet.ac.in"}},{ "$unwind": { "path": "$group", "preserveNullAndEmptyArrays": true } },
{"$unwind":{"path":"$group"}},
{"$project":{
    groupname:"$group.nameofgroup",
}},{'$match':{groupname:"Hellos world"}}
]).then((res)=>{
    if(res.length ==0 || !result){
        resolve(1)
    }else{
        resolve(0)
    }
    })
    })}

