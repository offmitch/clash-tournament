document.getElementById("playerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const supercellId = document.getElementById("supercellId").value;
  const trophies = parseInt(document.getElementById("trophies").value);
  const discordName = document.getElementById("discordName").value;

  const res = await fetch("/api/addPlayer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, supercellId, trophies, discordName })
  });

  const data = await res.json();
  if (data.success) {
    document.getElementById("result").innerHTML = 
      ` <img src="discord.jpg" class="discord-logo" alt="Discord Logo">
  <p>Thanks for submitting your info!</p>
  <a href="https://discord.gg/your-server" target="_blank">Join the Discord for Updates</a>
  `;
  } else {
    document.getElementById("result").innerText = data.error || "Error submitting data";
  }
});
