var express = require("express");
var router = express.Router({mergeParams: true}); //Merge params allows us to get the data from a destination.
var Destination = require("../models/destination"),
    Comment = require("../models/comment");
var middleware = require("../middleware");

//=============================
//COMMENT ROUTES
//=============================

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by id 
    Destination.findById(req.params.id, function(err, destination){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {destination: destination});
        }
    });
    //then pass it to the comment/new route
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using id
    Destination.findById(req.params.id, function(err, destination){
        if(err){
            console.log(err);
            res.redirect("/destinations");
        } else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   //add user and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   //create new comment
                   destination.comments.push(comment);
                   destination.save();
                   //connect new comment to destination
                   //redirect to current destination
                   req.flash("success", "New Comment Added");
                   res.redirect('/destinations/' + destination._id);
               }
           });
        }
    });
    
});

//Comments EDIT Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {destination_id: req.params.id, comment: foundComment});
        }
    });
});

//Comments UPDATE Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/destinations/" + req.params.id);
       }
   });
});

//Comments DESTROY Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment has been Deleted");
           res.redirect("/destinations/" + req.params.id);
       }
    });
});




module.exports = router;