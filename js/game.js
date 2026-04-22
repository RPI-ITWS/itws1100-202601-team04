// Game Logic

let gameState = {
    difficulty: 'easy',
    currentRound: 0,
    score: 0,
    correctAnswers: 0,
    questions: [],
    timeLeft: 20,
    timerInterval: null,
    audioEnabled: true
};

const difficultySettings = {
    easy: { blur: 5, time: 30, timeBonus: 30 },
    medium: { blur: 15, time: 20, timeBonus: 50 },
    hard: { blur: 25, time: 15, timeBonus: 80 }
};

// ─── Web Audio Demo Engine ───────────────────────────────────────────────────
let gameAudioCtx = null;

const GENRE_CHORDS = {
    'Pop':       [[261.63,329.63,392.00],[349.23,440.00,523.25],[293.66,369.99,440.00],[392.00,493.88,587.33]],
    'Rock':      [[220.00,261.63,329.63],[196.00,246.94,293.66],[174.61,220.00,261.63],[220.00,277.18,329.63]],
    'Hip-Hop':   [[184.00,220.00,277.18],[164.81,196.00,246.94],[174.61,220.00,261.63],[184.00,220.00,277.18]],
    'Electronic':[[293.66,369.99,440.00],[329.63,415.30,493.88],[261.63,329.63,392.00],[293.66,349.23,440.00]],
    'R&B':       [[246.94,311.13,369.99],[220.00,277.18,349.23],[261.63,329.63,415.30],[233.08,293.66,349.23]],
    'Jazz':      [[261.63,329.63,392.00,493.88],[220.00,277.18,349.23,440.00],[293.66,369.99,440.00,554.37],[246.94,311.13,392.00,493.88]],
    'Country':   [[261.63,329.63,392.00],[349.23,440.00,523.25],[293.66,369.99,440.00],[261.63,329.63,440.00]],
    'Classical': [[261.63,329.63,392.00],[246.94,311.13,369.99],[261.63,329.63,392.00],[220.00,293.66,349.23]],
    'Indie':     [[233.08,293.66,349.23],[261.63,329.63,392.00],[220.00,277.18,329.63],[246.94,311.13,392.00]],
    'Metal':     [[138.59,174.61,220.00],[130.81,164.81,196.00],[138.59,174.61,220.00],[123.47,155.56,184.00]]
};

function playGenreAudio(song) {
    stopDemoAudio();
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        gameAudioCtx = new AudioCtx();

        const bpm         = song.tempo  || 120;
        const energy      = song.energy || 5;
        const beatDur     = 60 / bpm;
        const volume      = 0.06 + (energy / 10) * 0.09;
        const waveType    = energy > 7 ? 'sawtooth' : energy > 4 ? 'triangle' : 'sine';
        const chords      = GENRE_CHORDS[song.genre] || GENRE_CHORDS['Pop'];
        const totalBeats  = Math.min(Math.ceil(30 / beatDur), 120);

        for (let beat = 0; beat < totalBeats; beat++) {
            const t        = gameAudioCtx.currentTime + beat * beatDur;
            const chordIdx = Math.floor(beat / 4) % chords.length;

            chords[chordIdx].forEach(freq => {
                const osc  = gameAudioCtx.createOscillator();
                const gain = gameAudioCtx.createGain();

                osc.connect(gain);
                gain.connect(gameAudioCtx.destination);

                osc.type = waveType;
                osc.frequency.setValueAtTime(freq, t);

                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(volume, t + 0.02);
                gain.gain.setValueAtTime(volume, t + beatDur * 0.7);
                gain.gain.exponentialRampToValueAtTime(0.001, t + beatDur * 0.95);

                osc.start(t);
                osc.stop(t + beatDur * 0.95);
            });
        }
    } catch (e) {
        console.log('Web Audio API error:', e);
    }
}

function stopDemoAudio() {
    if (gameAudioCtx) {
        try { gameAudioCtx.close(); } catch (e) {}
        gameAudioCtx = null;
    }
    const audio = document.getElementById('game-audio');
    if (audio) { audio.pause(); audio.src = ''; }
}
// ─────────────────────────────────────────────────────────────────────────────

function startGame(difficulty) {
    gameState.difficulty = difficulty;
    gameState.currentRound = 0;
    gameState.score = 0;
    gameState.correctAnswers = 0;
    gameState.questions = generateQuestions();

    navigateTo('#gameplay');
    setTimeout(() => startRound(), 100);
}

