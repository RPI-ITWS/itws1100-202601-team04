import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Trophy, Star, RotateCcw, Home, Music } from "lucide-react";
import { getGameState, clearGameState } from "../utils/storage";
import confetti from "canvas-confetti";

export function Results() {
  const navigate = useNavigate();
  const [gameResults, setGameResults] = useState<any>(null);

  useEffect(() => {
    const results = getGameState();
    if (!results) {
      navigate('/play');
      return;
    }
    
    setGameResults(results);
    
    // Fire confetti if score is good
    const percentage = (results.correctAnswers / results.totalQuestions) * 100;
    if (percentage >= 70) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 500);
    }
  }, [navigate]);

  const handlePlayAgain = () => {
    clearGameState();
    navigate('/play');
  };

  if (!gameResults) {
    return null;
  }

  const percentage = Math.round((gameResults.correctAnswers / gameResults.totalQuestions) * 100);
  
  let grade = '';
  let gradeColor = '';
  let message = '';
  
  if (percentage >= 90) {
    grade = 'S';
    gradeColor = 'from-yellow-400 to-orange-400';
    message = 'Outstanding! You\'re a music genre master! 🎵';
  } else if (percentage >= 80) {
    grade = 'A';
    gradeColor = 'from-green-400 to-emerald-400';
    message = 'Excellent work! You really know your music! 🎸';
  } else if (percentage >= 70) {
    grade = 'B';
    gradeColor = 'from-blue-400 to-cyan-400';
    message = 'Great job! Keep exploring more genres! 🎹';
  } else if (percentage >= 60) {
    grade = 'C';
    gradeColor = 'from-purple-400 to-pink-400';
    message = 'Good effort! Practice makes perfect! 🎤';
  } else {
    grade = 'D';
    gradeColor = 'from-gray-400 to-gray-500';
    message = 'Keep learning! Every master was once a beginner! 🎧';
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.3 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 md:p-12">
          {/* Grade Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${gradeColor} flex items-center justify-center shadow-2xl`}>
              <span className="text-6xl font-bold text-white">{grade}</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-3">
              Game Complete!
            </h1>
            <p className="text-xl text-gray-300">{message}</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-6 mb-8"
          >
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{gameResults.score}</div>
              <div className="text-sm text-gray-400">Total Score</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {gameResults.correctAnswers}/{gameResults.totalQuestions}
              </div>
              <div className="text-sm text-gray-400">Correct Answers</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 text-center col-span-2">
              <Music className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{percentage}%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </motion.div>

          {/* Difficulty Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <span className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium">
              Difficulty: <span className="capitalize font-bold">{gameResults.difficulty}</span>
            </span>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={handlePlayAgain}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            
            <Link to="/scoreboard" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-2 border-purple-400 text-purple-400 hover:bg-purple-400/10 py-6"
                size="lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                View Scoreboard
              </Button>
            </Link>
            
            <Link to="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-2 border-white/20 text-white hover:bg-white/10 py-6"
                size="lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Button>
            </Link>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
