let songs = [];

// 🔥 LOAD JSON FIRST
$(document).ready(function () {
    $.getJSON("data/songs.json", function (data) {
        songs = data;
        console.log("Songs loaded:", songs);
    });
});

// 🔥 BUTTON FUNCTION (GLOBAL)
function generatePlaylist() {

    let type = $("#searchType").val();
    let input = $("#searchInput").val().toLowerCase();

    let results = songs
        .filter(song => {
          if (type === "genre") {
              return song.genre.toLowerCase().replace(" ", "")
                .includes(input.replace(" ", ""));
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
        $("#playlist").append(`
          <div class="song">
            <img src="${song.coverImage}" width="100">
            <p><strong>${song.title}</strong></p>
            <p>${song.artist}</p>
          </div>
`);
    });
}