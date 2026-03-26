import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Trophy, Star, Heart, Calendar, Medal, Award } from "lucide-react";
import { getTopScores, getScoresByDifficulty, getFavorites, GameScore, FavoriteSong } from "../utils/storage";

export function Scoreboard() {
  const [topScores, setTopScores] = useState<GameScore[]>([]);
  const [easyScores, setEasyScores] = useState<GameScore[]>([]);
  const [mediumScores, setMediumScores] = useState<GameScore[]>([]);
  const [hardScores, setHardScores] = useState<GameScore[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<FavoriteSong[]>([]);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = () => {
    setTopScores(getTopScores(10));
    setEasyScores(getScoresByDifficulty('easy').sort((a, b) => b.score - a.score).slice(0, 10));
    setMediumScores(getScoresByDifficulty('medium').sort((a, b) => b.score - a.score).slice(0, 10));
    setHardScores(getScoresByDifficulty('hard').sort((a, b) => b.score - a.score).slice(0, 10));
    setFavoriteSongs(getFavorites());
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-orange-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{index + 1}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const ScoreList = ({ scores }: { scores: GameScore[] }) => (
    <div className="space-y-3">
      {scores.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No scores yet. Play a game to get started!</p>
        </div>
      ) : (
        scores.map((score, index) => (
          <motion.div
            key={score.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {getMedalIcon(index)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs capitalize ${
                        score.difficulty === 'easy' 
                          ? 'text-green-400 border-green-400/50'
                          : score.difficulty === 'medium'
                          ? 'text-yellow-400 border-yellow-400/50'
                          : 'text-red-400 border-red-400/50'
                      }`}
                    >
                      {score.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(score.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-300">
                      <Star className="w-4 h-4 inline mr-1 text-yellow-400" />
                      {score.correctAnswers}/{score.totalQuestions} correct
                    </span>
                    <span className="text-gray-400">
                      {Math.round((score.correctAnswers / score.totalQuestions) * 100)}% accuracy
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">{score.score}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Scoreboard & Favorites
        </h1>
        <p className="text-xl text-gray-300">
          Track your progress and revisit your favorite songs
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-sm border border-white/10 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
            All Scores
          </TabsTrigger>
          <TabsTrigger value="easy" className="data-[state=active]:bg-green-600">
            Easy
          </TabsTrigger>
          <TabsTrigger value="medium" className="data-[state=active]:bg-yellow-600">
            Medium
          </TabsTrigger>
          <TabsTrigger value="hard" className="data-[state=active]:bg-red-600">
            Hard
          </TabsTrigger>
          <TabsTrigger value="favorites" className="data-[state=active]:bg-pink-600">
            <Heart className="w-4 h-4 mr-1" />
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Top Scores (All Difficulties)</h2>
            <ScoreList scores={topScores} />
          </motion.div>
        </TabsContent>

        <TabsContent value="easy">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Easy Mode High Scores</h2>
            <ScoreList scores={easyScores} />
          </motion.div>
        </TabsContent>

        <TabsContent value="medium">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Medium Mode High Scores</h2>
            <ScoreList scores={mediumScores} />
          </motion.div>
        </TabsContent>

        <TabsContent value="hard">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Hard Mode High Scores</h2>
            <ScoreList scores={hardScores} />
          </motion.div>
        </TabsContent>

        <TabsContent value="favorites">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Your Favorite Songs</h2>
            {favoriteSongs.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No favorites yet. Add songs from the playlist generator!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden hover:bg-white/10 transition-all">
                      <div className="relative aspect-square">
                        <img
                          src={song.coverImage}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-white mb-1 truncate">{song.title}</h3>
                        <p className="text-sm text-gray-400 mb-2 truncate">{song.artist}</p>
                        <Badge variant="secondary" className="text-xs">
                          {song.genre}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
