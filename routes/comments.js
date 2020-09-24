const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// COMMENT ROUTES

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground});
		}
	});
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
	// lookup campground using id
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			// create new comment
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong.");
					console.log(err);
				}
				else{
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// add comment to campground
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Added comment!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
		}
	});
});

// COMMENT UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err,updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success","Comment updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("error","Comment deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;