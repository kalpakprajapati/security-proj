//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const parser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(parser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true, useUnifiedTopology: true  });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.post("/register",async function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

await  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets")
    }
  });
});

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }else{
          res.send("enter correct password");
        }
      }else{
        res.send("No user found");
      }
    }
  });
});


app.listen(3000, function(){
  console.log("Server started at port 3000");
});
