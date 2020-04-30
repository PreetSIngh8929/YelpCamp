var middlewareObj={};

var campgrounds=require("../models/campground.js");
var Comment=require("../models/comment.js");
middlewareObj.chechCGOwnership=function(req,res,next){
	if(req.isAuthenticated()){
	   campgrounds.findById(req.params.id,function(err,foundCampground){
		   // || ! foundCampground is imp to prevent breaking down of aur app if obj id is chnaged
		if(err || !foundCampground){
			req.flash("error","Campground Not Found");
			res.redirect("back");
		}
		else{
			//does campground belong to the user
			if(foundCampground.author.id.equals(req.user._id)){
			next();
			}
			else{
				req.flash("error","You dont have permission to do that")
				res.redirect("back");
			}
		}
		   });
	   }
	   else{
		   req.flash("error","You need to login first to do that!")
	   res.redirect("back");
	   }

}
middlewareObj.chechOwnership=function(req,res,next){
	if(req.isAuthenticated()){
	   Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err || !foundComment){
			req.flash("error","Comment Not found");
			res.redirect("back");
		}
		else{
			//does campground belong to the user
			
			if(foundComment.author.id.equals(req.user._id)){
			next();
			}
			else{
				req.flash("error","You dont have permission to do that");
				res.redirect("back");
			}
		}
		   });
	   }
	   else{
	   req.flash("error","You need to login first to do that!")
	   res.redirect("back");
	   }
}
middlewareObj.isLoggedIn=function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to login first to do that!")
	res.redirect("/login");
}

module.exports=middlewareObj;