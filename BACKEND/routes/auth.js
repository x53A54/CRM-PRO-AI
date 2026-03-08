const roleMiddleware = require("../middleware/roleMiddleware");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

console.log("AUTH ROUTES LOADED");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {

  console.log("REGISTER HIT");

  let createdCompany = null;

  try {

    const { name, email, password, role, companyName, companyCode } = req.body;

    console.log("DATA RECEIVED:", name, email, password, role);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("USER ALREADY EXISTS");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let resolvedCompanyId;
    let createdCompanyCode;
    let message = "User registered successfully";

    if (role === "admin") {
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }

      let generatedCode = Company.generateCompanyCode(companyName);

      while (await Company.findOne({ code: generatedCode })) {
        generatedCode = Company.generateCompanyCode(companyName);
      }

      const company = new Company({
        name: companyName,
        code: generatedCode
      });

      await company.save();

      createdCompany = company;
      resolvedCompanyId = company._id;
      createdCompanyCode = company.code;
      message = "Admin registered successfully";
    }

    if (role === "executive") {
      if (!companyCode) {
        return res.status(400).json({ message: "Invalid company code" });
      }

      const company = await Company.findOne({
        code: companyCode.toUpperCase().trim()
      });

      if (!company) {
        return res.status(400).json({ message: "Invalid company code" });
      }

      resolvedCompanyId = company._id;
      message = "Executive registered successfully";
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      companyId: resolvedCompanyId
    });

    await newUser.save();

    console.log("USER SAVED SUCCESSFULLY");

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message,
      token,
      role: newUser.role,
      name: newUser.name,
      ...(createdCompanyCode ? { companyCode: createdCompanyCode } : {})
    });

  } catch (error) {

    console.log("REGISTER CRASHED");
    console.error(error);

    if (createdCompany) {
      try {
        await Company.findByIdAndDelete(createdCompany._id);
      } catch (cleanupError) {
        console.error("COMPANY CLEANUP FAILED", cleanupError);
      }
    }

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
      name: user.name,
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
