const express = require("express");
const router = express.Router();
const path = require("path");

// Home
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/register.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

router.get("/staff", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/staffdash.html"));
});

router.get("/volunteer", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/volDash.html"));
});

// PWD Dashboard
router.get("/pwd", (req, res) => {
  res.render("pwd");
});

// Profile
router.get("/profile", (req, res) => {
  res.render("profile");
});

// Employer Dashboard
const Employer = require("../models/employers");

router.get("/employer", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const profile = await Employer.findOne({
      userId: req.session.userId
    });

    res.render("employerdash", {
      showPushbar: !profile
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading dashboard");
  }
});

router.get("/chart", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/empdash.html"));
});

router.get("/directory", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/empCanDir.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/About.html"));
});

router.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/contact.html"));
});

router.get("/dis", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/dis.html"));
});



module.exports = router;