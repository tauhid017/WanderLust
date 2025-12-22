const express = require('express');
const router = express.Router();
const { isLoggedIn } = require("../middleware");

let{listingSchema,reviewSchema}=require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressErrors.js");

const listingvalidation =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
            throw new ExpressError(400,error);
        }
        else{
            next();
        }
}



// Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
}));

// New route - MUST come BEFORE /:id
router.get("/new", isLoggedIn,(req, res) => {
    console.log(req.user);
    
    res.render("listing/new.ejs");
});

// Edit route - MUST come BEFORE /:id
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing });
}));

// Show route - MUST come AFTER /new and /:id/edit
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listing/show.ejs", { listing });
}));

// Create route
router.post("/",isLoggedIn, listingvalidation, wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}));

// Update route
router.put("/:id", isLoggedIn,listingvalidation, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));

// Delete listing route
router.delete("/:id", isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    console.log(deleted);
    res.redirect("/listings");
}));

module.exports = router;