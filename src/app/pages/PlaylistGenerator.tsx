import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Search, Music, Heart, Play, Sparkles } from "lucide-react";
import { songs, GENRES, Song } from "../data/songs";
import { addFavorite, removeFavorite, isFavorite } from "../utils/storage";

export function PlaylistGenerator() {
  const [searchType, setSearchType] = useState<'genre' | 'artist' | 'song' | 'mood'>('genre');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleGeneratePlaylist = () => {
    let filtered: Song[] = [];
    
    if (searchType === 'genre' && selectedGenre) {
      filtered = songs.filter(s => s.genre === selectedGenre);
    } else if (searchType === 'artist' && searchQuery) {
      filtered = songs.filter(s => 
        s.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (searchType === 'song' && searchQuery) {
      filtered = songs.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (searchType === 'mood' && searchQuery) {
      filtered = songs.filter(s => 
        s.mood.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // If we have results, add similar songs based on energy and tempo
    if (filtered.length > 0) {
      const baseSong = filtered[0];
      const similar = songs.filter(s => {
        const energyDiff = Math.abs(s.energy - baseSong.energy);
        const tempoDiff = Math.abs(s.tempo - baseSong.tempo);
        return energyDiff <= 2 && tempoDiff <= 20 && s.id !== baseSong.id;
      });
      
      // Combine and remove duplicates using a Set based on song ID
      const combined = [...filtered, ...similar];
      const uniqueSongs = Array.from(
        new Map(combined.map(song => [song.id, song])).values()
      );
      
      // Shuffle and limit
      const shuffled = uniqueSongs.sort(() => 0.5 - Math.random());
      setPlaylist(shuffled.slice(0, 12));
    } else {
      setPlaylist([]);
    }
  };

  const toggleFavorite = (song: Song) => {
    const songId = song.id;
    if (isFavorite(songId)) {
      removeFavorite(songId);
      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(songId);
        return newSet;
      });
    } else {
      addFavorite({
        id: song.id,
        title: song.title,
        artist: song.artist,
        genre: song.genre,
        coverImage: song.coverImage
      });
      setFavorites(prev => new Set(prev).add(songId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Playlist Generator
        </h1>
        <p className="text-xl text-gray-300">
          Discover new music based on your preferences
        </p>
      </motion.div>

      {/* Search Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-white mb-2 block">Search By</Label>
              <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="genre">Genre</SelectItem>
                  <SelectItem value="artist">Artist</SelectItem>
                  <SelectItem value="song">Song/Album</SelectItem>
                  <SelectItem value="mood">Mood</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              {searchType === 'genre' ? (
                <>
                  <Label className="text-white mb-2 block">Select Genre</Label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Choose a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <>
                  <Label className="text-white mb-2 block">
                    {searchType === 'artist' && 'Artist Name'}
                    {searchType === 'song' && 'Song or Album Name'}
                    {searchType === 'mood' && 'Mood (e.g., energetic, chill, happy)'}
                  </Label>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Enter ${searchType}...`}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    onKeyDown={(e) => e.key === 'Enter' && handleGeneratePlaylist()}
                  />
                </>
              )}
            </div>
          </div>

          <Button
            onClick={handleGeneratePlaylist}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Generate Playlist
          </Button>
        </Card>
      </motion.div>

      {/* Playlist Results */}
      <AnimatePresence mode="wait">
        {playlist.length > 0 ? (
          <motion.div
            key="playlist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Your Playlist ({playlist.length} songs)
              </h2>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                <Music className="w-4 h-4 mr-1" />
                Personalized
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlist.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden hover:bg-white/10 transition-all group">
                    <div className="relative aspect-square">
                      <img
                        src={song.coverImage}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          className="bg-white/20 hover:bg-white/30"
                          onClick={() => {}}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={isFavorite(song.id) ? "default" : "outline"}
                          className={isFavorite(song.id) ? "bg-pink-500 hover:bg-pink-600" : "bg-white/20 hover:bg-white/30"}
                          onClick={() => toggleFavorite(song)}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite(song.id) ? 'fill-white' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-1 truncate">{song.title}</h3>
                      <p className="text-sm text-gray-400 mb-2 truncate">{song.artist}</p>
                      
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {song.genre}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/50">
                          {song.mood}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 flex gap-4 text-xs text-gray-500">
                        <span>Energy: {song.energy}/10</span>
                        <span>BPM: {song.tempo}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <Music className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Playlist Yet</h3>
            <p className="text-gray-400">
              Use the search above to generate a personalized playlist
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-3">How It Works</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span><strong>Genre:</strong> Find songs from your favorite music genre</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span><strong>Artist:</strong> Discover songs by searching for artist names</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span><strong>Song/Album:</strong> Search by song title or album name</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span><strong>Mood:</strong> Find music that matches your current vibe (energetic, chill, happy, etc.)</span>
          </li>
        </ul>
        <p className="mt-4 text-sm text-gray-400">
          Our algorithm finds similar songs based on energy levels, tempo, and genre to create the perfect playlist for you!
        </p>
      </motion.div>
    </div>
  );
}