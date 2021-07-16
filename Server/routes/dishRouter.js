const express= require('express');
const bodyParser= require('body-parser');
const mongoose= require('mongoose');
const authenticate= require('../authenticate');
const cors= require('./cors');

const Dishes= require('../models/dishes');

const dishRouter= express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})//this is also type of http request, when called it sends what all requests of pemitted at the endpoint through headers
.get(cors.cors,(req,res,next)=>{
    Dishes.find(req.query)
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);// So, when you call res.json and supply the value and then it will simply take the parameter that you give here and then send it back as a json response. It will put this dishes into the body of the reply message and then send it back to the server. 
    },(err)=>next(err))
    .catch((err)=>next(err));//return next(err) because, in app.js at the bottom there is a function which handles error
})
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish Created', dish);
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on dishes');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    },{new: true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
});



module.exports= dishRouter;