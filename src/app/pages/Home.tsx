import { Link } from "react-router";
import { Music, Play, ListMusic, Trophy, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function Home() {
  const features = [
    {
      icon: Play,
      title: "Genre Guessing Game",
      description: "Test your music knowledge by guessing genres from blurred album covers",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: ListMusic,
      title: "Smart Playlist Generator",
      description: "Discover new music based on your favorite songs, artists, or genres",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Trophy,
      title: "Track Your Progress",
      description: "Compete with yourself and see your high scores on the leaderboard",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="inline-block mb-6"
        >
          <div className="relative">
            <Music className="w-24 h-24 text-purple-400" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">MusicQuest</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Explore new genres, discover amazing music, and challenge yourself with our interactive music guessing game!
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/play">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
              <Play className="w-5 h-5 mr-2" />
              Start Playing
            </Button>
          </Link>
          <Link to="/playlist">
            <Button size="lg" variant="outline" className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400/10 px-8 py-6 text-lg">
              <ListMusic className="w-5 h-5 mr-2" />
              Generate Playlist
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 h-full hover:bg-white/10 transition-colors">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
      >
        <h2 className="text-3xl font-bold text-white mb-4">About MusicQuest</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            MusicQuest is an interactive platform that combines music discovery with engaging gameplay. 
            Whether you're a music enthusiast looking to explore new genres or someone who wants to test 
            their music knowledge, we've got you covered!
          </p>
          <p>
            <strong className="text-white">What makes us different?</strong> We blend entertainment and 
            exploration in a single platform. Instead of just streaming or gaming separately, you get both 
            experiences seamlessly integrated.
          </p>
          <p>
            <strong className="text-white">Who is this for?</strong> Anyone who loves music! Whether you're 
            looking to discover new artists in genres you already enjoy, or want to pass time with an 
            engaging music guessing game, MusicQuest is designed for you.
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400">
            Created by Nathen Pride, Kevin Chen, and D'Andre Collins for ITWS 1100
          </p>
        </div>
      </motion.div>
    </div>
  );
}
