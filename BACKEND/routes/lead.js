console.log("LEAD ROUTES LOADED");

const express = require("express");
const mongoose = require("mongoose");

const Lead = require("../models/Lead");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
CREATE LEAD
Admin → assign to anyone
Executive → assigned to themselves
*/
router.post("/create", authMiddleware, async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      status,
      value,
      assignedTo,
      priority,
      followUpDate
    } = req.body;

    let leadOwner;

    if (req.user.role === "admin") {
      leadOwner = assignedTo;
    } else {
      leadOwner = req.user.id;
    }

    const newLead = new Lead({
      name,
      email,
      phone,
      status,
      value,
      assignedTo: leadOwner,
      priority: priority || "medium",
      followUpDate: followUpDate || null,
  activities: [
{
type: "system",
content: "Lead created",
user: req.user.name
}
]
    });

    await newLead.save();

    res.status(201).json({
      message: "Lead created successfully",
      lead: newLead
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});


/*
GET LEADS
Admin → all
Executive → only theirs
*/
router.get("/", authMiddleware, async (req, res) => {

  try {

    let leads;

    if (req.user.role === "admin") {

      leads = await Lead.find()
        .populate("assignedTo", "name email");

    } else {

      leads = await Lead.find({
        assignedTo: new mongoose.Types.ObjectId(req.user.id)
      }).populate("assignedTo", "name email");

    }

    res.json(leads);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});


/*
DELETE LEAD
Admin → delete any
Executive → delete only their own
*/
router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (
      req.user.role !== "admin" &&
      lead.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      message: "Lead deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});


module.exports = router;