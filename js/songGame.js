// Song Guessing Game Logic — Multiple Choice

let songGameState = {
    currentRound:   0,
    score:          0,
    questions:      [],
    audioInterval:  null,
    isPlaying:      false
};

// ─── Audio Player ─────────────────────────────────────────────────────────────
const songAudioPlayer = new Audio();
songAudioPlayer.volume = 0.5;

function stopSongDemoAudio() {
    songAudioPlayer.pause();
    songAudioPlayer.src = '';
    if (songGameState.audioInterval) {
        clearInterval(songGameState.audioInterval);
        songGameState.audioInterval = null;
    }
    songGameState.isPlaying = false;
}

// ─── Game Setup ───────────────────────────────────────────────────────────────

function startSongGame() {
    stopSongDemoAudio();

    songGameState.currentRound = 0;
    songGameState.score        = 0;
    songGameState.questions    = generateSongQuestions();
    songGameState.isPlaying    = false;

    navigateTo('#song-game');
    startSongRound();
}

function generateSongQuestions() {
    // Prefer iTunes preview URLs; fall back to any non-empty preview URL
    let pool = songs.filter(s => s.previewUrl && s.previewUrl.includes('itunes.apple.com'));
    if (pool.length < 10) {
        pool = songs.filter(s => s.previewUrl && s.previewUrl.trim() !== '');
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
}

// ─── Round Logic ──────────────────────────────────────────────────────────────

function startSongRound() {
    if (songGameState.questions.length === 0) {
        alert('Not enough songs with previews to play this mode.');
        navigateTo('#game');
        return;
    }

    updateSongGameDisplay();
    resetAudioPlayer();
    hideSongFeedback();
    displaySongQuestion();

    // Auto-play the preview for this round
    playSongAudio();
}

function updateSongGameDisplay() {
    document.getElementById('song-round-display').textContent =
        `${songGameState.currentRound + 1}/10`;
    document.getElementById('song-score-display').textContent = songGameState.score;
    document.getElementById('song-points-display').textContent =
        `${songGameState.currentRound}/10`;
}

function displaySongQuestion() {
    const currentSong = songGameState.questions[songGameState.currentRound];

    // Build 4 options: correct + 3 random decoys from the full songs list
    const wrongPool = songs.filter(s => s.id !== currentSong.id);
    const wrongs    = [...wrongPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options   = [currentSong, ...wrongs].sort(() => 0.5 - Math.random());

    const container = document.getElementById('song-options');
    container.innerHTML = '';

    options.forEach(song => {
        const btn         = document.createElement('button');
        btn.className     = 'genre-option';
        btn.dataset.id    = song.id;
        btn.innerHTML     = `<strong>${song.title}</strong><br><small>${song.artist}</small>`;
        btn.onclick       = () => handleSongAnswer(song.id);
        container.appendChild(btn);
    });
}

function handleSongAnswer(chosenId) {
    stopSongDemoAudio();

    const currentSong = songGameState.questions[songGameState.currentRound];
    const isCorrect   = chosenId === currentSong.id;

    // Disable all buttons, highlight correct/wrong
    document.querySelectorAll('#song-options .genre-option').forEach(btn => {
        btn.classList.add('disabled');
        btn.onclick = null;

        if (btn.dataset.id === currentSong.id) {
            btn.classList.add('correct');
        } else if (btn.dataset.id === chosenId && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    if (isCorrect) {
        songGameState.score += 100;
        showSongFeedback(true,
            `Correct! <strong>${currentSong.title}</strong> by ${currentSong.artist}`);
    } else {
        showSongFeedback(false,
            `Wrong! It was <strong>${currentSong.title}</strong> by ${currentSong.artist}`);
    }

    updateSongGameDisplay();

    setTimeout(() => {
        songGameState.currentRound++;
        if (songGameState.currentRound < 10) {
            startSongRound();
        } else {
            endSongGame();
        }
    }, 3000);
}

// ─── Audio ────────────────────────────────────────────────────────────────────

function resetAudioPlayer() {
    stopSongDemoAudio();

    const playIcon = document.getElementById('play-icon');
    const playText = document.getElementById('play-text');
    if (playIcon) playIcon.textContent        = '▶️';
    if (playText) playText.textContent        = 'Play Song';

    const playBtn = document.getElementById('play-audio-btn');
    if (playBtn) playBtn.disabled             = false;

    const timeCur  = document.getElementById('audio-current-time');
    const progress = document.getElementById('audio-progress');
    if (timeCur)  timeCur.textContent         = '0:00';
    if (progress) progress.style.width        = '0%';
}

function playSongAudio() {
    const playIcon    = document.getElementById('play-icon');
    const playText    = document.getElementById('play-text');
    const currentSong = songGameState.questions[songGameState.currentRound];

    // Toggle pause/play
    if (songGameState.isPlaying) {
        songAudioPlayer.pause();
        stopSongDemoAudio();
        if (playIcon) playIcon.textContent = '▶️';
        if (playText) playText.textContent = 'Play Song';
        return;
    }

    if (!currentSong || !currentSong.previewUrl) {
        if (playIcon) playIcon.textContent = '🔇';
        if (playText) playText.textContent = 'No Preview';
        return;
    }

    songAudioPlayer.src         = currentSong.previewUrl;
    songAudioPlayer.currentTime = 0;
    songAudioPlayer.volume      = 0.5;

    songAudioPlayer.play().then(() => {
        songGameState.isPlaying = true;
        if (playIcon) playIcon.textContent = '⏸️';
        if (playText) playText.textContent = 'Pause';

        let elapsed = 0;
        const dur   = 30;

        songGameState.audioInterval = setInterval(() => {
            elapsed += 0.1;

            const progress = document.getElementById('audio-progress');
            const timeCur  = document.getElementById('audio-current-time');
            if (progress) progress.style.width = `${(elapsed / dur) * 100}%`;
            if (timeCur)  timeCur.textContent  = formatTime(elapsed);

            if (elapsed >= dur) {
                clearInterval(songGameState.audioInterval);
                songGameState.audioInterval = null;
                songGameState.isPlaying     = false;
                songAudioPlayer.pause();
                if (playIcon) playIcon.textContent = '▶️';
                if (playText) playText.textContent = 'Replay';
            }
        }, 100);

    }).catch(err => {
        console.warn('Song audio playback failed:', err);
        // Show fallback UI — player can still answer without audio
        if (playIcon) playIcon.textContent = '🔇';
        if (playText) playText.textContent = 'No Preview';
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

function showSongFeedback(isCorrect, message) {
    const feedback = document.getElementById('song-feedback');
    const icon     = document.getElementById('song-feedback-icon');
    const text     = document.getElementById('song-feedback-text');

    if (!feedback) return;

    feedback.className = 'feedback';
    feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    feedback.classList.remove('hidden');

    if (icon) icon.textContent = isCorrect ? '✓' : '✗';
    if (text) text.innerHTML   = message;
}

function hideSongFeedback() {
    const feedback = document.getElementById('song-feedback');
    if (feedback) feedback.classList.add('hidden');
}

// ─── End Game ─────────────────────────────────────────────────────────────────

function endSongGame() {
    stopSongDemoAudio();

    const correct  = Math.round(songGameState.score / 100);
    const accuracy = Math.round((correct / 10) * 100);

    const finalScore = {
        score:          songGameState.score,
        correctAnswers: correct,
        totalQuestions: 10,
        accuracy:       accuracy,
        difficulty:     'song-guess',
        gameType:       'Song Guessing'
    };

    saveScore(finalScore);

    document.getElementById('final-score').textContent      = songGameState.score;
    document.getElementById('final-correct').textContent    = `${correct}/10`;
    document.getElementById('final-accuracy').textContent   = `${accuracy}%`;
    document.getElementById('final-difficulty').textContent = 'Song Guessing';

    navigateTo('#results');
}
