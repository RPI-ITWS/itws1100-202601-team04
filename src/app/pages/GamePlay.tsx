import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Check, X, Clock, Star } from "lucide-react";
import { songs, GENRES, Song } from "../data/songs";
import { saveScore, saveGameState } from "../utils/storage";

type Difficulty = 'easy' | 'medium' | 'hard';

export function GamePlay() {
  const { difficulty } = useParams<{ difficulty: Difficulty }>();
  const navigate = useNavigate();
  
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameQuestions, setGameQuestions] = useState<Song[]>([]);
  const [genreOptions, setGenreOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [blurLevel, setBlurLevel] = useState(20);
  
  const totalRounds = 10;
  const currentSong = gameQuestions[currentRound];

  // Initialize game
  useEffect(() => {
    if (!difficulty) return;
    
    let genrePool: string[];
    
    if (difficulty === 'easy') {
      genrePool = ['Rock', 'Classical', 'Hip Hop'];
    } else if (difficulty === 'medium') {
      genrePool = ['Pop', 'Rock', 'Electronic', 'Hip Hop', 'Jazz', 'Country'];
    } else {
      genrePool = GENRES;
    }
    
    // Select random songs from the genre pool
    const filteredSongs = songs.filter(s => genrePool.includes(s.genre));
    const shuffled = [...filteredSongs].sort(() => 0.5 - Math.random());
    const selectedSongs = shuffled.slice(0, totalRounds);
    
    setGameQuestions(selectedSongs);
    setGenreOptions(genrePool);
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (showFeedback || !currentSong) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentRound, showFeedback, currentSong]);

  // Gradually reduce blur as time runs out
  useEffect(() => {
    const blurAmount = Math.max(5, (timeLeft / 20) * 20);
    setBlurLevel(blurAmount);
  }, [timeLeft]);

  const handleTimeout = () => {
    setIsCorrect(false);
    setShowFeedback(true);
    setTimeout(() => nextRound(), 2000);
  };

  const handleAnswer = (genre: string) => {
    if (showFeedback || selectedAnswer) return;
    
    setSelectedAnswer(genre);
    const correct = genre === currentSong.genre;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      // Score based on time remaining (max 100 points per question)
      const timeBonus = Math.floor((timeLeft / 20) * 100);
      setScore(prev => prev + timeBonus);
    }
    
    setTimeout(() => nextRound(), 2500);
  };

  const nextRound = () => {
    if (currentRound + 1 >= totalRounds) {
      finishGame();
    } else {
      setCurrentRound(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(20);
    }
  };

  const finishGame = () => {
    // Save score
    if (difficulty) {
      saveScore({
        difficulty,
        score,
        correctAnswers,
        totalQuestions: totalRounds
      });
      
      // Save to session for results page
      saveGameState({
        difficulty,
        score,
        correctAnswers,
        totalQuestions: totalRounds
      });
    }
    
    navigate('/results');
  };

  if (!currentSong) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-white">
              <span className="text-sm text-gray-400">Round</span>
              <div className="text-2xl font-bold">{currentRound + 1}/{totalRounds}</div>
            </div>
            <div className="text-white">
              <span className="text-sm text-gray-400">Score</span>
              <div className="text-2xl font-bold text-purple-400">{score}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5" />
            <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        
        <Progress value={(currentRound / totalRounds) * 100} className="h-2" />
      </div>

      {/* Album Cover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        key={currentRound}
        className="mb-8"
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 overflow-hidden">
          <div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden mb-6">
            <motion.img
              src={currentSong.coverImage}
              alt="Album cover"
              className="w-full h-full object-cover"
              style={{ filter: `blur(${blurLevel}px)` }}
              animate={{ filter: `blur(${blurLevel}px)` }}
            />
            
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 flex items-center justify-center ${
                    isCorrect ? 'bg-green-500/80' : 'bg-red-500/80'
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                  >
                    {isCorrect ? (
                      <Check className="w-24 h-24 text-white" />
                    ) : (
                      <X className="w-24 h-24 text-white" />
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white mb-4"
            >
              <div className="text-xl font-bold mb-2">
                {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
              </div>
              <div className="text-gray-300">
                <strong>{currentSong.title}</strong> by {currentSong.artist}
              </div>
              <div className="text-sm text-gray-400">Genre: {currentSong.genre}</div>
            </motion.div>
          )}
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              What genre is this song?
            </h2>
            <p className="text-gray-400">The image will become clearer over time</p>
          </div>

          {/* Genre Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {genreOptions.map((genre) => {
              const isSelected = selectedAnswer === genre;
              const isCorrectGenre = genre === currentSong.genre;
              const showCorrect = showFeedback && isCorrectGenre;
              const showWrong = showFeedback && isSelected && !isCorrect;
              
              return (
                <motion.div
                  key={genre}
                  whileHover={{ scale: showFeedback ? 1 : 1.05 }}
                  whileTap={{ scale: showFeedback ? 1 : 0.95 }}
                >
                  <Button
                    onClick={() => handleAnswer(genre)}
                    disabled={showFeedback}
                    className={`w-full h-16 text-lg font-medium transition-all ${
                      showCorrect
                        ? 'bg-green-500 hover:bg-green-500 text-white'
                        : showWrong
                        ? 'bg-red-500 hover:bg-red-500 text-white'
                        : isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {showCorrect && <Check className="w-5 h-5 mr-2" />}
                    {showWrong && <X className="w-5 h-5 mr-2" />}
                    {genre}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
