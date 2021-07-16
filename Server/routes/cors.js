const express= require('express');
const cors=require('cors');
const app= express();

const whitelist= ['http://localhost:3000','https://localhost:3443','http://DESKTOP-8VF4HM0:3001','http://localhost:3001'];//list of origins server is willing to accept
var corsoptionsDelegate= (req, callback)=>{
    var corsOptions;

    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions ={origin: true};
    }
    else{
        corsOptions= {origin: false};
    }
    callback(null, corsOptions);
}

exports.cors= cors();
exports.corsWithOptions= cors(corsoptionsDelegate);