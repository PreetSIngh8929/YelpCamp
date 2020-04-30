var express=require("express");
var router =express.Router({mergeParams:true});
var campgrounds=require("../models/campground.js");
var Comment=require("../models/comment.js");
var middleware=require("../middleware");
router.get("/new",middleware.isLoggedIn,function(req,res){
	campgrounds.findById(req.params.id,function(err,campground){
		
		if(err || !campground){
			 req.flash("error","Campground not found");
			res.redirect("back");
		 }
		
		else{
			res.render("comments/new.ejs",{campgrounds:campground});
		 }	
	});
});


router.post("/",middleware.isLoggedIn,function(req,res){
	campgrounds.findById(req.params.id,function(err,campground){
		
		if(err){
			 console.log("error");
			 res.redirect("/campgrounds");
		 }
		
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something Went Wrong")
					console.log(err);
				}
				else{
					// add username and id to comments
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					//save comments
					comment.save();
					
					campground.comments.push(comment);
					campground.save();
					req.flash("success","successfully added comment")
					res.redirect("/campgrounds/" + campground._id);
					
				}
			});
		 }	
	});
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.chechOwnership, function(req, res){
	campgrounds.findById(req.params.id,function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","campground not found");
			return res.redirect("back");
		}
	});
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit.ejs", {campgrounds_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id",middleware.chechOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});
//delete
router.delete("/:comment_id",middleware.chechOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
	if(err){
		res.redirect("back");
	}
	else{
		req.flash("success","Comment deleted")
		res.redirect("/campgrounds/"+ req.params.id);
	}
});

});

module.exports=router;