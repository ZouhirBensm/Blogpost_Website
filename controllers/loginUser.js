const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = (req,res)=>{
    const {username, password}= req.body;

    User.findOne({username:username}, (error,user)=>{
        if(user){ //user retrived from database
            bcrypt.compare(password, user.password, (error,same)=>{
                if(same){
                    //store user in session
                    req.session.userID = user._id //server = browser
                    res.redirect('/')
                } else{
                    res.redirect('/auth/login')
                }
            })
        }
    })
}