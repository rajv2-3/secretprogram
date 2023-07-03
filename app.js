//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

 mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enable
  const userSchema=new mongoose.Schema({
    email:String,
    password:String
  });


userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ["password"] });
  const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.post("/login",async function(req,res){
  try{const username=req.body.username;
  const password=req.body.password;
const foundUser=await User.findOne({email:username});
if(foundUser.password === password){
  res.render("secrets");
}

}
catch(error){
  console.log(error);
}

});
app.get("/register",function(req,res){

  res.render("register");
});
app.post("/register",function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save();
  res.render("secrets");
})
app.get("/secrets",function(req,res){
  res.render("secrets");
});
app.get("/submit",function(req,res){
  res.render("submit");
});

app.listen(3000,function(){
  console.log("server started on port 3000");
});
