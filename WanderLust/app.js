const express = require("express");
const app = express();
const mongoose = require("mongoose");
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