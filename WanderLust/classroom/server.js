const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require('connect-flash');

const session = require('express-session');
app.use(session({secret:"supersecretkey",
    resave:false,
    saveUninitialized:true

}));
app.use(cookieParser("secretcode")); // Must be before routes
app.use(flash());
// Import routes
// const user = require('./routes/user');
// const post = require('./routes/post');

// // Set multiple cookies
// app.get('/cookie', (req, res) => {
//     res.cookie("greet", "hello world");
//     res.cookie("madeIN", "India");
//     res.cookie("madAt", "Jishu");
//     res.send("Cookies have been set");
// });
// app.get('/greet',(req,res)=>{
//     let {name = "Ronaldo"} = req.cookies;
//     res.send(`Hello ,Good Morning ${name}`);
// })
// app.get('/getsignedcookie',(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("Signed cookie sent");
// })

// // Read cookies
// app.get('/root', (req, res) => {
//     console.log(req.cookies); // Log cookies first
//     res.send("Cookies have been sent");
// });

// // Use routes
// app.use('/post', post);
// app.use('/user', user);

// app.get('/test',(req,res)=>{
//     res.send("Test route working");
// })

// app.get('/reqcount',(req,res)=>{
//     if(req.session.x){
//         req.session.x++;
//     }
//     else{
//         req.session.x =1;
//     }
//     res.send(`You have made ${req.session.x} requests`);
// })



app.get('/register',(req,res)=>{
    let {name = "ronaldo"} = req.query;
    req.flash("success","User registered successfully");
    req.session.name = name;
    res.redirect('/hello');
})

app.get('/hello',(req,res)=>{
    // res.send(`HELLO ${req.session.name}`);
    res.locals.msg = req.flash("success");
    res.render("1.ejs",{name:req.session.name});
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
app.get('/showsigned',(req,res)=>{
    console.log(req.cookies);   
    console.log(req.signedCookies);
    res.send("Signed cookies logged");
})
