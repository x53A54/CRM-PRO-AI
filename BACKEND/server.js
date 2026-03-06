const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const leadRoutes = require("./routes/lead");

const app = express();

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

/* ROUTES */

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

/* TEST ROUTE */

app.get("/", (req, res) => {
  res.send("Backend working");
});

/* DATABASE */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* SERVER */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});