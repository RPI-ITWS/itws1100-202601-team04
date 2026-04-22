let songs = [];
let currentSong = null;
let score = 0;
let currentDifficulty = "easy";
let roundsPlayed = 0;
const MAX_ROUNDS = 10;

// All genres from songs.json
const ALL_GENRES = ["Indie Folk", "Country", "K-Pop", "Indie Rock", "Pop", "R&B", "Country Pop", "Latin", "Hip Hop", "Indie Pop", "Afrobeats"];

// How many genre options to show per difficulty
const DIFFICULTY_OPTIONS = {
    easy: 3,
    medium: 6,
    hard: ALL_GENRES.length
};

// Single shared audio player
const audioPlayer = new Audio();
audioPlayer.volume = 0.6;

// LOAD DATA — only keep songs that have a preview URL
$(document).ready(function () {
    $.getJSON("data/songs.json", function (data) {
        songs = data.filter(s => s.previewUrl && s.previewUrl.trim() !== "");
        console.log(`Loaded ${songs.length} songs with previews`);
    }).fail(function () {
        console.error("Failed to load songs.json");
    });
});

// Called by difficulty buttons in play.html
function startGame(difficulty) {
    if (songs.length === 0) {
        alert("Songs are still loading, try again in a second.");
        return;
    }

    // Ask for player name before starting
    let playerName = prompt("Enter your name for the scoreboard:") || "Player";
    playerName = playerName.trim() || "Player";
    window.currentPlayerName = playerName;

    currentDifficulty = difficulty;
    score = 0;
    roundsPlayed = 0;

    $("#score").text(0);
    $("#gameSection").show();
    $("html, body").animate({ scrollTop: $("#gameSection").offset().top }, 400);

    nextRound();
}

function nextRound() {
    if (roundsPlayed >= MAX_ROUNDS) {
        endGame();
        return;
    }

    $("#result").text("");
    $("#options button").prop("disabled", false);

    // Pick a random song (all have previews)
    currentSong = songs[Math.floor(Math.random() * songs.length)];

    // Play preview
    audioPlayer.pause();
    audioPlayer.src = currentSong.previewUrl;
    audioPlayer.currentTime = 0;
    audioPlayer.play().catch(err => {
        console.warn("Audio playback failed:", err);
    });

    // Show cover image
    $("#cover")
        .attr("src", currentSong.coverImage || "")
        .off("error")
        .on("error", function () {
            $(this).attr("src", "https://via.placeholder.com/200?text=No+Image");
        });

    // Build genre options based on difficulty
    let numOptions = DIFFICULTY_OPTIONS[currentDifficulty];
    let correct = currentSong.genre;

    let optionPool = ALL_GENRES.filter(g => g !== correct);
    optionPool.sort(() => Math.random() - 0.5);
    let options = optionPool.slice(0, numOptions - 1);
    options.push(correct);
    options.sort(() => Math.random() - 0.5);

    // Render buttons
    $("#options").html("");
    options.forEach(g => {
        $("#options").append(
            `<button onclick="checkAnswer('${g}')">${g}</button>`
        );
    });

    $("#round").text(`Round ${roundsPlayed + 1} / ${MAX_ROUNDS}`);
}

function checkAnswer(choice) {
    audioPlayer.pause();
    $("#options button").prop("disabled", true);

    if (choice === currentSong.genre) {
        score++;
        $("#result").text("✅ Correct!");
    } else {
        $("#result").text("❌ Wrong! It was " + currentSong.genre);
    }

    $("#score").text(score);
    roundsPlayed++;
}

function endGame() {
    audioPlayer.pause();

    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ name: window.currentPlayerName || "Player", score: score });
    localStorage.setItem("scores", JSON.stringify(scores));

    $("#gameSection").html(`
        <h2>Game Over!</h2>
        <p>Nice work, ${window.currentPlayerName || "Player"}!</p>
        <p>Your final score: <strong>${score} / ${MAX_ROUNDS}</strong></p>
        <a href="scoreboard.html"><button>View Scoreboard</button></a>
        <button onclick="location.reload()">Play Again</button>
    `);
}