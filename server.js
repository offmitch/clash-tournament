require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Aiven MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// ✅ Create table on startup, with UNIQUE username constraint
(async () => {
  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS players (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      supercellId VARCHAR(255) NOT NULL,
      trophies INT NOT NULL,
      discord_name VARCHAR(255)
    );
  `);
  conn.release();
  console.log("✅ MySQL table ready");
})();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// ==========================================================
// 🚀 ROUTES (must come BEFORE static middleware)
// ==========================================================

// Add Player (with unique username check)
app.post("/addPlayer", async (req, res) => {
  console.log("➡️ Received POST /addPlayer");

  const { username, supercellId, trophies, discordName } = req.body;

  if (!username || !supercellId || trophies === undefined) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // ✅ Check if username already exists
    const [existingUser] = await pool.query(
      "SELECT id FROM players WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ error: "Username already exists. Please choose another." });
    }

    // ✅ Insert user into the database
    await pool.query(
      "INSERT INTO players (username, supercellId, trophies, discord_name) VALUES (?, ?, ?, ?)",
      [username, supercellId, trophies, discordName || null]
    );

    res.json({
      success: true,
      discordLink: "https://discord.gg/GCmXsdQK",
    });
  } catch (err) {
    console.error("Error adding player:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Check if the username exists
app.post("/checkUsername", async (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    const [rows] = await pool.query(
      "SELECT id FROM players WHERE username = ?",
      [username]
    );

    if (rows.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking username:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Get all players (admin)
app.post("/api/players", async (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD)
    return res.status(403).json({ error: "Unauthorized" });

  try {
    const [rows] = await pool.query(
      "SELECT * FROM players ORDER BY trophies DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete player
app.delete("/api/player/:id", async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  if (password !== ADMIN_PASSWORD)
    return res.status(403).json({ error: "Unauthorized" });

  try {
    const [result] = await pool.query("DELETE FROM players WHERE id = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Player not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting player:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ==========================================================
// ✅ Static must come AFTER routes
// ==========================================================
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
