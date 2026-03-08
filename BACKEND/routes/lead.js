console.log("LEAD ROUTES LOADED");

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const csvParser = require("csv-parser");
const { Readable } = require("stream");

const Lead = require("../models/Lead");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage()
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_STATUSES = new Set(["new", "in_progress", "closed", "lost"]);
const ALLOWED_PRIORITIES = new Set(["low", "medium", "high", "urgent"]);
const VALID_STAGES = new Set([
  "new",
  "contacted",
  "qualified",
  "proposal",
  "closed_won",
  "closed_lost"
]);

const parseCsvRows = buffer =>
  new Promise((resolve, reject) => {
    const rows = [];

    Readable.from([buffer])
      .pipe(csvParser())
      .on("data", row => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });

const normalizeCell = value =>
  typeof value === "string" ? value.trim() : "";

const normalizeEmail = value => normalizeCell(value).toLowerCase();

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
    const currentUser = await User.findById(req.user.id).select("companyId");
    const userCompanyId = currentUser ? currentUser.companyId : undefined;

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
      companyId: userCompanyId,
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

router.post(
  "/bulk-upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({
          imported: 0,
          skipped: 0,
          errors: ["CSV file is required"]
        });
      }

      const currentUser = await User.findById(req.user.id).select("companyId");
      const userCompanyId = currentUser ? currentUser.companyId : undefined;

      if (!userCompanyId) {
        return res.status(400).json({
          imported: 0,
          skipped: 0,
          errors: ["User is not linked to a company"]
        });
      }

      const rows = await parseCsvRows(req.file.buffer);

      if (!rows.length) {
        return res.json({
          imported: 0,
          skipped: 0,
          errors: []
        });
      }

      const rowEmails = new Set();
      const validLeads = [];
      const errors = [];
      let skipped = 0;

      const uniqueEmails = [
        ...new Set(
          rows
            .map(row => normalizeEmail(row.email))
            .filter(Boolean)
        )
      ];

      const existingLeads = await Lead.find({
        companyId: userCompanyId,
        email: { $in: uniqueEmails }
      }).select("email");

      const existingEmailSet = new Set(
        existingLeads
          .map(lead => normalizeEmail(lead.email))
          .filter(Boolean)
      );

      for (const row of rows) {
        const name = normalizeCell(row.name);
        const email = normalizeEmail(row.email);
        const phone = normalizeCell(row.phone);
        const status = normalizeCell(row.status);
        const priority = normalizeCell(row.priority);
        const followUpDate = normalizeCell(row.followUpDate);
        const parsedValue = Number(normalizeCell(row.value));
        const parsedFollowUpDate = followUpDate ? new Date(followUpDate) : null;

        if (!name) {
          skipped += 1;
          errors.push("missing name");
          continue;
        }

        if (!EMAIL_REGEX.test(email)) {
          skipped += 1;
          errors.push(`invalid email ${email || "(empty)"}`);
          continue;
        }

        if (rowEmails.has(email) || existingEmailSet.has(email)) {
          skipped += 1;
          errors.push(`duplicate email ${email}`);
          continue;
        }

        rowEmails.add(email);

        validLeads.push({
          name,
          email,
          phone,
          status: ALLOWED_STATUSES.has(status) ? status : "new",
          priority: ALLOWED_PRIORITIES.has(priority) ? priority : "medium",
          value: Number.isFinite(parsedValue) ? parsedValue : 0,
          followUpDate:
            parsedFollowUpDate &&
            !Number.isNaN(parsedFollowUpDate.getTime())
              ? parsedFollowUpDate
              : null,
          assignedTo:
            req.user.role === "executive"
              ? req.user.id
              : req.body.assignedTo || null,
          companyId: userCompanyId,
          activities: [
            {
              type: "system",
              content: "Lead imported via CSV",
              user: req.user.name || "System"
            }
          ]
        });
      }

      if (!validLeads.length) {
        return res.json({
          imported: 0,
          skipped,
          errors
        });
      }

      const insertedLeads = await Lead.insertMany(validLeads);

      res.json({
        imported: insertedLeads.length,
        skipped,
        errors
      });
    } catch (error) {
      res.status(500).json({
        imported: 0,
        skipped: 0,
        errors: [error.message]
      });
    }
  }
);


/*
GET LEADS
Admin → all
Executive → only theirs
*/
router.get("/", authMiddleware, async (req, res) => {

  try {

    let leads;
    const currentUser = await User.findById(req.user.id).select("companyId");
    const userCompanyId = currentUser ? currentUser.companyId : undefined;
    const companyFilter = {
      companyId: userCompanyId
    };

    if (req.user.role === "admin") {

      leads = await Lead.find(companyFilter)
        .populate("assignedTo", "name email");

    } else {

      leads = await Lead.find({
        assignedTo: new mongoose.Types.ObjectId(req.user.id),
        ...companyFilter
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

router.put("/:id/contacted", authMiddleware, async (req, res) => {

  try {

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (
      req.user.role !== "admin" &&
      lead.assignedTo &&
      lead.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!lead.followUpDate) {
      await lead.populate("assignedTo", "name email");
      return res.json({
        message: "Lead already contacted",
        lead
      });
    }

    const user = await User.findById(req.user.id).select("name");

    lead.followUpDate = null;
    lead.stage = "contacted";
    lead.activities = Array.isArray(lead.activities) ? lead.activities : [];
    lead.activities.push({
      type: "system",
      content: "Lead contacted",
      user: user?.name || "System"
    });

    await lead.save();
    await lead.populate("assignedTo", "name email");

    res.json({
      message: "Lead marked as contacted",
      lead
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

router.put("/:id/stage", authMiddleware, async (req, res) => {

  try {

    const { stage } = req.body;

    if (!VALID_STAGES.has(stage)) {
      return res.status(400).json({ message: "Invalid stage" });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (
      req.user.role !== "admin" &&
      lead.assignedTo &&
      lead.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.user.id).select("name");

    lead.stage = stage;

    if (stage === "contacted") {
      lead.followUpDate = null;
    }

    lead.activities = Array.isArray(lead.activities) ? lead.activities : [];
    lead.activities.push({
      type: "system",
      content: `Lead moved to ${stage}`,
      user: user?.name || "System"
    });

    await lead.save();
    await lead.populate("assignedTo", "name email");

    res.json(lead);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});


module.exports = router;
