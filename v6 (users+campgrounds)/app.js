let express         = require('express'),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");

//------requiring routes------------
let commentRoutes      = require("./routes/comments"),
    campgroundRoutes   = require("./routes/campground"),
    authRoutes         = require("./routes/index");


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

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
    

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started');
});