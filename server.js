const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  const client = await pool.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      supercellId TEXT NOT NULL,
      trophies INTEGER NOT NULL,
      discord_name TEXT
    );
  `);
  client.release();
  console.log("Database ready");
})();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Add player
app.post("/api/addPlayer", async (req, res) => {
  const { username, supercellId, trophies, discordName } = req.body;
  if (!username || !supercellId || trophies === undefined)
    return res.status(400).json({ error: "Missing fields" });

  try {
    await pool.query(
      "INSERT INTO players (username, supercellId, trophies, discord_name) VALUES ($1, $2, $3, $4)",
      [username, supercellId, trophies, discordName]
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
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update player info
app.put("/api/player/:id", async (req, res) => {
  const { password, username, supercellId, trophies, discordName } = req.body;
  const { id } = req.params;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "Unauthorized" });

  try {
    await pool.query(
      "UPDATE players SET username=$1, supercellId=$2, trophies=$3, discord_name=$4 WHERE id=$5",
      [username, supercellId, trophies, discordName, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
