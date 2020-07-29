const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

// set Storage Engine
// function for storing uploaded file by getting fieldname, date and filename with extension

const storage = multer.diskStorage({
    destination:'./public/upload/', filename:function(req, file, cb){
        cb(null,file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

// instializing upload variable
const upload = multer({
    storage: storage,
    limits:{fileSize:10000000},
    fileFilter:function(req,file,cb){
        checkFileType(file, cb)
    }
    // can upload single file
}).single('image')

//check file type
function checkFileType(file, cb){
    // Allowed file types
    const filetypes = /jpeg|png|jpg|gif/;
    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    // check mime type 
    const mimetype = filetypes.test(file.mimetype)

    // detecting file to restrict the upload specified file type
    if(mimetype && extname){
        return cb(null,true)
    }else{
        cb('please upload only images')
    }
}

const app =  express();

// specifying template engine as EJS
app.set('view engine', 'ejs')

// to get file from user
app.get('/', (req,res) => res.render('index'))

// function to uploaded file for no file, error, and successful upload
app.post('/upload', (req,res)=>{
    upload(req, res, (err)=>{
        if(err){
            res.render('index', {
                msg:err
            })
        }else
        if(req.file == undefined){
            res.render('index',{
                msg:'error! no file chosen'
            })
        }
        else{
           res.render('index', {
               msg:'file uploaded successfully',
               file:`upload/${req.file.filename}`
           })
        }

    })
})

// for storing files
app.use(express.static('./public'));

// setting port to and make sure it runs onlocalhost 3000
const port = 3000

app.listen(port, ()=> 
    console.log(`server started listening at ${port}`))
