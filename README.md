# itws1100-202601-team04

## Sec01 Team 4

### Team Members
- @low-bar - Kevin Chen
- @dandrecollins07-ctrl - D'Andre Collins
- @nathenpride - Nathen Pride

### Course
**INTRO TO IT & WEB SCIENCE** - Spring 2026

---
*Repository created by STRIDE LMS*

---

# MusiQuest

A browser-based music web app that lets you generate playlists and test your music knowledge through mini-games.

---

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installs, no dependencies, no server required

---

## How to Run

1. Download or clone the repository
2. Open `index.html` in your browser
3. All features load from there

---

## File Structure

```
itws1100-202601-team04/
├── index.html              # Entry point
├── styles.css              # Global styles
├── data/
│   ├── songs.js            # Song dataset (150+ tracks)
│   └── songs.json          # Song dataset (JSON format)
├── js/
│   ├── main.js             # App initialization
│   ├── router.js           # Page routing
│   ├── playlist.js         # Playlist generation logic
│   ├── game.js             # Genre guessing game logic
│   ├── songGame.js         # Song guessing game logic
│   ├── scoreboard.js       # Score display
│   ├── favorites.js        # Favorites management
│   └── storage.js          # localStorage utilities
└── pages/
    ├── playlist.html
    ├── game.html
    ├── scoreboard.html
    ├── favorites.html
    └── games/
        ├── genre-game.html
        └── song-game.html
```

---

## Features

### Playlist Generator
- Navigate to **Playlist Generator** from the nav bar
- Select a search type: Genre, Artist, Song/Album, or Mood
- Enter a value and click **Generate Playlist**
- The app returns up to 12 matched and similar songs

**Valid search examples:**

| Type | Example Input |
|------|--------------|
| Genre | Hip Hop, Pop, R&B, Latin, Country, K-Pop, Afrobeats, Indie Rock, Indie Pop, Indie Folk, Country Pop |
| Mood | aggressive, chill, confident, dark, happy, melancholy, romantic |
| Artist | Kendrick Lamar, Drake, Taylor Swift |
| Song | Not Like Us, Squabble Up |

### Mini-Games
- Navigate to **Play Game** from the nav bar
- Choose **Guess the Genre** or **Guess the Song**
- Select a difficulty: Easy, Medium, or Hard
- Higher difficulty increases album cover blur
- Answer faster to earn more points (timer-based scoring)

### Scoreboard
- Scores are saved automatically via localStorage
- Navigate to **Scoreboard** to view your high scores
- Scores persist across sessions until you clear your browser data

### Favorites
- Click the heart icon on any playlist card to save a song
- Navigate to **Favorites** to view saved songs

---

## Notes

- Built with vanilla HTML, CSS, and JavaScript only
- No frameworks, no backend, no database
- Audio previews are sourced from the iTunes API (30-second clips)
- Scores and favorites are stored in your browser's localStorage; clearing browser data will reset them