const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  type: {
    type: String
  },
  content: {
    type: String
  },
  user: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String
    },

    phone: {
      type: String
    },

    status: {
      type: String,
      enum: ["new", "in_progress", "closed", "lost"],
      default: "new"
    },

    value: {
      type: Number,
      default: 0
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },

    followUpDate: {
      type: Date
    },

    activities: [activitySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);