const User = require("../models/User");

module.exports = (req, res) =>{ 
    var username = "" //This is to avoid the form from throwing an error saying that the value is null of undefined
    var password = ""
    const data = req.flash('data')[0];    


    

    if(typeof data != "undefined"){        
        username = data.username
        password = data.password
        console.log(data)
    }
     
    res.render('register',{        
        errors: req.flash('validationErrors'),
        username: username,
        password: password
    })
}


//errors: req.session.validationErrors    
// retrieve errors from key and make them available to this view


//errors: req.session.validationErrors    
// retrieve errors from key and make them available to this view