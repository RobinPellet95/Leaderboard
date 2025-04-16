const scriptURL = "https://script.google.com/macros/s/AKfycbyR_UreqzKlx-isrNdeU6tudcK4x6MeBrowlCp7sSmfQcFveyPAMXRVtDyX99L-pKlo/exec";

let round = 1;

const teamNames = {
  1: {
    "The Sand Traps": "The Sand Traps",
    "The Hole-In-Ones": "The Hole-In-Ones",
    "The Birdie Bunch": "The Birdie Bunch",
    "The Tee Masters": "The Tee Masters"
  },
  2: {
    "Kakariki Rikiki": "Kakariki Rikiki",
    "Whero Myball?": "Whero Myball?"
  }
};

const teamAssignments = {
  2: {
    "Taz": "Kakariki Rikiki",
    "Jeantoine": "Kakariki Rikiki",
    "BigDPierrick": "Kakariki Rikiki",
    "Flo": "Kakariki Rikiki",
    "Yarlav": "Kakariki Rikiki",
    "Larraie": "Kakariki Rikiki",
    "Dustin": "Kakariki Rikiki",
    "Alex": "Whero Myball?",
    "Robinator": "Whero Myball?",
    "Bridou": "Whero Myball?",
    "Yanno": "Whero Myball?",
    "Mingouze": "Whero Myball?",
    "Smet'": "Whero Myball?",
    "Jaquier": "Whero Myball?"
  }
};

document.getElementById("roundSelector").addEventListener("change", (e) => {
  round = parseInt(e.target.value);
  fetchData();  // On recharge les données lorsque le round change
});

function fetchData() {
  console.log("Fetching data from Google Apps Script...");  // Log pour vérifier si la requête est lancée
  fetch(scriptURL)
    .then((res) => res.json())
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
  console.log(`Updating score for ${player} with delta: ${delta}`); // Log pour vérifier si l'appel est effectué

  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, delta })
  })
  .then(() => {
    console.log("Score mis à jour pour " + player);
    fetchData();  // Recharge les données après mise à jour
  })
  .catch((error) => {
    console.error("Erreur lors de la mise à jour du score : ", error);  // Log des erreurs de mise à jour
  });
}

fetchData();  // Charger les données initialement au chargement de la page
