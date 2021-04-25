module.exports = (req, res) =>{
    if(req.session.userID){
        return res.render('create', {
            createPost: true
        })
    }
    res.redirect('/auth/login')
}