let allSongs = [];

// Load songs from JSON file
async function loadSongs() {
  try {
    const res = await fetch("songs.json"); // make sure path is correct
    allSongs = await res.json();
  } catch (error) {
    console.error("Error loading songs:", error);
  }
}

// Generate playlist
function generatePlaylist() {
  const genre = document.getElementById("genreSelect").value;
  const container = document.getElementById("playlist");

  container.innerHTML = "";

  const filtered = allSongs.filter(song =>
    song.genre.toLowerCase() === genre.toLowerCase()
  );

  if (filtered.length === 0) {
    container.innerHTML = "<p>No songs found</p>";
    return;
  }

  const playlist = filtered.slice(0, 5);

  displayPlaylist(playlist);
}

// Display playlist
function displayPlaylist(playlist) {
  const container = document.getElementById("playlist");
  container.innerHTML = "";

  playlist.forEach(song => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${song.title}</h3>
      <p>${song.artist} - ${song.genre}</p>
    `;
    container.appendChild(div);
  });
}

// Load scores when page opens
document.addEventListener("DOMContentLoaded", () => {
  loadSongs();
  loadScores();
});

// Load scores
function loadScores() {
  const container = document.getElementById("scores");
  if (!container) return;

  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  container.innerHTML = "";

  if (scores.length === 0) {
    container.innerHTML = "<p>No scores yet</p>";
    return;
  }

  scores.sort((a, b) => b.score - a.score);

  scores.forEach(s => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${s.name}</h3>
      <p>Score: ${s.score}</p>
    `;
    container.appendChild(div);
  });
}

// Add test score
function addTestScore() {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.push({
    name: "Player",
    score: Math.floor(Math.random() * 100)
  });

  localStorage.setItem("scores", JSON.stringify(scores));

  loadScores(); // refresh display
}