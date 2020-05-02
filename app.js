var express      =require("express"),
    app          =express(),
    bodyParser   =require("body-parser"),
	flash        =require("connect-flash"),
	mongoose     =require("mongoose"),
	passport     =require("passport"),
	LocalStrategy=require("passport-local"),
	overriding   =require("method-override"),
	campgrounds  =require("./models/campground.js"),
	User         =require("./models/user.js"),
	Comment      =require("./models/comment.js"),
	seedDB       =require("./seeds.js");

var commentRoutes   =require("./routes/comments.js"),
	campgroundRoutes=require("./routes/campgrounds.js"),
	authRoutes      =require("./routes/landing.js");

// seedDB(); //seed the database
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
// process.env.DATABASEURL
// mongodb://localhost/yelp_camp_v1
mongoose.connect(process.env.DATABASEURL);


app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
	secret:"Rusty is the cutest dog",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});
app.use(overriding("_method"));
app.use("/",authRoutes);
app.use("/campgrounds/:id/comments/",commentRoutes);
app.use("/campgrounds",campgroundRoutes);


// app.listen(3000,function(){
// 	console.log("YelpCamp");
// });
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
