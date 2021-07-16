const express= require('express');
const bodyParser= require('body-parser');
const authenticate= require('../authenticate');
const multer= require('multer');
const cors= require('./cors');

const storage= multer.diskStorage({
    destination: (req, file,cb/*callback*/)=>{
        cb(null, 'public/images');//cb takes two paramaters here (error, destination for saving uploaded file)
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname);//cb take two paramaters here (error, what name do we want to set for uploaded file)
    }
});

const imageFileFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files !', false));
    }
        cb(null, true);
}

const upload= multer({storage: storage, fileFilter: imageFileFilter});


const uploadRouter= express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,
    upload.single('imageFile'),(req,res)=>{//we need to use the key imageFile while uploading form data
        res.statusCode= 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('DELETE operation not supported on /imageUpload');
})

module.exports= uploadRouter;