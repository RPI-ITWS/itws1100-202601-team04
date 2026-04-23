// Genre Guessing Game — player sees a blurred album cover and picks the correct genre

// Single source of truth for all in-progress game data
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

// Higher blur and shorter time on harder difficulties; timeBonus scales score reward for speed
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

// Resets state, picks 10 random songs, and starts the first round
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

// Picks 10 songs that have a preview URL and shuffles them
function generateQuestions() {
    const pool = songs.filter(s => s.previewUrl);
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
}

// Resets the timer and renders the next question for a new round
function startRound() {
    const settings = difficultySettings[gameState.difficulty];
    gameState.timeLeft = settings.time;

    updateGameDisplay();
    displayQuestion();
    startTimer();
    playAudio();
}

function updateGameDisplay() {
    document.getElementById('round-display').textContent =
        `${gameState.currentRound + 1}/10`;
    document.getElementById('score-display').textContent = gameState.score;
    document.getElementById('correct-display').textContent =
        `${gameState.correctAnswers}/10`;
}

// Sets the blurred album cover and generates 4 genre buttons (1 correct, 3 random wrong)
function displayQuestion() {
    const currentSong = gameState.questions[gameState.currentRound];
    const settings    = difficultySettings[gameState.difficulty];

    const albumImg = document.getElementById('album-cover');
    albumImg.onerror = function () {
        this.onerror = null;
        this.src = 'https://via.placeholder.com/300x300/1a1a2e/e0e0e0?text=🎵';
    };
    albumImg.src   = currentSong.coverImage || '';
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

// Locks buttons, reveals the album, calculates score (base 100 + speed bonus), then advances
function handleAnswer(selectedGenre) {
    stopTimer();
    stopDemoAudio();

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

    // Unblur the album so the player can see the answer
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

    // 3-second pause so the player can read the feedback before the next round loads
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

// Counts down every second; auto-submits an empty answer when time hits zero
function startTimer() {
    const settings  = difficultySettings[gameState.difficulty];
    const totalTime = settings.time;

    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;

        document.getElementById('timer-display').textContent = gameState.timeLeft;

        const progress = (gameState.timeLeft / totalTime) * 100;
        document.getElementById('timer-progress').style.width = `${progress}%`;

        if (gameState.timeLeft <= 0) {
            handleAnswer(''); // empty string won't match any genre → treated as wrong
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// Mutes/unmutes without stopping the game; resumes from the paused position on unmute
function toggleAudio() {
    gameState.audioEnabled = !gameState.audioEnabled;

    const icon = document.getElementById('audio-icon');
    const text = document.getElementById('audio-text');

    if (gameState.audioEnabled) {
        icon.textContent = '🔊';
        text.textContent = 'Audio Enabled';
        gameAudioPlayer.volume = 0.3;
        // Resume from the paused spot — don't reset src/currentTime
        if (gameState.questions.length > 0 && gameState.currentRound < 10) {
            gameAudioPlayer.play().catch(err => console.warn('Audio playback failed:', err));
        }
    } else {
        icon.textContent = '🔇';
        text.textContent = 'Audio Muted';
        // Pause only — keeping src intact so resume works
        gameAudioPlayer.pause();
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

// Saves the score to localStorage and navigates to the results screen
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
