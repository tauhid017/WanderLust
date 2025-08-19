const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image: {
    filename: { type: String, default: "listingimage" },
    url: {
        type: String,
        default: "https://unsplash.com/photos/sunloungers-fronting-buildings-near-mountain-DGa0LQ0yDPc",
        set: v => v === "" ? "https://unsplash.com/photos/sunloungers-fronting-buildings-near-mountain-DGa0LQ0yDPc" : v
    }
},
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;