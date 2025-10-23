const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressErrors");
const { resourceUsage } = require("process");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
let{listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");

app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
app.use(express.static(path.join(__dirname, "public")));
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}



const listingvalidation =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
            throw new ExpressError(400,error);
        }
        else{
            next();
        }
}


const validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
            throw new ExpressError(400,error);
        }
        else{
            next();
        }
}


app.get("/", (req, res) => {
  res.send("Hi I am root");
});
app.get("/admin", (req, res) => {
  throw new ExpressError("this is an admin error", 403);
});
main().catch((err) => console.log(err));
main()
  .then(() => {
    console.log("DATA BASE CONNECT HO GAYA BHAI!!");
  })
  .catch((err) => {
    console.log("ISKIMAA KA  :", err);
  });
// app.get('/testlisting',async(req,res)=>{
//     let smaplelisint = new Listing({
//         title:"my new villa",
//         description:"this is a new villa",
//         price:1200,
//         location:"Goa",
//         country:"India",
//     })
//     await smaplelisint.save().then(()=>{
//         console.log("sample was saved");
//         res.send("successfull!!!")
//     }).catch((err)=>{
//         console.log("sample was not saved");
//         res.send("failed!!!")
//     })
// })
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  })
);

app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

app.post(
  "/listings",
  listingvalidation,
  wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);
//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  })
);
//update route
app.put(
  "/listings/:id",
  listingvalidation,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    console.log(deleted);
  })
);

//reviews



app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
  })
);
app.post('/listings/:id/reviews', validateReview ,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review added");
    
    res.redirect(`/listings/${listing._id}`);

}));



//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.render("error.ejs",{statusCode,message});
});
