// LocalStorage utility functions

// Scores
function getScores() {
    const scores = localStorage.getItem('musicGameScores');
    return scores ? JSON.parse(scores) : [];
}

function saveScore(score) {
    const scores = getScores();
    scores.push({
        ...score,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });
    // Keep only the latest 50 scores
    if (scores.length > 50) {
        scores.splice(0, scores.length - 50);
    }
    localStorage.setItem('musicGameScores', JSON.stringify(scores));
}

function clearScores() {
    localStorage.removeItem('musicGameScores');
}

// Favorites
function getFavorites() {
    const favorites = localStorage.getItem('musicGameFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

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

// Game State
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
