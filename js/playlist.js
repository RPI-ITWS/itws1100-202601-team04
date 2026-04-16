let songs = [];

// LOAD JSON FIRST
$(document).ready(function () {
    $.getJSON("data/songs.json", function (data) {
        songs = data;
        console.log("Songs loaded:", songs);
    });
});

// BUTTON FUNCTION (GLOBAL)
function generatePlaylist() {

    // safety check (prevents clicking too early)
    if (songs.length === 0) {
        alert("Songs are still loading...");
        return;
    }

    let type = $("#searchType").val();
    let input = $("#searchInput").val().toLowerCase();

    let results = songs
        .filter(song => {
            if (type === "genre") {
                return song.genre.toLowerCase().replace(/\s/g, "")
                    .includes(input.replace(/\s/g, ""));
            } else {
                return song.artist.toLowerCase().includes(input);
            }
        })
        .sort((a, b) => b.energy - a.energy)
        .slice(0, 10);

    displayPlaylist(results);
}

function displayPlaylist(list) {

    $("#playlist").html("");

    if (list.length === 0) {
        $("#playlist").append("<p>No songs found.</p>");
        return;
    }

    list.forEach(song => {

        // HANDLE MISSING / BAD IMAGES
        let imageSrc = song.coverImage && song.coverImage.trim() !== ""
            ? song.coverImage
            : "https://via.placeholder.com/100?text=No+Image";

        $("#playlist").append(`
            <div class="song">
                <img src="${imageSrc}" 
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/100?text=No+Image'">
                <div class="song-info">
                    <p class="title">${song.title}</p>
                    <p class="artist">${song.artist}</p>
                </div>
            </div>
        `);
    });
}