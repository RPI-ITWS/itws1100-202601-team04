// Song Guessing Game Logic

let songGameState = {
    currentRound:   0,
    score:          0,
    totalPoints:    0, // Out of 20 (2 points per round)
    questions:      [],
    preloadedAudio: [],
    audioElement:   null,
    audioInterval:  null,
    isPlaying:      false
};

// ─── Web Audio Demo Engine ───────────────────────────────────────────────────
let songAudioCtx = null;

const SONG_GENRE_CHORDS = {
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

function stopSongDemoAudio() {
    if (songAudioCtx) {
        try { songAudioCtx.close(); } catch (e) {}
        songAudioCtx = null;
    }
}

function playDemoSongAudio(song) {
    stopSongDemoAudio();

    const playIcon = document.getElementById('play-icon');
    const playText = document.getElementById('play-text');

    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) {
            // Fallback: just simulate progress without sound
            simulateAudioPlayback();
            return;
        }

        songAudioCtx = new AudioCtx();

        const bpm        = song.tempo  || 120;
        const energy     = song.energy || 5;
        const beatDur    = 60 / bpm;
        const volume     = 0.07 + (energy / 10) * 0.1;
        const waveType   = energy > 7 ? 'sawtooth' : energy > 4 ? 'triangle' : 'sine';
        const chords     = SONG_GENRE_CHORDS[song.genre] || SONG_GENRE_CHORDS['Pop'];
        const totalBeats = Math.min(Math.ceil(30 / beatDur), 120);

        for (let beat = 0; beat < totalBeats; beat++) {
            const t        = songAudioCtx.currentTime + beat * beatDur;
            const chordIdx = Math.floor(beat / 4) % chords.length;

            chords[chordIdx].forEach(freq => {
                const osc  = songAudioCtx.createOscillator();
                const gain = songAudioCtx.createGain();

                osc.connect(gain);
                gain.connect(songAudioCtx.destination);

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

    // Start UI playback indicator & progress bar
    songGameState.isPlaying = true;
    playIcon.textContent    = '⏸️';
    playText.textContent    = 'Playing...';

    let elapsed = 0;
    const duration = 30;

    if (songGameState.audioInterval) clearInterval(songGameState.audioInterval);

    songGameState.audioInterval = setInterval(() => {
        elapsed += 0.1;

        if (elapsed >= duration) {
            clearInterval(songGameState.audioInterval);
            songGameState.audioInterval = null;
            songGameState.isPlaying     = false;
            playIcon.textContent        = '▶️';
            playText.textContent        = 'Replay';
            return;
        }

        const progress = (elapsed / duration) * 100;
        document.getElementById('audio-progress').style.width = `${progress}%`;
        document.getElementById('audio-current-time').textContent = formatTime(elapsed);
    }, 100);
}
// ─────────────────────────────────────────────────────────────────────────────

function startSongGame() {
    // Stop any leftover audio from a previous game
    songGameState.preloadedAudio.forEach(a => a.pause());

    songGameState.currentRound   = 0;
    songGameState.score          = 0;
    songGameState.totalPoints    = 0;
    songGameState.questions      = generateSongQuestions();
    songGameState.preloadedAudio = preloadSongAudio(songGameState.questions);
    songGameState.audioElement   = null;
    songGameState.isPlaying      = false;

    navigateTo('#song-game');
    startSongRound();
}

function generateSongQuestions() {
    const pool = songs.filter(s =>
        s.previewUrl && s.previewUrl.includes('itunes.apple.com')
    );
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
}

function preloadSongAudio(questions) {
    return questions.map(song => {
        const audio = new Audio(song.previewUrl);
        audio.preload = 'auto';
        audio.volume  = 0.5;
        return audio;
    });
}

function startSongRound() {
    updateSongGameDisplay();
    resetSongInputs();
    resetAudioPlayer();
    hideSongFeedback();

    playSongAudio();
}

function updateSongGameDisplay() {
    document.getElementById('song-round-display').textContent =
        `${songGameState.currentRound + 1}/10`;
    document.getElementById('song-score-display').textContent = songGameState.score;
    document.getElementById('song-points-display').textContent =
        `${songGameState.totalPoints}/20`;
}

function resetSongInputs() {
    document.getElementById('song-title-input').value    = '';
    document.getElementById('artist-input').value        = '';
    document.getElementById('song-title-input').disabled = false;
    document.getElementById('artist-input').disabled     = false;
}

function resetAudioPlayer() {
    // Stop any playing audio
    stopSongDemoAudio();

    if (songGameState.audioElement) {
        songGameState.audioElement.pause();
        songGameState.audioElement = null;
    }

    if (songGameState.audioInterval) {
        clearInterval(songGameState.audioInterval);
        songGameState.audioInterval = null;
    }

    songGameState.isPlaying = false;

    document.getElementById('play-icon').textContent          = '▶️';
    document.getElementById('play-text').textContent          = 'Play Song';
    document.getElementById('play-audio-btn').disabled        = false;
    document.getElementById('audio-current-time').textContent = '0:00';
    document.getElementById('audio-duration').textContent     = '0:30';
    document.getElementById('audio-progress').style.width     = '0%';
}

function playSongAudio() {
    const currentSong = songGameState.questions[songGameState.currentRound];
    const playIcon    = document.getElementById('play-icon');
    const playText    = document.getElementById('play-text');

    // Toggle: if already playing, pause
    if (songGameState.isPlaying) {
        stopSongDemoAudio();
        if (songGameState.audioElement) songGameState.audioElement.pause();
        if (songGameState.audioInterval) {
            clearInterval(songGameState.audioInterval);
            songGameState.audioInterval = null;
        }
        songGameState.isPlaying = false;
        playIcon.textContent    = '▶️';
        playText.textContent    = 'Play Song';
        return;
    }

    // Use preloaded audio for current round
    const audio = songGameState.preloadedAudio[songGameState.currentRound];
    if (!audio) return;

    songGameState.audioElement  = audio;
    audio.currentTime = 0;
    audio.volume      = 0.5;

    audio.play().then(() => {
        songGameState.isPlaying = true;
        playIcon.textContent    = '⏸️';
        playText.textContent    = 'Pause';

        let elapsed = 0;
        const dur   = 30;

        songGameState.audioInterval = setInterval(() => {
            elapsed += 0.1;

            if (elapsed >= dur || !songGameState.isPlaying) {
                clearInterval(songGameState.audioInterval);
                songGameState.audioInterval = null;
                songGameState.isPlaying     = false;
                playIcon.textContent        = '▶️';
                playText.textContent        = 'Replay';
                audio.pause();
                return;
            }

            const progress = (elapsed / dur) * 100;
            document.getElementById('audio-progress').style.width = `${progress}%`;
            document.getElementById('audio-current-time').textContent = formatTime(elapsed);
        }, 100);

    }).catch(err => console.warn('Audio playback failed:', err));
}

function simulateAudioPlayback() {
    const playIcon = document.getElementById('play-icon');
    const playText = document.getElementById('play-text');

    songGameState.isPlaying = true;
    playIcon.textContent    = '⏸️';
    playText.textContent    = 'Playing...';

    let elapsed       = 0;
    const duration    = 30;

    if (songGameState.audioInterval) clearInterval(songGameState.audioInterval);

    songGameState.audioInterval = setInterval(() => {
        elapsed += 0.1;

        if (elapsed >= duration) {
            clearInterval(songGameState.audioInterval);
            songGameState.isPlaying = false;
            playIcon.textContent    = '▶️';
            playText.textContent    = 'Replay';
            return;
        }

        const progress = (elapsed / duration) * 100;
        document.getElementById('audio-progress').style.width = `${progress}%`;
        document.getElementById('audio-current-time').textContent = formatTime(elapsed);
    }, 100);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function submitSongGuess() {
    const titleInput  = document.getElementById('song-title-input').value.trim();
    const artistInput = document.getElementById('artist-input').value.trim();

    if (!titleInput && !artistInput) {
        alert('Please enter at least one guess!');
        return;
    }

    processSongAnswer(titleInput, artistInput);
}

function skipSongRound() {
    if (confirm('Are you sure you want to skip this round?')) {
        processSongAnswer('', '');
    }
}

function processSongAnswer(titleGuess, artistGuess) {
    // Stop audio
    stopSongDemoAudio();
    if (songGameState.audioElement) songGameState.audioElement.pause();
    if (songGameState.audioInterval) {
        clearInterval(songGameState.audioInterval);
        songGameState.audioInterval = null;
    }
    songGameState.isPlaying = false;

    const currentSong = songGameState.questions[songGameState.currentRound];

    const normalize = (str) => str.toLowerCase().trim()
        .replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');

    const correctTitle  = normalize(currentSong.title);
    const correctArtist = normalize(currentSong.artist);
    const guessedTitle  = normalize(titleGuess);
    const guessedArtist = normalize(artistGuess);

    const titleMatch = guessedTitle && (
        correctTitle.includes(guessedTitle) ||
        guessedTitle.includes(correctTitle) ||
        correctTitle === guessedTitle
    );

    const artistMatch = guessedArtist && (
        correctArtist.includes(guessedArtist) ||
        guessedArtist.includes(correctArtist) ||
        correctArtist === guessedArtist
    );

    let pointsEarned = 0;
    let roundScore   = 0;

    if (titleMatch)  { pointsEarned++; roundScore += 50; }
    if (artistMatch) { pointsEarned++; roundScore += 50; }
    if (titleMatch && artistMatch) roundScore += 50; // bonus

    songGameState.totalPoints += pointsEarned;
    songGameState.score       += roundScore;

    document.getElementById('song-title-input').disabled = true;
    document.getElementById('artist-input').disabled     = true;
    document.getElementById('play-audio-btn').disabled   = true;

    showSongFeedback(titleMatch, artistMatch, currentSong, roundScore);
    updateSongGameDisplay();

    setTimeout(() => {
        songGameState.currentRound++;
        if (songGameState.currentRound < 10) {
            startSongRound();
        } else {
            endSongGame();
        }
    }, 4000);
}

function showSongFeedback(titleMatch, artistMatch, song, points) {
    const feedback = document.getElementById('song-feedback');
    const icon     = document.getElementById('song-feedback-icon');
    const text     = document.getElementById('song-feedback-text');

    feedback.className = 'feedback';

    let message   = '';
    let isCorrect = false;

    if (titleMatch && artistMatch) {
        isCorrect = true;
        icon.textContent = '🎉';
        message = `<strong>Perfect! +${points} points</strong><br>` +
                  `Song: "${song.title}"<br>Artist: ${song.artist}`;
    } else if (titleMatch || artistMatch) {
        isCorrect = true;
        icon.textContent = '✓';
        message = `<strong>Partially Correct! +${points} points</strong><br>`;
        if (titleMatch) {
            message += `✓ Song: "${song.title}"<br>✗ Artist: ${song.artist} (You guessed wrong)`;
        } else {
            message += `✗ Song: "${song.title}" (You guessed wrong)<br>✓ Artist: ${song.artist}`;
        }
    } else {
        icon.textContent = '✗';
        message = `<strong>Incorrect</strong><br>` +
                  `Song: "${song.title}"<br>Artist: ${song.artist}`;
    }

    feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    text.innerHTML = message;
}

function hideSongFeedback() {
    document.getElementById('song-feedback').classList.add('hidden');
}

function endSongGame() {
    stopSongDemoAudio();
    songGameState.preloadedAudio.forEach(a => a.pause());
    songGameState.preloadedAudio = [];
    if (songGameState.audioInterval) clearInterval(songGameState.audioInterval);

    const accuracy = Math.round((songGameState.totalPoints / 20) * 100);

    const finalScore = {
        score:          songGameState.score,
        correctAnswers: songGameState.totalPoints,
        totalQuestions: 20,
        accuracy:       accuracy,
        difficulty:     'song-guess',
        gameType:       'Song Guessing'
    };

    saveScore(finalScore);

    document.getElementById('final-score').textContent    = songGameState.score;
    document.getElementById('final-correct').textContent  = `${songGameState.totalPoints}/20 points`;
    document.getElementById('final-accuracy').textContent = `${accuracy}%`;
    document.getElementById('final-difficulty').textContent = 'Song Guessing';

    navigateTo('#results');
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
    const titleInput  = document.getElementById('song-title-input');
    const artistInput = document.getElementById('artist-input');

    if (titleInput && artistInput) {
        [titleInput, artistInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') submitSongGuess();
            });
        });
    }
});
