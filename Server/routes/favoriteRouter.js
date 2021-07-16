const express= require('express');
const bodyParser= require('body-parser');
const authenticate= require('../authenticate');
const cors= require('./cors');

const Favorite= require('../models/favorite');
const user = require('../models/user');

favoriteRouter= express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorite.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite)=>{
        res.statusCode= 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorite[0]);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorite.find({user:req.user._id})
    .then((favorite)=>{
        if(favorite[0]){
            for(var i=0; i<req.body.length; ++i){
                if(favorite[0].dishes.indexOf(req.body[i]._id) == -1){
                    favorite[0].dishes.push(req.body[i]._id);
                }
            }
            favorite.save()
                .then((favorite)=>{
                    Favorite.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    
                }, (err)=>next(err))
        }
        else{
            Favorite.create({
                user: req.user._id,
                dishes:[]
            })
            .then((favorite)=>{
                for(var i=0; i<req.body.length; ++i){
                    favorite.dishes.push(req.body[i]._id);                
                }
                favorite.save()
                .then((favorite)=>{
                    Favorite.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    
                }, (err)=>next(err))
 
            },(err)=>next(err));
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorite.deleteOne({user: req.user._id})
    .then((favorite)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorite.findOne({user: req.user._id})
    .then((favorites)=>{
        if(!favorites){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({"exists":false, "favorites":favorites});
        }
        else{
            if(favorites.dishes.indexOf(req.params.dishId)<0){
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json({"exists":false, "favorites":favorites});
            }
            else{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json({"exists":true, "favorites":favorites});
            }
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorite.find({user:req.user._id})
    .then((favorite)=>{
        if(favorite[0]){
            if(favorite[0].dishes.indexOf(req.params.dishId) === -1){
                favorite[0].dishes.push(req.params.dishId);
            }
            favorite[0].save()
                .then((favorite)=>{
                    Favorite.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    
                }, (err)=>next(err))
        }
        else{
            Favorite.create({
                user: req.user._id,
                dishes:[]
            })
            .then((favorite)=>{
                favorite.dishes.push(req.params.dishId);

                favorite.save()
                .then((favorite)=>{
                    Favorite.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                }, (err)=>next(err))
 
            },(err)=>next(err));
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorite.find({user: req.user._id})
    .then((favorite)=>{
        var index= favorite[0].dishes.indexOf(req.params.dishId);
        favorite[0].dishes.splice(index,1);
        favorite.save()
        .then((favorite)=>{
            Favorite.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((favorite)=>{
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }, (err)=>next(err))
    },(err)=>next(err))
    .catch((err)=>next(err));

});

module.exports= favoriteRouter;