let songs = [];
let currentSong = null;
let score = 0;


function startGame(difficulty) {
    $("#gameSection").show();
    nextRound();
}


// LOAD DATA
$(document).ready(function () {
    $.getJSON("data/songs.json", function (data) {
        songs = data;
        nextRound();
    });
});

function nextRound() {
    $("#result").text("");

    // pick random song
    currentSong = songs[Math.floor(Math.random() * songs.length)];

    // show cover
    $("#cover")
        .attr("src", currentSong.coverImage)
        .on("error", function () {
        $(this).attr("src", "https://via.placeholder.com/200?text=No+Image");
  });

    // generate options
    let genres = ["Hip Hop", "Pop", "Rock", "R&B"];
    let correct = currentSong.genre;

    // make sure correct answer is included
    if (!genres.includes(correct)) {
        genres[0] = correct;
    }

    // shuffle options
    genres.sort(() => Math.random() - 0.5);

    // display buttons
    $("#options").html("");
    genres.forEach(g => {
        $("#options").append(`
            <button onclick="checkAnswer('${g}')">${g}</button>
        `);
    });
}

function checkAnswer(choice) {
    if (choice === currentSong.genre) {
        score++;
        $("#result").text("✅ Correct!");
    } else {
        $("#result").text("❌ Wrong! It was " + currentSong.genre);
    }

    $("#score").text(score);
}
