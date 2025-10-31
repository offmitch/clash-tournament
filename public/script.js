document.getElementById("playerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const supercellId = document.getElementById("supercellId").value.trim();
  const trophies = parseInt(document.getElementById("trophies").value);
  const discordName = document.getElementById("discordName").value.trim();

  if (!username || !supercellId || isNaN(trophies)) {
    document.getElementById("result").innerText = "Please fill out all required fields.";
    return;
  }

  try {
    console.log("➡️ Sending POST /addPlayer...");
    const res = await fetch("/addPlayer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, supercellId, trophies, discordName }),
    });

    console.log("⬅️ Response:", res.status, res.statusText);

    if (!res.ok) {
      const text = await res.text();
      console.warn("Non-OK response:", text);
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    if (data.success) {
      document.getElementById("result").innerHTML = `
        <p>✅ Thanks for submitting your info, ${username}!</p>
      `;
    } else {
      document.getElementById("result").innerText = data.error || "Error adding player.";
    }
  } catch (err) {
    console.error("❌ Error submitting form:", err);
    document.getElementById("result").innerText = "Submission failed. Please try again.";
  }
});
