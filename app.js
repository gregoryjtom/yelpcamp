const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  passport = require("passport"),
	  localStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
	  flash = require("connect-flash"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment"),
	  User = require("./models/user"),
	  seedDB = require("./seeds");

const campgroundRoutes = require("./routes/campgrounds"),
	  commentRoutes = require("./routes/comments"),
	  indexRoutes = require("./routes/index");

// Local database - mongodb://localhost:27017/yelp_camp

const url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";

// Cloud database - mongodb+srv://greg:tom@cluster0.expfg.mongodb.net/yelp_camp?retryWrites=true&w=majority
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();  // seed the database

app.use(flash());

// CONFIGURE PASSPORT
app.use(require("express-session")({
	secret: "Marty is the best!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* EXTRANEOUS CAMPGROUND CREATION

let campgrounds = [
		{name: "Salmon Creek", image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
		{name: "Granite Hill", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
		{name: "Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80"},
	];
*/

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("YelpCamp server has started!");
});