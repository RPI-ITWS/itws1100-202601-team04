// Local storage utilities for game data

export interface GameScore {
  id: string;
  difficulty: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  date: string;
}

export interface FavoriteSong {
  id: string;
  title: string;
  artist: string;
  genre: string;
  coverImage: string;
  dateAdded: string;
}

const SCORES_KEY = 'musicquest_scores';
const FAVORITES_KEY = 'musicquest_favorites';

// Score management
export const saveScore = (score: Omit<GameScore, 'id' | 'date'>): void => {
  const scores = getScores();
  const newScore: GameScore = {
    ...score,
    id: Date.now().toString(),
    date: new Date().toISOString()
  };
  scores.push(newScore);
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
};

export const getScores = (): GameScore[] => {
  const data = localStorage.getItem(SCORES_KEY);
  return data ? JSON.parse(data) : [];
};

export const getTopScores = (limit: number = 10): GameScore[] => {
  return getScores()
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const getScoresByDifficulty = (difficulty: string): GameScore[] => {
  return getScores().filter(s => s.difficulty === difficulty);
};

// Favorites management
export const addFavorite = (song: Omit<FavoriteSong, 'dateAdded'>): void => {
  const favorites = getFavorites();
  
  // Check if already favorited
  if (favorites.some(f => f.id === song.id)) {
    return;
  }
  
  const newFavorite: FavoriteSong = {
    ...song,
    dateAdded: new Date().toISOString()
  };
  
  favorites.push(newFavorite);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const removeFavorite = (songId: string): void => {
  const favorites = getFavorites();
  const filtered = favorites.filter(f => f.id !== songId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
};

export const getFavorites = (): FavoriteSong[] => {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
};

export const isFavorite = (songId: string): boolean => {
  return getFavorites().some(f => f.id === songId);
};

// Game state management
export const saveGameState = (state: any): void => {
  sessionStorage.setItem('current_game', JSON.stringify(state));
};

export const getGameState = (): any => {
  const data = sessionStorage.getItem('current_game');
  return data ? JSON.parse(data) : null;
};

export const clearGameState = (): void => {
  sessionStorage.removeItem('current_game');
};
