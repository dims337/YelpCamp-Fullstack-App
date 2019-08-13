let express           = require("express");
let router            = express.Router();
let Campground        = require("../models/campground");




//=================CAMPGROUND ROUTES========================


//------SHOWS ALL CAMPGROUNDS FROM DB-----------------
router.get('/', function(req, res){
    //-----Get all campgrounds from db------
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
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
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {name:name, image:image, description:desc, author:author};
    
    
   //------CRERATE NEW CAMPGROUND AND SAVE TO DB---------
   Campground.create(newCampground, function(err, newdata){
       if(err){
           console.log(err);
       }else{
          res.redirect('/campgrounds'); 
       }
   });
   
    
});


//-----SHOWS THE FORM TO CREATE NEW CAMPGROUND----------
router.get("/new",isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});


//-------SHOWS DETAIL VIEW OF A CAMPGROUND---------------
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground:foundcampground});
        }
    });
});


//----------------EDIT CAMPGROUND------------------
router.get("/:id/edit", checkCampgroundOwnership , function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            res.redirect("back");
        }else{
                res.render("campgrounds/edit",{campground:foundCampground});
        }
    });
});


//-------------UPDATE CAMPGROUND ROUTES----------------

router.put("/:id", function(req, res){
    //find and update campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err){
            res.redirect("/show");
        }else{
            //redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

//--------DESTROY CAMPGROUND ROUTE-----------

router.delete("/:id", function(req, res){
    Campground.findByIdAndDestroy(req.params.id, function(err){
        if (err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//---------Middleware----------
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//---middleware to check campground ownership---
function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated){
        Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            res.redirect("back");
        }else{
            //---does user own campground?---
            if(foundCampground.author.id.equals(req.user._id)){
                next();
               // res.render("campgrounds/edit",{campground:foundCampground});
            }else{
                res.redirect("back");
            }
            
        }
        });
    }else{
    res.redirect("back")
    }
}

module.exports = router;