var express = require("express");
var router = express.Router();
var User = require("../models/user"),
    passport = require("passport");

//The Hompage route path
router.get("/", function(req, res){
    res.render("landing");
});


//================
//AUTH ROUTES
//================

//show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//Handles signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message)
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("succes", "Welcome To YelpDest " + user.username);
           res.redirect("/destinations");
       });
   });
});

//Show login form
router.get("/login", function(req, res){
   res.render("login");
});
//Handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/destinations",
        failureRedirect: "/login"
}), function(req, res){
    //callback can be left blank
});

//Logout route
router.get("/logout", function(req, res){
   req.logout(); 
   req.flash("error", "Logged You Out!");
   res.redirect("/destinations");
});



module.exports = router;