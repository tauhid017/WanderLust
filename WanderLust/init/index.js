const mongoose = require("mongoose");
const indata = require("./data.js")
const Listing = require("../models/listing.js");
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
async function main() {
  await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("DATA BASE CONNECT HO GAYA BHAI!!")
}).catch((err)=>{
    console.log("ISKIMAA KA :",err);
})


const initdata=async()=>{
    await Listing.deleteMany({});
    indata.data = indata.data.map((obj)=>({
        ...obj,
        owner: "69380a39e1cd1b9846aa9495"  
    }));
    await Listing.insertMany(indata.data);
    console.log("Data has been initialized successfully!");
}
initdata();