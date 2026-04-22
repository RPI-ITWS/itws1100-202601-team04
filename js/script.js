// Load scores when page opens
document.addEventListener("DOMContentLoaded", () => {
  loadScores();
});

// Load and display scores from localStorage
function loadScores() {
  const container = document.getElementById("scores");
  if (!container) return;

  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  container.innerHTML = "";

  if (scores.length === 0) {
    container.innerHTML = "<p>No scores yet. Play a game first!</p>";
    return;
  }

  scores.sort((a, b) => b.score - a.score);

  scores.forEach((s, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>#${index + 1} ${s.name}</h3>
      <p>Score: ${s.score} / 10</p>
    `;
    container.appendChild(div);
  });
}

// Clear all scores from localStorage
function clearScores() {
  localStorage.removeItem("scores");
  loadScores();
}