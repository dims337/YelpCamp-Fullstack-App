let express         = require('express');
let app             = express();
let bodyParser      = require("body-parser");
let mongoose        = require("mongoose");
let passport        = require("passport");
let LocalStrategy   = require("passport-local");
let Campground      = require("./models/campground")
let Comment         = require("./models/comment");
let User            = require("./models/user");


mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));


//=============PASSPORT CONFIGURATION==============


app.use(require("express-session")({
    secret: "maomao",
    resave: false,
    saveUninitialize: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//------middleware to add "currentUser" to all routes------

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
    
    


//======================================================



//SCHEMA SETUP------------------------------
//---------------------------------------------
// Campground.create({
//     name:"dimi", 
//     image:"https://media-cdn.tripadvisor.com/media/photo-s/09/22/fa/f5/mount-desert-campground.jpg",
//     description: "Beautiful place! admire all that landscape!!!!!"
    
// }, function(err, campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log('campground added to db');
//         console.log(campground);
//     }
// });




//=================ROUTES========================


app.get('/', function(req, res){
    res.render('landing');
});

//------SHOWS ALL CAMPGROUNDS FROM DB-----------------
app.get('/campgrounds', function(req, res){
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
app.post('/campgrounds', function(req, res){
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
app.get("/campgrounds/new", function(req, res) {
    res.render('campgrounds/new');
})


//-------SHOWS DETAIL VIEW OF A CAMPGROUND---------------
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground:foundcampground});
        }
    })
});




//=================COMMENTS ROUTES======================================


app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res) {
    //-----find campground by ID-------
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    });
  
    
})

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res) {
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
   
   
   
   
   
    
//==================AUTH ROUTES========================

//------show register form------------
app.get("/register", function(req, res) {
    res.render("register")
});

//-------signup logic-----------------
app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
    res.render("login");
});


//-----login logic------------
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

//----------LogOut Route-------------

app.get("/logout", function(req, res) {
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


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started');
})