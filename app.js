//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const session = require('express-session');
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const { log } = require('console');
const saltRounds = 10;


const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.use(session({
  secret: 'my little secret',
  resave: false,
  saveUninitialized: true,

}));

app.use(passport.initialize());
app.use(passport.session());



 mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
//  mongoose.set("useCreateIndex",true);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enable
  const userSchema=new mongoose.Schema({
    email:String,
    password:String
  });

userSchema.plugin(passportLocalMongoose);

  const User=new mongoose.model("User",userSchema);
  passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",async function(req,res){

    // Store hash in your password DB.
//     try{bcrypt.hash(req.body.password, saltRounds,async function(err, hash) {const username=req.body.username;
//     const password=hash;
//   const foundUser=await User.findOne({email:username});
//   if(foundUser.password === password){
//     res.render("secrets");
//   }
// });
//   }
// try{
//   const username=req.body.username;
//   const password=req.body.password;
//   const foundUser=await User.findOne({email:username});
//   if(foundUser){
//     bcrypt.compare(password,foundUser.password,function(err,result){
// if(result===true)
// res.render("secrets");
//     })
//   }

// }
//   catch(error){
//     console.log(error);
//   }


const user=new User({username:req.body.username,
  password:req.body.passport
});

req.login(user,function(err){
  if(err){
    console.log(err);
  }
  else{
    passport.authenticate("local")(req,res,function(){
      res.redirect("/secrets");
    });
  }
})
});
app.get("/register",function(req,res){

  res.render("register");
});

app.get("/secrets",function(req,res){
if(req.isAuthenticated()){
  res.render("secrets");
}
else{
  res.redirect("/login");
}
});

// app.get("/logout",function(req,res){
//   res.logout();
//   res.redirect("/");
// });

app.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
app.post("/register",function(req,res){
  // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  //   // Store hash in your password DB.
  //   const newUser=new User({
  //     email:req.body.username,
  //     password:hash
  //   });
  //   newUser.save();
  //   res.render("secrets");

  User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  })

});
app.get("/secrets",function(req,res){
  res.render("secrets");
});
app.get("/submit",function(req,res){
  res.render("submit");
});

app.listen(3000,function(){
  console.log("server started on port 3000");
});
