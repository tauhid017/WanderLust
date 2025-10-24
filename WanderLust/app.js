const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors");
const listings = require('./routes/listings.js');
const reviews = require('./routes/reviews.js');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("DATA BASE CONNECT HO GAYA BHAI!!");
  })
  .catch((err) => {
    console.log("ISKIMAA KA  :", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Hi I am root");
});

// app.get("/admin", (req, res) => {
//   throw new ExpressError(403, "this is an admin error");
// });

app.use('/listings', listings);  // Your listings router
app.use('/listings/:id/reviews', reviews);  // Your reviews router
// catch-all 404 -> use '*' not a regex
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});


// Error handler - MUST be last
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.render("error.ejs", { statusCode, message });
});

// Start server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

module.exports = app;