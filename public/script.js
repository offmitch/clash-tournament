document.getElementById("playerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const supercellId = document.getElementById("supercellId").value.trim();
  const trophies = parseInt(document.getElementById("trophies").value);
  const discordName = document.getElementById("discordName").value.trim();

  if (!username || !supercellId || isNaN(trophies)) {
    document.getElementById("result").innerText = "Please fill in all required fields.";
    return;
  }

  // ✅ Only check if username exists, do NOT add to DB yet:
  try {
    const res = await fetch("/checkUsername", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });

    const data = await res.json();

    if (data.exists) {
      document.getElementById("result").innerText = "Username already exists. Please choose another one.";
      document.getElementById("result").classList.add("show");
    } else {
      // ✅ Username is unique, move to confirm page with stored data
      sessionStorage.setItem("playerInfo", JSON.stringify({
        username, supercellId, trophies, discordName
      }));
      window.location.href = "confirm.html";
    }
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("result").innerText = "Server error. Please try again.";
  }
});
