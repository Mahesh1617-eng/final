const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= STATIC FILES =================
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ================= DATABASE =================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

// Test DB connection (VERY IMPORTANT)
pool.connect()
  .then(() => console.log("✅ Connected to DB"))
  .catch(err => console.error("❌ DB connection error:", err.message));

// ================= ROUTES =================

// Root → serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Contact API
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("Received:", req.body);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO contact_form (name, email, message) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [name, email, message]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error("❌ DB ERROR FULL:", err);

    res.status(500).json({
      success: false,
      error: err.message   // show real error for debugging
    });
  }
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});