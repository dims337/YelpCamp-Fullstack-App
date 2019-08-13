let express        = require("express");
let router         = express.Router({mergeParams: true});
let Campground     =  require("../models/campground");
let Comment        = require("../models/comment");



//=================COMMENTS ROUTES======================================

//------comments new---------------
router.get("/new",isLoggedIn, function(req, res) {
    //-----find campground by ID-------
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    });
  
    
});

//------create comments------------
router.post("/",isLoggedIn, function(req, res) {
    //--------find campground by ID---------------
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
             //-----create new comment--------
           Comment.create(req.body.comment, function(err,comment){
               if (err){
                   console.log(err)
               }else{
                    //------connect new comment to campground-----
                   campground.comments.push(comment)
                   campground.save();
                    //---redirect campground to show page---
                   res.redirect("/campgrounds/" + campground._id)
               }
           });
        }
    });
});


//---------middleware-------------
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
   