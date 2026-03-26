// Song database with metadata for the music game and playlist generator

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  energy: number; // 1-10
  tempo: number; // BPM
  mood: string;
  year: number;
  coverImage: string;
  // Note: In a real app, this would be actual audio URLs
  audioPreviewUrl?: string;
}

export const GENRES = [
  'Hip Hop',
  'Rock',
  'Electronic',
  'Jazz',
  'Pop',
  'Classical',
  'Country',
  'R&B/Soul',
  'Reggae',
  'Indie',
  'Metal',
  'Disco'
];

export const songs: Song[] = [
  // Hip Hop
  {
    id: 'hh1',
    title: 'Street Dreams',
    artist: 'MC Flow',
    album: 'Urban Chronicles',
    genre: 'Hip Hop',
    energy: 8,
    tempo: 95,
    mood: 'energetic',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1773408285355-a1d4a141ea1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjBoaXAlMjBob3B8ZW58MXx8fHwxNzc0MjQ1Mjc2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'hh2',
    title: 'City Lights',
    artist: 'Jay Beats',
    album: 'Midnight Sessions',
    genre: 'Hip Hop',
    energy: 7,
    tempo: 88,
    mood: 'chill',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1773408285355-a1d4a141ea1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjBoaXAlMjBob3B8ZW58MXx8fHwxNzc0MjQ1Mjc2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'hh3',
    title: 'Rhythm & Rhymes',
    artist: 'K-Fresh',
    album: 'The Awakening',
    genre: 'Hip Hop',
    energy: 9,
    tempo: 102,
    mood: 'hype',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1773408285355-a1d4a141ea1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjBoaXAlMjBob3B8ZW58MXx8fHwxNzc0MjQ1Mjc2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // Rock
  {
    id: 'r1',
    title: 'Thunder Road',
    artist: 'The Renegades',
    album: 'Electric Nights',
    genre: 'Rock',
    energy: 10,
    tempo: 138,
    mood: 'intense',
    year: 2021,
    coverImage: 'https://images.unsplash.com/photo-1590310182704-037fe3509ada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwbXVzaWMlMjBhbGJ1bXxlbnwxfHx8fDE3NzQyNzM4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'r2',
    title: 'Broken Strings',
    artist: 'Stone Hearts',
    album: 'Revival',
    genre: 'Rock',
    energy: 7,
    tempo: 120,
    mood: 'melancholic',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1590310182704-037fe3509ada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwbXVzaWMlMjBhbGJ1bXxlbnwxfHx8fDE3NzQyNzM4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'r3',
    title: 'Wildfire',
    artist: 'The Outcasts',
    album: 'Unchained',
    genre: 'Rock',
    energy: 9,
    tempo: 145,
    mood: 'rebellious',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1590310182704-037fe3509ada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwbXVzaWMlMjBhbGJ1bXxlbnwxfHx8fDE3NzQyNzM4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // Electronic
  {
    id: 'e1',
    title: 'Digital Dreams',
    artist: 'Synthwave',
    album: 'Neon Future',
    genre: 'Electronic',
    energy: 8,
    tempo: 128,
    mood: 'uplifting',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1623171826791-b2b77127b589?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjB2aW55bHxlbnwxfHx8fDE3NzQyMjgwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'e2',
    title: 'Pulse',
    artist: 'DJ Nexus',
    album: 'Frequency',
    genre: 'Electronic',
    energy: 9,
    tempo: 140,
    mood: 'energetic',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1623171826791-b2b77127b589?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjB2aW55bHxlbnwxfHx8fDE3NzQyMjgwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'e3',
    title: 'Midnight Circuit',
    artist: 'Electra',
    album: 'Binary Code',
    genre: 'Electronic',
    energy: 7,
    tempo: 110,
    mood: 'atmospheric',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1623171826791-b2b77127b589?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjB2aW55bHxlbnwxfHx8fDE3NzQyMjgwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // Jazz
  {
    id: 'j1',
    title: 'Blue Monday',
    artist: 'The Jazz Cats',
    album: 'Smooth Grooves',
    genre: 'Jazz',
    energy: 5,
    tempo: 92,
    mood: 'relaxed',
    year: 2020,
    coverImage: 'https://images.unsplash.com/photo-1626814878403-b014e6cd54ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWMlMjBjb25jZXJ0fGVufDF8fHx8MTc3NDI4NzA4N3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'j2',
    title: 'Sunset Boulevard',
    artist: 'Miles Ahead',
    album: 'Kind of Blue',
    genre: 'Jazz',
    energy: 4,
    tempo: 85,
    mood: 'mellow',
    year: 2021,
    coverImage: 'https://images.unsplash.com/photo-1626814878403-b014e6cd54ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWMlMjBjb25jZXJ0fGVufDF8fHx8MTc3NDI4NzA4N3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'j3',
    title: 'Swing Time',
    artist: 'Big Band Express',
    album: 'Live at the Apollo',
    genre: 'Jazz',
    energy: 6,
    tempo: 105,
    mood: 'upbeat',
    year: 2019,
    coverImage: 'https://images.unsplash.com/photo-1626814878403-b014e6cd54ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWMlMjBjb25jZXJ0fGVufDF8fHx8MTc3NDI4NzA4N3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // Pop
  {
    id: 'p1',
    title: 'Summer Nights',
    artist: 'Luna Star',
    album: 'Starlight',
    genre: 'Pop',
    energy: 8,
    tempo: 125,
    mood: 'happy',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1760931657876-116605bd9dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpYyUyMGNvbG9yZnVsfGVufDF8fHx8MTc3NDI2MTE3Nnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'p2',
    title: 'Heartbeat',
    artist: 'Aria Sky',
    album: 'Love & Light',
    genre: 'Pop',
    energy: 7,
    tempo: 118,
    mood: 'romantic',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1760931657876-116605bd9dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpYyUyMGNvbG9yZnVsfGVufDF8fHx8MTc3NDI2MTE3Nnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'p3',
    title: 'Dancing Queen',
    artist: 'Pop Royalty',
    album: 'Pure Pop',
    genre: 'Pop',
    energy: 9,
    tempo: 130,
    mood: 'joyful',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1760931657876-116605bd9dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpYyUyMGNvbG9yZnVsfGVufDF8fHx8MTc3NDI2MTE3Nnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // Classical
  {
    id: 'c1',
    title: 'Symphony No. 5',
    artist: 'Vienna Orchestra',
    album: 'Classical Masterpieces',
    genre: 'Classical',
    energy: 6,
    tempo: 108,
    mood: 'dramatic',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1519683384663-c9b34271669a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljYWwlMjBtdXNpYyUyMG9yY2hlc3RyYXxlbnwxfHx8fDE3NzQyODUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'c2',
    title: 'Moonlight Sonata',
    artist: 'Classical Ensemble',
    album: 'Piano Dreams',
    genre: 'Classical',
    energy: 3,
    tempo: 72,
    mood: 'peaceful',
    year: 2021,
    coverImage: 'https://images.unsplash.com/photo-1519683384663-c9b34271669a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljYWwlMjBtdXNpYyUyMG9yY2hlc3RyYXxlbnwxfHx8fDE3NzQyODUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'c3',
    title: 'Four Seasons',
    artist: 'Royal Philharmonic',
    album: 'Baroque Collection',
    genre: 'Classical',
    energy: 5,
    tempo: 96,
    mood: 'elegant',
    year: 2020,
    coverImage: 'https://images.unsplash.com/photo-1519683384663-c9b34271669a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljYWwlMjBtdXNpYyUyMG9yY2hlc3RyYXxlbnwxfHx8fDE3NzQyODUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // Country
  {
    id: 'co1',
    title: 'Country Roads',
    artist: 'The Nashville Stars',
    album: 'Homeward Bound',
    genre: 'Country',
    energy: 6,
    tempo: 110,
    mood: 'nostalgic',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1657288281043-6420eaa85139?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VudHJ5JTIwbXVzaWMlMjBndWl0YXJ8ZW58MXx8fHwxNzc0MTc0OTE4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'co2',
    title: 'Backroad Blues',
    artist: 'Johnny Rivers',
    album: 'Southern Comfort',
    genre: 'Country',
    energy: 5,
    tempo: 95,
    mood: 'reflective',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1657288281043-6420eaa85139?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VudHJ5JTIwbXVzaWMlMjBndWl0YXJ8ZW58MXx8fHwxNzc0MTc0OTE4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'co3',
    title: 'Honky Tonk Woman',
    artist: 'The Outlaws',
    album: 'Wild West',
    genre: 'Country',
    energy: 7,
    tempo: 120,
    mood: 'lively',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1657288281043-6420eaa85139?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VudHJ5JTIwbXVzaWMlMjBndWl0YXJ8ZW58MXx8fHwxNzc0MTc0OTE4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // R&B/Soul
  {
    id: 'rb1',
    title: 'Smooth Operator',
    artist: 'Soul Siblings',
    album: 'Velvet Vibes',
    genre: 'R&B/Soul',
    energy: 6,
    tempo: 90,
    mood: 'smooth',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1770320606303-068d1ceb3c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxybmIlMjBzb3VsJTIwbXVzaWN8ZW58MXx8fHwxNzc0Mjg3MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'rb2',
    title: 'Late Night Love',
    artist: 'R&B Collective',
    album: 'After Dark',
    genre: 'R&B/Soul',
    energy: 5,
    tempo: 85,
    mood: 'sensual',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1770320606303-068d1ceb3c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxybmIlMjBzb3VsJTIwbXVzaWN8ZW58MXx8fHwxNzc0Mjg3MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'rb3',
    title: 'Feel Good',
    artist: 'The Soul Crew',
    album: 'Good Vibes Only',
    genre: 'R&B/Soul',
    energy: 7,
    tempo: 98,
    mood: 'uplifting',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1770320606303-068d1ceb3c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxybmIlMjBzb3VsJTIwbXVzaWN8ZW58MXx8fHwxNzc0Mjg3MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // Reggae
  {
    id: 'rg1',
    title: 'Island Breeze',
    artist: 'Tropical Roots',
    album: 'Caribbean Dreams',
    genre: 'Reggae',
    energy: 6,
    tempo: 80,
    mood: 'relaxed',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1746211992735-246218460067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWdnYWUlMjBtdXNpYyUyMHRyb3BpY2FsfGVufDF8fHx8MTc3NDI3MzkwM3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'rg2',
    title: 'One Love',
    artist: 'Unity Sound',
    album: 'Positive Vibrations',
    genre: 'Reggae',
    energy: 5,
    tempo: 75,
    mood: 'peaceful',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1746211992735-246218460067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWdnYWUlMjBtdXNpYyUyMHRyb3BpY2FsfGVufDF8fHx8MTc3NDI3MzkwM3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'rg3',
    title: 'Sunshine Dub',
    artist: 'Dub Masters',
    album: 'Bassline Culture',
    genre: 'Reggae',
    energy: 7,
    tempo: 90,
    mood: 'groovy',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1746211992735-246218460067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWdnYWUlMjBtdXNpYyUyMHRyb3BpY2FsfGVufDF8fHx8MTc3NDI3MzkwM3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // Indie
  {
    id: 'i1',
    title: 'Northern Lights',
    artist: 'The Wanderers',
    album: 'Lost & Found',
    genre: 'Indie',
    energy: 6,
    tempo: 115,
    mood: 'dreamy',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1504290206677-19b1f8f80231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGFsdGVybmF0aXZlJTIwbXVzaWN8ZW58MXx8fHwxNzc0Mjg3MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'i2',
    title: 'Basement Tapes',
    artist: 'Indie Collective',
    album: 'Raw & Unfiltered',
    genre: 'Indie',
    energy: 5,
    tempo: 100,
    mood: 'introspective',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1504290206677-19b1f8f80231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGFsdGVybmF0aXZlJTIwbXVzaWN8ZW58MXx8fHwxNzc0Mjg3MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'i3',
    title: 'Coffee Shop Chronicles',
    artist: 'Lo-Fi Dreams',
    album: 'Acoustic Sessions',
    genre: 'Indie',
    energy: 4,
    tempo: 92,
    mood: 'chill',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1504290206677-19b1f8f80231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGFsdGVybmF0aXZlJTIwbXVzaWN8ZW58MXx8fHwxNzc0Mjg3MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // Metal
  {
    id: 'm1',
    title: 'Iron Will',
    artist: 'Death Valley',
    album: 'Chaos Reigns',
    genre: 'Metal',
    energy: 10,
    tempo: 180,
    mood: 'aggressive',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1659017077136-ebd7091f61c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMG11c2ljJTIwZGFya3xlbnwxfHx8fDE3NzQyODcwODl8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'm2',
    title: 'Blackened Sky',
    artist: 'Doom Legion',
    album: 'Dark Horizons',
    genre: 'Metal',
    energy: 9,
    tempo: 160,
    mood: 'dark',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1659017077136-ebd7091f61c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMG11c2ljJTIwZGFya3xlbnwxfHx8fDE3NzQyODcwODl8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'm3',
    title: 'Thunder Strike',
    artist: 'Metal Gods',
    album: 'Storm of Steel',
    genre: 'Metal',
    energy: 10,
    tempo: 175,
    mood: 'powerful',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1659017077136-ebd7091f61c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMG11c2ljJTIwZGFya3xlbnwxfHx8fDE3NzQyODcwODl8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  
  // Disco
  {
    id: 'd1',
    title: 'Stayin\' Alive Tonight',
    artist: 'Disco Fever',
    album: 'Saturday Night',
    genre: 'Disco',
    energy: 9,
    tempo: 118,
    mood: 'groovy',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1503218751919-1ea90572e609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjbyUyMG11c2ljJTIwcGFydHl8ZW58MXx8fHwxNzc0Mjg3MDkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'd2',
    title: 'Boogie Wonderland',
    artist: 'Funk Express',
    album: 'Glitter & Groove',
    genre: 'Disco',
    energy: 8,
    tempo: 122,
    mood: 'funky',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1503218751919-1ea90572e609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjbyUyMG11c2ljJTIwcGFydHl8ZW58MXx8fHwxNzc0Mjg3MDkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'd3',
    title: 'Dance Floor Magic',
    artist: 'The Groove Machine',
    album: '70s Revival',
    genre: 'Disco',
    energy: 9,
    tempo: 125,
    mood: 'celebratory',
    year: 2024,
    coverImage: 'https://images.unsplash.com/photo-1503218751919-1ea90572e609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjbyUyMG11c2ljJTIwcGFydHl8ZW58MXx8fHwxNzc0Mjg3MDkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

// Helper function to get songs by genre
export const getSongsByGenre = (genre: string): Song[] => {
  return songs.filter(song => song.genre === genre);
};

// Helper function to get random song
export const getRandomSong = (): Song => {
  return songs[Math.floor(Math.random() * songs.length)];
};

// Helper function to get random songs by difficulty
export const getRandomSongsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Song[] => {
  let genrePool: string[];
  
  if (difficulty === 'easy') {
    // Easy: 3 very distinct genres
    genrePool = ['Rock', 'Classical', 'Hip Hop'];
  } else if (difficulty === 'medium') {
    // Medium: 6 somewhat related genres
    genrePool = ['Pop', 'Rock', 'Electronic', 'Hip Hop', 'Jazz', 'Country'];
  } else {
    // Hard: all genres
    genrePool = GENRES;
  }
  
  const shuffled = [...songs].filter(s => genrePool.includes(s.genre)).sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
};
