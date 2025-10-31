window.addEventListener("DOMContentLoaded", () => {
  const info = JSON.parse(sessionStorage.getItem("playerInfo") || "{}");

  if (!info.username) {
    alert("No player information found.");
    window.location.href = "index.html";
    return;
  }

  // Fill form fields
  document.getElementById("confirmUsername").value = info.username;
  document.getElementById("confirmSupercellId").value = info.supercellId;
  document.getElementById("confirmTrophies").value = info.trophies;
  document.getElementById("confirmDiscord").value = info.discordName;
});

// Save to DB
document.getElementById("confirmForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("confirmUsername").value.trim();
  const supercellId = document.getElementById("confirmSupercellId").value.trim();
  const trophies = parseInt(document.getElementById("confirmTrophies").value);
  const discordName = document.getElementById("confirmDiscord").value.trim();

  try {
    const res = await fetch("/addPlayer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, supercellId, trophies, discordName }),
    });

    if (!res.ok) throw new Error("Server error");
    const data = await res.json();

    if (data.success) {
      document.getElementById("saveResult").innerHTML = `
        <p>✅ Saved successfully! Thank you, ${username}.</p>
        <a href="index.html">Return Home</a>
      `;
      sessionStorage.removeItem("playerInfo");
    } else {
      document.getElementById("saveResult").innerText = data.error || "Error saving info.";
    }
  } catch (err) {
    document.getElementById("saveResult").innerText = "Failed to save data. Try again.";
    console.error(err);
  }
});
