let express           = require("express");
let router            = express.Router();
let Campground        = require("../models/campground");




//=================campground ROUTES========================


//------SHOWS ALL CAMPGROUNDS FROM DB-----------------
router.get('/', function(req, res){
    //-----Get all campgrounds from db------
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
        }
    });
});


//---------CREATE A NEW CAMPGROUND---------------------
router.post('/',isLoggedIn, function(req, res){
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {name:name, image:image, description:desc};
    
   //------Create new campground and save to db---------
   Campground.create(newCampground, function(err, newdata){
       if(err){
           console.log(err)
       }else{
          res.redirect('/campgrounds'); 
       }
   })
   
    
});


//-----SHOWS THE FORM TO CREATE NEW CAMPGROUND----------
router.get("/new",isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
})


//-------SHOWS DETAIL VIEW OF A CAMPGROUND---------------
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground:foundcampground});
        }
    })
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login");
}

module.exports = router;