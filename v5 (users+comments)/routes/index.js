let express          = require("express");
let router           = express.Router();
let User             = require("../models/user");
let passport         = require("passport");


//--------index route------------
router.get('/', function(req, res){
    res.render('landing');
});


//==================AUTH ROUTES========================

//------show sign up form------------
router.get("/register", function(req, res) {
    res.render("register");
});

//-------signup logic-----------------
router.post("/register", function(req, res) {
    let newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds") 
        });
    });
});


//-----show login form---------
router.get("/login", function(req, res) {
    res.render("login");
});


//-----login logic------------
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

//----------LogOut Route-------------

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds")
});


//---middleware-----
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
