const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE TASK (Admin Only)
router.post("/create", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    const newTask = new Task({
      title,
      description,
      assignedTo,
      dueDate
    });

    await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: newTask
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET TASKS (Role Based)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedTo", "name email");
    } else {
      tasks = await Task.find({ assignedTo: req.user.id })
                        .populate("assignedTo", "name email");
    }

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// MARK TASK COMPLETE
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    task.status = "completed";
    await task.save();

    res.json({ message: "Task marked as completed", task });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;