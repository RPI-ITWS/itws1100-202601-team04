// Thin wrappers around localStorage so the rest of the app never touches it directly

// ── Scores ───────────────────────────────────────────────────────────────────

function getScores() {
    const scores = localStorage.getItem('musicGameScores');
    return scores ? JSON.parse(scores) : [];
}

// Stamps each entry with a timestamp + unique id, then caps the list at 50
function saveScore(score) {
    const scores = getScores();
    scores.push({
        ...score,
        playerName: score.playerName || localStorage.getItem('musicGamePlayerName') || 'Player',
        timestamp: new Date().toISOString(),
        id: Date.now()
    });
    if (scores.length > 50) {
        scores.splice(0, scores.length - 50);
    }
    localStorage.setItem('musicGameScores', JSON.stringify(scores));
}

function clearScores() {
    localStorage.removeItem('musicGameScores');
}

// ── Favorites ────────────────────────────────────────────────────────────────

function getFavorites() {
    const favorites = localStorage.getItem('musicGameFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

// Silently ignores duplicates (checked by song.id)
function addFavorite(song) {
    const favorites = getFavorites();
    if (!favorites.find(f => f.id === song.id)) {
        favorites.push(song);
        localStorage.setItem('musicGameFavorites', JSON.stringify(favorites));
    }
}

function removeFavorite(songId) {
    const favorites = getFavorites();
    const filtered = favorites.filter(f => f.id !== songId);
    localStorage.setItem('musicGameFavorites', JSON.stringify(filtered));
}

function isFavorite(songId) {
    const favorites = getFavorites();
    return favorites.some(f => f.id === songId);
}

// ── Game State ───────────────────────────────────────────────────────────────
// Persists mid-game state so a page refresh could theoretically resume

function saveGameState(state) {
    localStorage.setItem('currentGameState', JSON.stringify(state));
}

function getGameState() {
    const state = localStorage.getItem('currentGameState');
    return state ? JSON.parse(state) : null;
}

function clearGameState() {
    localStorage.removeItem('currentGameState');
}