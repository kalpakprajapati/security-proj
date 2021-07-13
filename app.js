//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const parser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 8;

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(parser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    await newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets")
      }
    });

  });

});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {

        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("secrets");
          } else {
            res.send("enter correct password");
          }
        });

      } else {
        res.send("No user found");
      }
    }
  });
});


app.listen(3000, function() {
  console.log("Server started at port 3000");
});
