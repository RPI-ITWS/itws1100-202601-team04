// Playlist Generator — searches the song database and pads results with energy/tempo-similar songs

// Fills the genre <select> from the GENRES array (runs once; skips if already populated)
function initPlaylistGenerator() {
    const genreSelect = document.getElementById('genre-select');
    if (genreSelect.options.length === 1) {
        GENRES.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
    }
}

// Swaps between the genre <select> and a free-text <input> depending on search mode
function updateSearchInput() {
    const searchType = document.getElementById('search-type').value;
    const genreSelect = document.getElementById('genre-select');
    const searchInput = document.getElementById('search-input');
    const label = document.getElementById('search-label');

    if (searchType === 'genre') {
        genreSelect.classList.remove('hidden');
        searchInput.classList.add('hidden');
        label.textContent = 'Select Genre';
    } else {
        genreSelect.classList.add('hidden');
        searchInput.classList.remove('hidden');

        switch(searchType) {
            case 'artist':
                label.textContent = 'Artist Name';
                searchInput.placeholder = 'Enter artist name...';
                break;
            case 'song':
                label.textContent = 'Song or Album Name';
                searchInput.placeholder = 'Enter song or album...';
                break;
            case 'mood':
                label.textContent = 'Mood';
                searchInput.placeholder = 'e.g., energetic, chill, happy...';
                break;
        }
    }
}

// Finds matching songs, then pads the list with energy/tempo-similar songs, capped at 12
function generatePlaylist() {
    const searchType = document.getElementById('search-type').value;
    let query = '';

    if (searchType === 'genre') {
        query = document.getElementById('genre-select').value;
    } else {
        query = document.getElementById('search-input').value.trim();
    }

    if (!query) {
        alert('Please enter a search term or select a genre');
        return;
    }

    let filtered = [];

    switch(searchType) {
        case 'genre':
            filtered = songs.filter(s => s.genre === query);
            break;
        case 'artist':
            filtered = songs.filter(s =>
                s.artist.toLowerCase().includes(query.toLowerCase())
            );
            break;
        case 'song':
            filtered = songs.filter(s =>
                s.title.toLowerCase().includes(query.toLowerCase()) ||
                s.album.toLowerCase().includes(query.toLowerCase())
            );
            break;
        case 'mood':
            filtered = songs.filter(s =>
                s.mood.toLowerCase().includes(query.toLowerCase())
            );
            break;
    }

    // Expand the list by finding songs with similar energy (±2) and tempo (±20 BPM)
    if (filtered.length > 0) {
        const baseSong = filtered[0];
        const similar = songs.filter(s => {
            const energyDiff = Math.abs(s.energy - baseSong.energy);
            const tempoDiff = Math.abs(s.tempo - baseSong.tempo);
            return energyDiff <= 2 && tempoDiff <= 20 && s.id !== baseSong.id;
        });

        // Merge, deduplicate by id, shuffle, and cap at 12 cards
        const combined = [...filtered, ...similar];
        const uniqueMap = new Map();
        combined.forEach(song => uniqueMap.set(song.id, song));
        const unique = Array.from(uniqueMap.values());

        const shuffled = unique.sort(() => 0.5 - Math.random());
        displayPlaylist(shuffled.slice(0, 12));
    } else {
        displayPlaylist([]);
    }
}

function displayPlaylist(playlist) {
    const resultsContainer = document.getElementById('playlist-results');

    if (playlist.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🎵</span>
                <h3>No Results Found</h3>
                <p>Try a different search term</p>
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = `
        <div class="playlist-header">
            <h2>Your Playlist (${playlist.length} songs)</h2>
            <div class="badge">🎵 Personalized</div>
        </div>
        <div class="playlist-grid" id="playlist-grid"></div>
    `;

    const grid = document.getElementById('playlist-grid');

    playlist.forEach((song, index) => {
        const card = createSongCard(song, index);
        grid.appendChild(card);
    });
}

// Builds a song card with cover art, play/favorite buttons, and metadata badges
function createSongCard(song, index) {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.style.animation = `fadeIn 0.5s ease ${index * 0.05}s both`;

    const favorited = isFavorite(song.id);

    card.innerHTML = `
        <div style="position: relative;">
            <img src="${song.coverImage}" alt="${song.title}" class="playlist-card-image">
            <div class="playlist-card-overlay">
                <button class="btn-icon" onclick="playPreview('${song.id}')" title="Play Preview">
                    ▶️
                </button>
                <button class="btn-icon ${favorited ? 'favorited' : ''}"
                        onclick="toggleFavorite('${song.id}')"
                        title="${favorited ? 'Remove from favorites' : 'Add to favorites'}">
                    ${favorited ? '❤️' : '🤍'}
                </button>
            </div>
        </div>
        <div class="playlist-card-content">
            <h3>${song.title}</h3>
            <p class="playlist-card-artist">${song.artist}</p>
            <div class="playlist-card-badges">
                <span class="badge badge-genre">${song.genre}</span>
                <span class="badge badge-mood">${song.mood}</span>
            </div>
            <div class="playlist-card-meta">
                <span>Energy: ${song.energy}/10</span>
                <span>BPM: ${song.tempo}</span>
            </div>
        </div>
    `;

    return card;
}

// Uses audioPreviewUrl (separate from game's previewUrl) to play a clip inline
function playPreview(songId) {
    const song = songs.find(s => s.id === songId);
    if (song && song.audioPreviewUrl) {
        const audio = new Audio(song.audioPreviewUrl);
        audio.play();
    } else {
        alert('Audio preview not available (demo mode)');
    }
}

// Saves/removes from favorites, then re-renders the playlist and favorites page if open
function toggleFavorite(songId) {
    const song = songs.find(s => s.id === songId);

    if (isFavorite(songId)) {
        removeFavorite(songId);
    } else {
        addFavorite(song);
    }

    if (document.getElementById('playlist-grid')) {
        generatePlaylist();
    }

    if (window.location.hash === '#favorites') {
        loadFavorites();
    }
}
