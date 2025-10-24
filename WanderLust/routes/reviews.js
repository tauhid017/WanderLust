const express = require('express');
const router = express.Router({mergeParams:true});
let{listingSchema,reviewSchema}=require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressErrors.js");


const validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
            let errMsg = error.details.map(el => el.message).join(',');
            throw new ExpressError(errMsg, 400);
        }
        else{
            next();
        }
}

// Create review route - specific path before /:id
router.post('/', validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review added");
    
    res.redirect(`/listings/${listing._id}`);
}));

// Delete review route
router.delete("/:reviewId", wrapAsync(async (req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));



module.exports = router;