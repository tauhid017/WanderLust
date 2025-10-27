const express = require('express');
const user = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const router = express.Router();

router.get('/signup',(req,res)=>{
    res.render('users/signup.ejs')
})

router.post('/signup', wrapAsync(async (req,res)=>{
    try{
        let{username,password,email}=req.body;
    const newUser = new user({username,email});
    const registeredUser = await user.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","Welcome to WanderLust");
    res.redirect('/listings');
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');
    }
}));



router.get('/login',(req,res)=>{
    res.render('users/login.ejs')
})

router.post('/login',
    passport.authenticate("local",{failureRedirect: '/login',failureFlash:true}), 
    wrapAsync(async(req,res)=>{
        req.flash("success","Welcome Back!");
        res.redirect('/listings');
    })
)

module.exports=router;