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

// LOAD DATA — nothing runs until songs are ready
$(document).ready(function () {
    $.getJSON("data/songs.json", function (data) {
        songs = data;
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

    currentDifficulty = difficulty;
    score = 0;
    roundsPlayed = 0;

    $("#score").text(0);
    $("#gameSection").show();
    $("html, body").animate({ scrollTop: $("#gameSection").offset().top }, 400);

    nextRound();
}

function nextRound() {
    // End game after MAX_ROUNDS
    if (roundsPlayed >= MAX_ROUNDS) {
        endGame();
        return;
    }

    $("#result").text("");
    $("#options button").prop("disabled", false);

    // Pick a random song
    currentSong = songs[Math.floor(Math.random() * songs.length)];

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

    // Start with the correct answer, then fill with random others
    let optionPool = ALL_GENRES.filter(g => g !== correct);
    // Shuffle pool
    optionPool.sort(() => Math.random() - 0.5);
    // Take (numOptions - 1) wrong answers and add correct
    let options = optionPool.slice(0, numOptions - 1);
    options.push(correct);
    // Shuffle final options
    options.sort(() => Math.random() - 0.5);

    // Render buttons
    $("#options").html("");
    options.forEach(g => {
        $("#options").append(
            `<button onclick="checkAnswer('${g}')">${g}</button>`
        );
    });

    // Update round counter if element exists
    $("#round").text(`Round ${roundsPlayed + 1} / ${MAX_ROUNDS}`);
}

function checkAnswer(choice) {
    // Disable buttons so they can't click again before Next
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
    // Save score to localStorage
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ name: "Player", score: score });
    localStorage.setItem("scores", JSON.stringify(scores));

    // Show end screen
    $("#gameSection").html(`
        <h2>Game Over!</h2>
        <p>Your final score: <strong>${score} / ${MAX_ROUNDS}</strong></p>
        <a href="scoreboard.html"><button>View Scoreboard</button></a>
        <button onclick="location.reload()">Play Again</button>
    `);
}