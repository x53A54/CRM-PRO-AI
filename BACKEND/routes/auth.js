const roleMiddleware = require("../middleware/roleMiddleware");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

console.log("AUTH ROUTES LOADED");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {

  console.log("REGISTER HIT");

  try {

    const { name, email, password, role } = req.body;

    console.log("DATA RECEIVED:", name, email, password, role);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("USER ALREADY EXISTS");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    console.log("USER SAVED SUCCESSFULLY");

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {

    console.log("REGISTER CRASHED");
    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});

// LOGIN
// LOGIN
router.post("/login", async (req, res) => {

  console.log("LOGIN HIT");

  try {

    const { email, password } = req.body;
    console.log("EMAIL:", email);

    const user = await User.findOne({ email });
    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    console.log("TOKEN CREATED");

    res.json({
      token,
      role: user.role,
      message: "Login successful"
    });

  } catch (error) {

    console.log("LOGIN CRASHED");
    console.error(error);

    res.status(500).json({ error: error.message });
  }

});

// PROTECTED ROUTE
router.get("/profile", authMiddleware, async (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

// ADMIN ONLY ROUTE
router.get(
  "/admin-data",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({
      message: "Welcome Admin. Sensitive data accessed."
    });
  }
);

module.exports = router;