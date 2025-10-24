const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const app = express();

app.use(cookieParser());

const user = require('./routes/user');
const post = require('./routes/post')

app.listen(3000,()=>{
    console.log("Server started on port 3000");
})
app.get('/cookie',(req,res)=>{
    res.cookie("greet","hello world");
    res.cookie("madeIN","India");
    res.send("cookies has been set");
})

//post routes
app.use('/post',post);



//user routes
app.use('/user',user);