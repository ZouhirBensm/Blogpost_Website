const express = require('express')

global.loggedIn = null;

const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload') 
const expressSession = require('express-session')
const flash = require('connect-flash')

const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')


const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const validateMiddleware = require("./middleware/validateMiddleware");
const authMiddleware = require("./middleware/authMiddleware");

app.use(fileUpload()) 

//mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true});

mongoose.connect('mongodb+srv://Maestro:DB%24%251993@cluster0.81z5d.mongodb.net/my_database', {useNewUrlParser: true});
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.set('view engine','ejs')

app.use(express.static('public'))

// app.listen(4000, ()=>{
//     console.log('App listening on port 4000 ...')    
// })

let port = process.env.PORT;
if(port == null || port==""){
    port = 4000;
}

app.listen(port, ()=>{
    console.log('App listening...')
})

app.use('/posts/store',validateMiddleware) 

app.use(expressSession({
    secret: 'keyboard cat'
}))

app.use('*',(req,res,next)=>{
    loggedIn = req.session.userID;
    next()
})

app.use(flash());

app.get('/posts/new', authMiddleware ,newPostController)
app.get('/',homeController)
app.get('/post/:id',getPostController)        
app.post('/posts/store', authMiddleware ,storePostController)
app.get('/auth/register', redirectIfAuthenticatedMiddleware , newUserController)
app.post('/users/register', redirectIfAuthenticatedMiddleware , storeUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware ,loginController)
app.post('/users/login', redirectIfAuthenticatedMiddleware ,loginUserController)
app.get('/auth/logout', logoutController)
app.use((req,res)=>res.render('notfound'));



const validateMiddleWare = (req,res,next)=>{    
    if(req.files == null || req.body.title == null || req.body.title == null){        
        return res.redirect('/posts/new')
    }    
    next()
}

app.get('/post/:id',async (req,res)=>{        
    const blogpost = await BlogPost.findById(req.params.id)
    console.log(blogpost)
    res.render('post',{
        blogpost
    });    
})

app.post('/posts/store', (req,res)=>{ 
    let image = req.files.image;  
    image.mv(path.resolve(__dirname,'public/img',image.name),async (error)=>{
        await BlogPost.create({
            ...req.body,
            image: '/img/' + image.name
        })
        res.redirect('/')
    })            
})

app.get('/',async (req,res)=>{    
    console.log("home starting...")
    const blogposts = await BlogPost.find({})         
    res.render('index',{
        blogposts
    });
})

