const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // provided by Render
  ssl: { rejectUnauthorized: false } // required for Render PostgreSQL
});

// Initialize database
(async () => {
  const client = await pool.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      supercellId TEXT NOT NULL,
      trophies INTEGER NOT NULL
    );
  `);
  client.release();
  console.log("Database initialized");
})();

// Add player
app.post("/api/addPlayer", async (req, res) => {
  const { username, supercellId, trophies } = req.body;

  if (!username || !supercellId || trophies === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await pool.query(
      "INSERT INTO players (username, supercellId, trophies) VALUES ($1, $2, $3)",
      [username, supercellId, trophies]
    );

    res.json({
      success: true,
      discordLink: "https://discord.gg/GCmXsdQK"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all players
app.get("/api/players", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM players ORDER BY trophies DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
