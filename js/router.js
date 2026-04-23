// Hash-based SPA router — each page is a <section class="page"> toggled with .active

// Changing the hash triggers hashchange, which calls handleRoute
function navigateTo(hash) {
    window.location.hash = hash;
}

function handleRoute() {
    const hash = window.location.hash || '#home';
    const page = hash.substring(1); // strip the leading #

    // Hide every page, then reveal only the matching one
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });

    // Highlight the nav link whose href matches the current hash
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });

    // Show the target page; fall back to home if the id doesn't exist
    const pageElement = document.getElementById(`${page}-page`);
    if (pageElement) {
        pageElement.classList.add('active');
    } else {
        const homePage = document.getElementById('home-page');
        if (homePage) homePage.classList.add('active');
    }

    // Some pages need fresh data pulled from localStorage on every visit
    if (page === 'scoreboard') {
        if (typeof loadScoreboard === 'function') loadScoreboard();
    } else if (page === 'favorites') {
        if (typeof loadFavorites === 'function') loadFavorites();
    } else if (page === 'playlist') {
        if (typeof initPlaylistGenerator === 'function') initPlaylistGenerator();
    }
}

// Re-run routing whenever the URL hash changes (back/forward or navigateTo calls)
window.addEventListener('hashchange', handleRoute);

// Run after DOM is ready (works whether loaded via script tag or dynamically)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleRoute);
} else {
    // DOM already ready (dynamic script load after React render)
    handleRoute();
}
