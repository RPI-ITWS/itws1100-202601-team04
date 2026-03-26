import { Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Home, Music } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <Music className="w-24 h-24 text-purple-400 mx-auto" />
        </motion.div>
        
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-8 max-w-md">
          Oops! Looks like this page hit a wrong note. Let's get you back on track!
        </p>
        
        <Link to="/">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
