//MIDDLEWARE FUNCTIONS
var Destination = require("../models/destination"),
    Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkDestinationOwnership = function(req, res, next){
    //Is the user logged in
    if(req.isAuthenticated()) {
        Destination.findById(req.params.id, function(err, foundDestination){
            if(err){
                req.flash("error", "Destination Not Found");
                res.redirect("back");
            } else {
                //does the user own the destination
                if(foundDestination.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You Must Be The Owner To Do That!");
                    res.redirect("back");
                }
            }
        
        });
    } else {
        req.flash("error", "You Must Be Logged In To Do That!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    //Is the user logged in
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                //does the user own the destination
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You Must Be The Owner To Do That!");
                    res.redirect("back");
                }
            }
        
        });
    } else {
        req.flash("error", "You Must Be Logged In To Do That!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Must Be Logged In To Do That!");
    res.redirect("/login");
}


module.exports = middlewareObj;