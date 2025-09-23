const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.listen(8080,()=>{
    console.log("Server is running on port 8080");
})
app.use(express.static(path.join(__dirname,'public')));

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
    res.send("Hi I am root")
})
main().catch(err => console.log(err));
main().then(()=>{
    console.log("DATA BASE CONNECT HO GAYA BHAI!!")
}).catch((err)=>{
    console.log("ISKIMAA KA  :",err);
})
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
app.get("/listings", async (req,res)=>{
    const allListing = await Listing.find({})
    res.render("listing/index.ejs",{allListing})
})

app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
})

app.post("/listings" ,async(req,res)=>{
    console.log(req.body);
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(('/listings'))
})
//edit route
app.get('/listings/:id/edit', async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
})
//update route
app.put('/listings/:id',async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)
})
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    console.log(deleted);
})
app.get("/listings/:id", async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/show.ejs",{listing});
}) 