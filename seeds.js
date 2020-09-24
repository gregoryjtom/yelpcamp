const mongoose = require("mongoose"),
	  Campground = require("./models/campground"),
 	  Comment   = require("./models/comment");

const data = [
		{name: "Salmon Creek", image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80", description: "Cool salmon! Great place!"},
		{name: "Granite Hill", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80", description: "Nice granite and wonderful views!"},
		{name: "Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80", description: "Lovely highlands and beautiful campsite!"}
	];

function seedDB(){
	// remove all campgrounds
	Campground.remove({},function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log("Removed all campgrounds");
			// make campgrounds
			data.forEach(function(seed){
				Campground.create(seed,function(err, campground){
					if(err){
						console.log(err);
					}
					else{
						console.log("Added a campground");
						Comment.create(
							{
								text: "This place is great, but no internet :(",
								author: "Homer"
							}, function(err,comment){
								if(err){
									console.log(err);
								}
								else{
									campground.comments.push(comment);
									campground.save();
									console.log("Comment created!")
								}
							}
						)
					}
			});
	});
		}
	})
	
	
}

module.exports = seedDB;