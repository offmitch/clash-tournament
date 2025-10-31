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

// ✅ Setup Aiven MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// ✅ Create table on startup
(async () => {
  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS players (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      supercellId VARCHAR(255) NOT NULL,
      trophies INT NOT NULL,
      discord_name VARCHAR(255)
    );
  `);
  conn.release();
  console.log("✅ MySQL table ready");
})();

// ==========================================================
// 🚀 ROUTES (must come BEFORE static middleware)
// ==========================================================

// Add Player
app.post("/addPlayer", async (req, res) => {
  console.log("➡️ Received POST /addPlayer"); // debug line

  const { username, supercellId, trophies, discordName } = req.body;
  if (!username || !supercellId || trophies === undefined) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await pool.query(
      "INSERT INTO players (username, supercellId, trophies, discord_name) VALUES (?, ?, ?, ?)",
      [username, supercellId, trophies, discordName || null]
    );
    res.json({ success: true, discordLink: "https://discord.gg/GCmXsdQK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// Get all players (admin)
app.post("/api/players", async (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "Unauthorized" });

  try {
    const result = await pool.query("SELECT * FROM players ORDER BY trophies DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete player
app.delete("/api/player/:id", async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "Unauthorized" });

  try {
    await pool.query("DELETE FROM players WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Database error:", err);
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

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
