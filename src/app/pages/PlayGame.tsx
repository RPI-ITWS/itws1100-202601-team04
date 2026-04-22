import { Link } from "react-router";
import { motion } from "motion/react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trophy, Zap, Target } from "lucide-react";

export function PlayGame() {
  const difficulties = [
    {
      level: "easy",
      title: "Easy",
      description: "3 distinct genres - Perfect for beginners",
      icon: Trophy,
      color: "from-green-500 to-emerald-500",
      details: "Guess from Rock, Classical, and Hip Hop"
    },
    {
      level: "medium",
      title: "Medium",
      description: "6 genre options - A balanced challenge",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      details: "More variety, more fun!"
    },
    {
      level: "hard",
      title: "Hard",
      description: "All 12 genres - For true music experts",
      icon: Target,
      color: "from-red-500 to-pink-500",
      details: "The ultimate music knowledge test"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Choose Your Difficulty
        </h1>
        <p className="text-xl text-gray-300">
          How well do you know your music genres?
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {difficulties.map((diff, index) => {
          const Icon = diff.icon;
          return (
            <motion.div
              key={diff.level}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 h-full flex flex-col hover:bg-white/10 transition-all hover:scale-105">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${diff.color} flex items-center justify-center mb-6 mx-auto`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3 text-center">
                  {diff.title}
                </h2>
                
                <p className="text-gray-300 mb-2 text-center flex-1">
                  {diff.description}
                </p>
                
                <p className="text-sm text-gray-400 mb-6 text-center">
                  {diff.details}
                </p>
                
                <Link to={`/game/${diff.level}`} className="mt-auto">
                  <Button 
                    className={`w-full bg-gradient-to-r ${diff.color} hover:opacity-90 text-white py-6`}
                    size="lg"
                  >
                    Play {diff.title}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-3">How to Play</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">1.</span>
            <span>You'll see a blurred album cover</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">2.</span>
            <span>Choose the correct genre from the options</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">3.</span>
            <span>Earn points for correct answers and speed</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">4.</span>
            <span>Complete all 10 rounds to see your final score!</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
