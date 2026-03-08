const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const Company = require("../models/Company");
const User = require("../models/User");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.user.id).select("companyId");

    if (!user || !user.companyId) {
      return res.status(404).json({ message: "Company not found" });
    }

    const company = await Company.findById(user.companyId).select("name code");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({
      name: company.name,
      code: company.code
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
