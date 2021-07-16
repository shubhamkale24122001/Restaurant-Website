var mongoose = require('mongoose');
var Schema= mongoose.Schema;
var passportLocalMongoose= require('passport-local-mongoose');

var User = new Schema({
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose); //passport-local-mongoose will automatically add support for username and hashed storage of password
module.exports= mongoose.model('User', User);