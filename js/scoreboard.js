// Scoreboard — reads saved scores from localStorage, sorts by score, and renders them

// Remembers which filter button was last clicked so clearScores can re-render the same view
let currentFilter = 'all';

// Filters scores by difficulty (or shows all), sorts highest first, then renders
function loadScoreboard(filter) {
    filter = filter || 'all';
    currentFilter  = filter;
    const allScores = getScores();

    const filtered = filter === 'all'
        ? allScores
        : allScores.filter(s => s.difficulty === filter);

    filtered.sort((a, b) => b.score - a.score);

    displayScores(filtered);
}

function displayScores(scores) {
    const container = document.getElementById('scoreboard-list');

    if (scores.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🏆</span>
                <h3>No Scores Yet</h3>
                <p>Play the game to see your scores here</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    scores.forEach((score, index) => {
        const item = createScoreItem(score, index + 1);
        container.appendChild(item);
    });
}

// Builds one score row; top-3 entries get medal emojis instead of a rank number
function createScoreItem(score, rank) {
    const item = document.createElement('div');
    item.className = 'score-item';
    item.style.animation = `fadeIn 0.5s ease ${rank * 0.05}s both`;

    const date    = new Date(score.timestamp);
    const dateStr = date.toLocaleDateString('en-US', {
        month:  'short',
        day:    'numeric',
        year:   'numeric',
        hour:   '2-digit',
        minute: '2-digit'
    });

    const difficultyEmoji = {
        easy:        '😊',
        medium:      '🤔',
        hard:        '😰',
        'song-guess':'🎵'
    };

    const displayName = score.gameType || (score.difficulty === 'song-guess'
        ? 'Song Guessing'
        : score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1));

    item.innerHTML = `
        <div class="score-item-left">
            <div class="score-rank ${rank <= 3 ? 'top' : ''}">
                ${rank <= 3 ? ['🥇','🥈','🥉'][rank - 1] : `#${rank}`}
            </div>
            <div class="score-details">
                <h3>${difficultyEmoji[score.difficulty] || '🎮'} ${displayName}</h3>
                <p class="score-meta">
                    <strong>${score.playerName || 'Player'}</strong> &bull;
                    ${score.correctAnswers}/${score.totalQuestions} correct
                    (${score.accuracy}%) • ${dateStr}
                </p>
            </div>
        </div>
        <div class="score-value-large">${score.score}</div>
    `;

    return item;
}

// Called by the filter buttons in scoreboard.html
function filterScores(filter) {
    loadScoreboard(filter);
}

// Note: renamed to avoid conflict with clearScores() in storage.js
// Asks for confirmation before wiping all scores, then refreshes the current filtered view
function clearScores() {
    if (confirm('Are you sure you want to clear all scores? This cannot be undone.')) {
        localStorage.removeItem('musicGameScores');
        loadScoreboard(currentFilter);
    }
}