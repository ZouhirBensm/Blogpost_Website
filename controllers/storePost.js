
const BlogPost = require('../models/BlogPost.js');
const path = require('path');

module.exports = (req,res)=>{ 
    let image = req.files.image;
    image.mv(path.resolve(__dirname,'..','public/img',image.name), //only in the scope where we use await should async be declared
    (error) => {
        BlogPost.create({
            ...req.body,
            image: '/img/'+image.name,
            userid: req.session.userID
        },(error,blogpost)=>{
            res.redirect('/');
        });
    })  
}