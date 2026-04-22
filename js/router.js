// Router - Handle page navigation

function navigateTo(hash) {
    window.location.hash = hash;
}

function handleRoute() {
    const hash = window.location.hash || '#home';
    const page = hash.substring(1); // Remove the #

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });

    // Show the current page
    const pageElement = document.getElementById(`${page}-page`);
    if (pageElement) {
        pageElement.classList.add('active');
    } else {
        // Fallback to home
        const homePage = document.getElementById('home-page');
        if (homePage) homePage.classList.add('active');
    }

    // Load page-specific content
    if (page === 'scoreboard') {
        if (typeof loadScoreboard === 'function') loadScoreboard();
    } else if (page === 'favorites') {
        if (typeof loadFavorites === 'function') loadFavorites();
    } else if (page === 'playlist') {
        if (typeof initPlaylistGenerator === 'function') initPlaylistGenerator();
    }
}

// Listen for hash changes
window.addEventListener('hashchange', handleRoute);

// Run after DOM is ready (works whether loaded via script tag or dynamically)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleRoute);
} else {
    // DOM already ready (dynamic script load after React render)
    handleRoute();
}
