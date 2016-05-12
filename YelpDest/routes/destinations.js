var express = require("express");
var router = express.Router();
var Destination = require("../models/destination");
var middleware = require("../middleware");


//The destinations route path
router.get("/", function(req, res){
    //Get all destinations from DB
    Destination.find({}, function(err, allDestinations){
        if(err){
            console.log(err);
        } else{
            res.render("destinations/index", {destinations: allDestinations});
        }
    });
});

//Post route for destinations (restful)
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var img = req.body.img;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newDestination = {name: name, img: img, description: desc, author: author};
    //Create a new destination and save to DB
    Destination.create(newDestination, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/destinations");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("destinations/new");
});

//Show RESTfull - will show more info about one destination
router.get("/:id", function(req, res){
    //find the destination with provided ID
    Destination.findById(req.params.id).populate("comments").exec(function(err, foundDestination){
        if(err){
            console.log(err)
        } else{
            res.render("destinations/show", {destination: foundDestination});
        }
    });
});

//EDIT Destination Route
router.get("/:id/edit", middleware.checkDestinationOwnership, function(req, res) {
    Destination.findById(req.params.id, function(err, foundDestination){
            res.render("destinations/edit", {destination: foundDestination});
    });
});

//UPDATE Destination Route
router.put("/:id", middleware.checkDestinationOwnership, function(req, res){
   Destination.findByIdAndUpdate(req.params.id, req.body.destination, function(err, updatedDestination){
       if(err){
           res.redirect("/destinations");
       } else {
           res.redirect("/destinations/" + req.params.id);
       }
   });
});

//DESTROY Destination Route
router.delete("/:id", middleware.checkDestinationOwnership, function(req, res){
   Destination.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           res.redirect("/destinations");
       } else {
           res.redirect("/destinations");
       }
   }) ;
});




module.exports = router;