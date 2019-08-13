var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


//SCHEMA SETUP------------------------------

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   
});


var Campground = mongoose.model("Campground", campgroundSchema);

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





app.get('/', function(req, res){
    res.render('landing');
});

//SHOWS ALL CAMPGROUNDS FROM DB----------------------
app.get('/campgrounds', function(req, res){
    //Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render('index', {campgrounds:allCampgrounds});
        }
    })
    
     
});


//CREATE A NEW CAMPGROUND---------------------
app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name, image:image, description:desc};
   // Create new campground and save to db
   Campground.create(newCampground, function(err, newdata){
       if(err){
           console.log(err)
       }else{
          res.redirect('/campgrounds'); 
       }
   })
   
    
});


//SHOWS THE FORM TO CREATE NEW CAMPGROUND----------
app.get("/campgrounds/new", function(req, res) {
    res.render('new.ejs');
})


//SHOWS DETAIL VIEW OF A CAMPGROUND---------------
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundcampground){
        if(err){
            console.log(err);
        }else{
            res.render("show", {campground:foundcampground});
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started')
})