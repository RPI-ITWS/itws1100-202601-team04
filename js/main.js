// Entry point — runs once when the page loads, then hands off to the router

function initApp() {
    console.log('Music Playlist & Genre Guessing Game loaded!');
    console.log('Created by: Nathen Pride, Kevin Chen, D\'Andre Collins');

    // Lower volume so previews aren't jarring; disable looping
    const audio = document.getElementById('game-audio');
    if (audio) {
        audio.volume = 0.3;
        audio.loop   = false;
    }

    // Trigger the router so the correct page shows immediately on load
    if (typeof handleRoute === 'function') handleRoute();
}

// Works whether the DOM is already present (dynamic React-loaded script)
// or if the script loads before React finishes rendering (DOMContentLoaded)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Fisher-Yates shuffle — returns a new shuffled copy, never mutates the original
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
