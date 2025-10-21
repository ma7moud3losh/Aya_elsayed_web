import cors from "cors";
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const helmet = require('helmet');


app.use(helmet());
app.use(cors());
app.use(express.json());

// connect db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// routes
app.use('/api', apiRoutes);

// serve frontend build if you choose to build and serve static from backend
// app.use(express.static('../frontend'));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});
import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve frontend

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

// Example API
app.post("/api/order", async (req, res) => {
  try {
    const { name, phone, address, order } = req.body;
    // هنا بتحفظ البيانات في قاعدة البيانات (Model)
    res.json({ success: true, message: "تم استلام الطلب بنجاح ❤️" });
  } catch (err) {
    res.status(500).json({ success: false, message: "حدث خطأ ما" });
  }
});

// Serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


