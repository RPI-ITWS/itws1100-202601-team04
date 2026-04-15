let allSongs = [];

fetch('data/songs.json')
  .then(res => res.json())
  .then(data => {
    allSongs = data;
    console.log("Songs loaded:", allSongs.length);
  })
  .catch(err => console.error("Error loading songs:", err));
  