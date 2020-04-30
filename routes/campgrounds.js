var express=require("express");
var router =express.Router();
var campgrounds=require("../models/campground.js");
var middleware=require("../middleware");
router.get("/",function(req,res){
	
     campgrounds.find({},function(err,allCampgrounds){
		 if(err){
			 console.log("error");
		 }
		 else{
			 res.render("campgrounds/campgrounds.ejs",{campgrounds:allCampgrounds,currentUser:req.user});
		 }
	 });
	
});

router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var description=req.body.description;
	var author={
		username:req.user.username,
		id:req.user._id
	}
	var newCampground={name:name,price:price,image:image,description:description,author:author}
	
	campgrounds.create(newCampground,function(err,newlyCreated){
		
		 if(err){
	        	console.log("error");
		 }
		 else{
			 console.log(newlyCreated);
				res.redirect("/campgrounds");
		 }

	});
	
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new.ejs");
});

router.get("/:id",function(req,res){
	
	campgrounds.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		// || ! foundCampground is imp to prevent breaking down of aur app if obj id is chnaged
		if(err || !foundCampground){
			req.flash("error","Campground Not Found");
			res.redirect("back");
		 }
		
		else{
			console.log(foundCampground);
			 res.render("campgrounds/show.ejs",{campgrounds:foundCampground});
		 }	
		
		});
	
});
//edit
router.get("/:id/edit",middleware.chechCGOwnership,function(req,res){
	//is user logged in?
	
	   campgrounds.findById(req.params.id,function(err,foundCampground){
			res.render("campgrounds/edit.ejs",{campgrounds:foundCampground});
		   });
});
//update
router.put("/:id",middleware.chechCGOwnership,function(req,res){
campgrounds.findByIdAndUpdate(req.params.id,req.body.campgrounds,function(err,updatedCampgrounds){
	if(err){
		res.redirect("/campgrounds");
	}
	else{
		res.redirect("/campgrounds/" + req.params.id);
	}
});

});

router.delete("/:id",middleware.chechCGOwnership,function(req,res){
	campgrounds.findByIdAndRemove(req.params.id,req.body.campgrounds,function(err,updatedCampgrounds){
	if(err){
		res.redirect("/campgrounds");
	}
	else{
		res.redirect("/campgrounds/");
	}
});

});


module.exports=router;