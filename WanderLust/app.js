const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressErrors");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid Data for Listing");
    }
    let newListing = new Listing(req.body.listing);
    if(!req.body.listing.description){
        throw new ExpressError(400, "Description cannot be empty");
    }
    if(!req.body.listing.title){
        throw new ExpressError(400, "Title cannot be empty");
    }
    if(!req.body.listing.price){
        throw new ExpressError(400, "Price cannot be empty");
    }
    
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
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid Data for Listing");
    }
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
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
  })
);
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.render("error.ejs",{statusCode,message});
//   res.status(statusCode).send(message);
});
