/* Fichier script.js */

const scriptURL = "https://script.google.com/macros/s/AKfycbzsqvBtW-Hf1pdfSHqptKge1JQ9Xy1xnvT9-tMfCHCSP2Vz0vaZTa6ZTAVdooyK3W9W/exec";

// Fonction pour récupérer les données et les afficher
function fetchData(type) {
  fetch(`${scriptURL}?type=${type}`)
    .then((res) => res.json())
    .then((data) => renderLeaderboard(data))
    .catch((error) => console.error("Erreur lors de la récupération des données :", error));
}

// Fonction pour afficher le leaderboard
function renderLeaderboard(data) {
  const container = document.getElementById("leaderboard");
  container.innerHTML = "";  // Efface le contenu précédent

  if (data.length === 0) {
    container.innerHTML = "<p>Aucune donnée trouvée.</p>";
    return;
  }

  if (Array.isArray(data[0].players)) {
    // Classement par équipe
    data.forEach((team) => {
      const teamDiv = document.createElement("div");
      teamDiv.className = "team";
      teamDiv.innerHTML = `<h2>${team.team} - ${team.avg.toFixed(1)} pts</h2>`;

      team.players.forEach((player) => {
        const playerDiv = document.createElement("div");
        playerDiv.className = "player";
        playerDiv.innerHTML = `<h3>${player.player}</h3><div class="score">${player.score} pts</div>`;
        teamDiv.appendChild(playerDiv);
      });

      container.appendChild(teamDiv);
    });
  } else {
    // Classement individuel
    data.forEach((player) => {
      const playerDiv = document.createElement("div");
      playerDiv.className = "player";
      playerDiv.innerHTML = `<h3>${player.player}</h3><div class="score">${player.score} pts</div>`;
      container.appendChild(playerDiv);
    });
  }
}

// Charger les données au chargement
document.getElementById("leaderboardType").addEventListener("change", (e) => {
  fetchData(e.target.value);
});

// Initialisation avec le classement par équipe
fetchData("team");
