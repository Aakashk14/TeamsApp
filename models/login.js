const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const user =new mongoose.Schema({
    Name:{type:String},
    email:{type:String,unique:true},
    password:String,
    role:String
});


const login = mongoose.model('login',user,'logins');


module.exports=login;