function generateQuestions() {
    const shuffled = [...songs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
}

function startRound() {
    const settings = difficultySettings[gameState.difficulty];
    gameState.timeLeft = settings.time;

    updateGameDisplay();
    displayQuestion();
    startTimer();
    playAudio(); // ← audio plays as soon as timer starts
}

function updateGameDisplay() {
    document.getElementById('round-display').textContent =
        `${gameState.currentRound + 1}/10`;
    document.getElementById('score-display').textContent = gameState.score;
    document.getElementById('correct-display').textContent =
        `${gameState.correctAnswers}/10`;
}

function displayQuestion() {
    const currentSong = gameState.questions[gameState.currentRound];
    const settings    = difficultySettings[gameState.difficulty];

    const albumImg = document.getElementById('album-cover');
    albumImg.src   = currentSong.coverImage;
    albumImg.style.filter = `blur(${settings.blur}px)`;

    const correctGenre = currentSong.genre;
    const wrongGenres  = GENRES.filter(g => g !== correctGenre)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const allOptions = [correctGenre, ...wrongGenres].sort(() => 0.5 - Math.random());

    const optionsContainer = document.getElementById('genre-options');
    optionsContainer.innerHTML = '';

    allOptions.forEach(genre => {
        const button     = document.createElement('button');
        button.className = 'genre-option';
        button.textContent = genre;
        button.onclick   = () => handleAnswer(genre);
        optionsContainer.appendChild(button);
    });

    document.getElementById('feedback').classList.add('hidden');
}

function handleAnswer(selectedGenre) {
    stopTimer();
    stopDemoAudio(); // stop music when answer is given

    const currentSong = gameState.questions[gameState.currentRound];
    const isCorrect   = selectedGenre === currentSong.genre;

    document.querySelectorAll('.genre-option').forEach(btn => {
        btn.classList.add('disabled');
        btn.onclick = null;

        if (btn.textContent === currentSong.genre) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedGenre && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    document.getElementById('album-cover').style.filter = 'blur(0px)';

    if (isCorrect) {
        const settings   = difficultySettings[gameState.difficulty];
        const timeBonus  = Math.floor(gameState.timeLeft * settings.timeBonus);
        const roundScore = 100 + timeBonus;
        gameState.score += roundScore;
        gameState.correctAnswers++;
        showFeedback(true, `Correct! +${roundScore} points`);
    } else {
        showFeedback(false, `Wrong! The correct genre was ${currentSong.genre}`);
    }

    updateGameDisplay();

    setTimeout(() => {
        gameState.currentRound++;
        if (gameState.currentRound < 10) {
            startRound();
        } else {
            endGame();
        }
    }, 3000);
}

function showFeedback(isCorrect, message) {
    const feedback = document.getElementById('feedback');
    const icon     = document.getElementById('feedback-icon');
    const text     = document.getElementById('feedback-text');

    feedback.className = 'feedback';
    feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    icon.textContent = isCorrect ? '✓' : '✗';
    text.textContent = message;
}

function startTimer() {
    const settings  = difficultySettings[gameState.difficulty];
    const totalTime = settings.time;

    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;

        document.getElementById('timer-display').textContent = gameState.timeLeft;

        const progress = (gameState.timeLeft / totalTime) * 100;
        document.getElementById('timer-progress').style.width = `${progress}%`;

        if (gameState.timeLeft <= 0) {
            handleAnswer(''); // time's up
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function toggleAudio() {
    gameState.audioEnabled = !gameState.audioEnabled;

    const icon  = document.getElementById('audio-icon');
    const text  = document.getElementById('audio-text');
    const audio = document.getElementById('game-audio');

    if (gameState.audioEnabled) {
        icon.textContent = '🔊';
        text.textContent = 'Audio Enabled';
        audio.volume     = 0.3;
        // Re-play audio for current round
        if (gameState.questions.length > 0 && gameState.currentRound < 10) {
            playAudio();
        }
    } else {
        icon.textContent = '🔇';
        text.textContent = 'Audio Muted';
        audio.volume     = 0;
        stopDemoAudio();
    }
}

function playAudio() {
    if (!gameState.audioEnabled) return;

    const currentSong = gameState.questions[gameState.currentRound];
    const audio       = document.getElementById('game-audio');

    if (currentSong.audioPreviewUrl) {
        audio.src    = currentSong.audioPreviewUrl;
        audio.volume = 0.3;
        audio.play().catch(() => {});
    } else {
        // Demo mode – synthesise audio from song metadata
        playGenreAudio(currentSong);
    }
}

function endGame() {
    stopTimer();
    stopDemoAudio();

    const finalScore = {
        score:          gameState.score,
        correctAnswers: gameState.correctAnswers,
        totalQuestions: 10,
        accuracy:       Math.round((gameState.correctAnswers / 10) * 100),
        difficulty:     gameState.difficulty
    };

    saveScore(finalScore);

    document.getElementById('final-score').textContent     = gameState.score;
    document.getElementById('final-correct').textContent   = `${gameState.correctAnswers}/10`;
    document.getElementById('final-accuracy').textContent  = `${finalScore.accuracy}%`;
    document.getElementById('final-difficulty').textContent =
        gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);

    navigateTo('#results');
}
