document.getElementById("playerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const supercellId = document.getElementById("supercellId").value.trim();
  const trophies = parseInt(document.getElementById("trophies").value);
  const discordName = document.getElementById("discordName").value.trim();

  if (!username || !supercellId || isNaN(trophies)) {
    alert("Please fill in all required fields.");
    return;
  }

  // Store data temporarily
  sessionStorage.setItem("playerInfo", JSON.stringify({
    username, supercellId, trophies, discordName
  }));

  // Redirect to confirmation page
  window.location.href = "confirm.html";
});
