const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
})
app.get("/",(req,res)=>{
    res.send("Hi I am root")
})
main().catch(err => console.log(err));

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
async function main() {
  await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("DATA BASE CONNECT HO GAYA BHAI!!")
}).catch((err)=>{
    console.log("ISKIMAA KA KUCH :",err);
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

app.get("/listings/:id", async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/show.ejs",{listing});
})