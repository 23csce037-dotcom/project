const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Employer = require("../models/employers");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { username, password, cpassword, role } = req.body;

    const allowedDomains = ["@gmail.com", "@edu.in"];
    const isAllowed = allowedDomains.some((domain) =>
      username.endsWith(domain)
    );
    if (!isAllowed)
      return res.status(400).send("❌ Invalid email domain");

    if (password !== cpassword)
      return res.status(400).send("❌ Passwords do not match");

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).send("❌ Username already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.send("✅ Registration successful! <a href='/login'>Login</a>");

  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Registration failed");
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).send("❌ Invalid username");

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).send("❌ Invalid password");

    // ✅ STORE SESSION (VERY IMPORTANT)
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.username = user.username;

    const roleRedirects = {
      Volunteer: "/Volunteer",
      Admin: "/admin.html",
      Staff: "/staffdash",
      PWD: "/pwd",
      Employer: "/employer", // 👈 go directly to dashboard
    };

    const redirectUrl = roleRedirects[user.role] || "/";

    res.redirect(redirectUrl);

  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Login failed");
  }
});


// ================== GET PROFILE FORM ==================
router.get("/employer/profile", async (req, res) => {
  try {
    if (!req.session.userId)
      return res.redirect("/login");

    const employer = await Employer.findOne({
      userId: req.session.userId
    });

    res.render("empProfile", { employer });

  } catch (err) {
    console.log(err);
    res.send("Error loading form");
  }
});
// ================== TEST PROFILE VIEW ==================
router.get("/employer/profile-view-test", async (req, res) => {
  try {
    // if (!req.session.userId)
    //   return res.redirect("/login");

    // const employer = await Employer.findOne({
    //   userId: req.session.userId
    // });

    res.json(employer || { message: "No employer profile found" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error loading profile" });
  }
});

// ================== SAVE / UPDATE PROFILE ==================
router.post("/employer/profile", async (req, res) => {
  try {
    await Employer.findOneAndUpdate(
      { userId: req.session.userId },
      req.body,
      { upsert: true, new: true }
    );

    res.redirect("/employer/profile-view");

  } catch (err) {
    console.log("SAVE ERROR:", err);
    res.send("Error saving profile");
  }
});



// ================== PROFILE VIEW ==================
router.get("/employer/profile-view", async (req, res) => {
  try {
    if (!req.session.userId)
      return res.redirect("/login");

    const employer = await Employer.findOne({
      userId: req.session.userId
    });

    if (!employer)
      return res.redirect("/employer/profile");

    res.render("empProfileView", { employer });

  } catch (err) {
    console.error(err);
    res.send("Error loading profile");
  }
});


module.exports = router;