const scriptURL = "https://script.google.com/macros/s/AKfycbw238iwX4a23VhuXvPowDiZAwJn_HcHxF5kCgCu8inHrUZ2jRK_RmmloU7zbH8_j9eg/exec";
let round = 1;

document.getElementById("roundSelector").addEventListener("change", (e) => {
  round = parseInt(e.target.value);
  console.log("Round sélectionné : ", round); // Log pour vérifier que le round est changé
  fetchData();  // On recharge les données lorsque le round change
});

function fetchData() {
  fetch(scriptURL)
    .then((res) => res.json())
    .then((data) => {
      console.log("Données reçues :", data);
      renderLeaderboard(data); // cette fonction affiche les données
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données :", error);
    });
}

function renderLeaderboard(data) {
  const container = document.getElementById("leaderboard");
  container.innerHTML = "";  // Efface le contenu précédent

  if (!data || data.length === 0) {
    console.log("Aucune donnée à afficher");
    container.innerHTML = "<p>Aucune donnée trouvée.</p>";
    return;
  }

  let teams = {};
  data.forEach((player) => {
    const name = player.player;
    const team = round === 2 ? teamAssignments[2][name] || "Unassigned" : player.team;
    if (!teams[team]) teams[team] = [];
    teams[team].push(player);
  });

  let teamAverages = [];
  for (let team in teams) {
    const players = teams[team];
    const total = players.reduce((sum, p) => sum + Number(p.score), 0);
    const avg = total / players.length;
    teamAverages.push({ team, avg });
  }

  teamAverages.sort((a, b) => b.avg - a.avg);

  teamAverages.forEach(({ team, avg }) => {
    const teamDiv = document.createElement("div");
    teamDiv.className = "team";
    teamDiv.innerHTML = `<h2>${team} - ${avg.toFixed(1)} pts</h2>`;

    teams[team].forEach((player) => {
      const playerDiv = document.createElement("div");
      playerDiv.className = "player";
      playerDiv.innerHTML = `
        <span>${player.player} — ${player.score}</span>
        <div class="buttons">
          <button onclick="updateScore('${player.player}', 1)">+1</button>
          <button onclick="updateScore('${player.player}', 5)">+5</button>
          <button onclick="updateScore('${player.player}', -1)">-1</button>
        </div>
      `;
      teamDiv.appendChild(playerDiv);
    });

    container.appendChild(teamDiv);
  });
}

function updateScore(player, delta) {
  console.log(`Mise à jour du score pour ${player} avec delta: ${delta}`);

  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, delta })
  })
  .then((res) => res.json())
  .then((data) => {
    console.log("Réponse du serveur :", data);
    fetchData();
  })
  .catch((error) => {
    console.error("Erreur lors de la mise à jour du score :", error);
  });
}

fetchData();  // Charger les données initialement au chargement de la page
