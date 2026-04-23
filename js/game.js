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

// ─── Audio Player ────────────────────────────────────────────────────────────
const gameAudioPlayer = new Audio();
gameAudioPlayer.volume = 0.3;

function stopDemoAudio() {
    gameAudioPlayer.pause();
    gameAudioPlayer.src = '';
}

function startGame(difficulty) {
    gameState.difficulty = difficulty;
    gameState.currentRound = 0;
    gameState.score = 0;
    gameState.correctAnswers = 0;
    gameState.questions = generateQuestions();

    const settings = difficultySettings[difficulty];
    gameState.timeLeft = settings.time;

    // Play audio first — before navigating — so the call stays inside the user gesture.
    // Any hash change (navigateTo) causes Chrome to treat later play() calls as autoplay.
    playAudio();

    navigateTo('#gameplay');
    updateGameDisplay();
    displayQuestion();
    startTimer();
}

function generateQuestions() {
    const pool = songs.filter(s => s.previewUrl);
    const shuffled = pool.sort(() => 0.5 - Math.random());
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

    const icon = document.getElementById('audio-icon');
    const text = document.getElementById('audio-text');

    if (gameState.audioEnabled) {
        icon.textContent = '🔊';
        text.textContent = 'Audio Enabled';
        gameAudioPlayer.volume = 0.3;
        if (gameState.questions.length > 0 && gameState.currentRound < 10) {
            playAudio();
        }
    } else {
        icon.textContent = '🔇';
        text.textContent = 'Audio Muted';
        gameAudioPlayer.volume = 0;
        stopDemoAudio();
    }
}

function playAudio() {
    if (!gameState.audioEnabled) return;

    const currentSong = gameState.questions[gameState.currentRound];

    if (currentSong.previewUrl) {
        gameAudioPlayer.pause();
        gameAudioPlayer.src         = currentSong.previewUrl;
        gameAudioPlayer.currentTime = 0;
        gameAudioPlayer.volume      = 0.3;
        gameAudioPlayer.play().catch(err => console.warn('Audio playback failed:', err));
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
