const express = require('express');
const router = express.Router();
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
router.get("/new", (req, res) => {
    res.render("listing/new.ejs");
});

// Edit route - MUST come BEFORE /:id
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));

// Show route - MUST come AFTER /new and /:id/edit
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
}));

// Create route
router.post("/", listingvalidation, wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Update route
router.put("/:id", listingvalidation, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// Delete listing route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
}));

module.exports = router;