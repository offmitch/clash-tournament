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
      `<p>Submission successful!</p>
       <a href="${data.discordLink}" target="_blank">Join Discord</a>`;
  } else {
    document.getElementById("result").innerText = data.error || "Error submitting data";
  }
});
