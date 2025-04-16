const scriptURL = "https://script.google.com/macros/s/AKfycbx2-NvKxphq2dDZhV56ozkO5FpMa5Nozkd4YNXB2T4/dev";
let round = 1;

document.getElementById("roundSelector").addEventListener("change", (e) => {
  round = parseInt(e.target.value);
  console.log("Round sélectionné : ", round); // Log pour vérifier que le round est changé
  fetchData();  // On recharge les données lorsque le round change
});

function fetchData() {
  console.log("Fetching data from Google Apps Script...");  // Log pour vérifier si la requête est lancée
  fetch(scriptURL)
    .then((res) => {
      console.log("Réponse reçue de Google Apps Script, statut : ", res.status);  // Log du statut de la réponse
      return res.json();
    })
    .then((data) => {
      console.log("Données reçues : ", data);  // Log des données pour vérifier leur contenu
      renderLeaderboard(data);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données : ", error);  // Log des erreurs
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
  console.log(`Mise à jour du score pour ${player} avec delta: ${delta}`);  // Log pour vérifier si l'appel est bien effectué

  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, delta })  // Envoi des données au serveur
  })
  .then((response) => {
    console.log("Réponse du serveur :", response.status);  // Log du statut de la réponse
    return response.text();  // On récupère la réponse du serveur sous forme de texte
  })
  .then((data) => {
    console.log("Réponse du serveur après mise à jour : ", data);  // Log de la réponse
    fetchData();  // Recharge les données après mise à jour
  })
  .catch((error) => {
    console.error("Erreur lors de la mise à jour du score : ", error);  // Log des erreurs
  });
}

fetchData();  // Charger les données initialement au chargement de la page
