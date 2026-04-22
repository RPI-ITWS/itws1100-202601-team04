// Favorites Logic

function loadFavorites() {
    const favorites = getFavorites();
    const container = document.getElementById('favorites-grid');
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">❤️</span>
                <h3>No Favorites Yet</h3>
                <p>Add songs to your favorites from the Playlist Generator</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    favorites.forEach((song, index) => {
        const card = createFavoriteCard(song, index);
        container.appendChild(card);
    });
}

function createFavoriteCard(song, index) {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.style.animation = `fadeIn 0.5s ease ${index * 0.05}s both`;
    
    card.innerHTML = `
        <div style="position: relative;">
            <img src="${song.coverImage}" alt="${song.title}" class="playlist-card-image">
            <div class="playlist-card-overlay">
                <button class="btn-icon" onclick="playPreview('${song.id}')" title="Play Preview">
                    ▶️
                </button>
                <button class="btn-icon favorited" 
                        onclick="removeFavoriteAndRefresh('${song.id}')" 
                        title="Remove from favorites">
                    ❤️
                </button>
            </div>
        </div>
        <div class="playlist-card-content">
            <h3>${song.title}</h3>
            <p class="playlist-card-artist">${song.artist}</p>
            <div class="playlist-card-badges">
                <span class="badge badge-genre">${song.genre}</span>
            </div>
        </div>
    `;
    
    return card;
}

function removeFavoriteAndRefresh(songId) {
    removeFavorite(songId);
    loadFavorites();
}
