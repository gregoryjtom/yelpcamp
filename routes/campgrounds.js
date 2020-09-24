const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

router.get("/campgrounds", function(req,res){
	//Get all campgrounds from DB and send
	Campground.find({}, function(err,allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	});
});

router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
	// get data from form and add to campgrounds array
	const name = req.body.name;
	const image = req.body.image;
	const desc = req.body.description;
	const price = req.body.price;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const newCampground = {name:name, image:image, description:desc, price:price, author:author};
	// add campground to DB
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			// redirect back to campgrounds page
			req.flash("success","Campground created!");
			res.redirect("/campgrounds");
		}
	});	
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function(req,res){
	//find campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			//show page of provided campground
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
});

// EDIT ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id,function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
				
				res.render("campgrounds/edit",{campground:foundCampground});
		}
	});
});

// UPDATE ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;