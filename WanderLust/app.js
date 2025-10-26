const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

// ---------------- MIDDLEWARE SETUP ----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ---------------- DATABASE CONNECTION ----------------
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("DATABASE CONNECT HO GAYA HAI BHAI"))
  .catch((err) => console.log("ISKI MAA KA:", err));

// ---------------- SESSION + FLASH SETUP ----------------
const sessionOptions = {
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(cookieParser("supersecretkey")); // Move before session
app.use(session(sessionOptions));
app.use(flash());

// Make flash messages globally available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ---------------- ROUTES ----------------
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Use your routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// ---------------- ERROR HANDLING ----------------
// app.all("*", (req, res, next) => {
//   next(new ExpressError("Page Not Found", 404));
// });

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

// ---------------- START SERVER ----------------
app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});

module.exports = app;
