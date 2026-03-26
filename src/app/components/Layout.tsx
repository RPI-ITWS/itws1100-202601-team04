import { Outlet, Link, useLocation } from "react-router";
import { Music, Home, Play, ListMusic, Trophy } from "lucide-react";
import { motion } from "motion/react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/play", label: "Play Game", icon: Play },
    { path: "/playlist", label: "Playlist", icon: ListMusic },
    { path: "/scoreboard", label: "Scoreboard", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Music className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold text-white">MusicQuest</span>
            </Link>
            
            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === "/play" && location.pathname.startsWith("/game"));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-purple-600/50 rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`relative flex items-center gap-2 ${
                      isActive ? "text-white" : "text-gray-300 hover:text-white"
                    }`}>
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
}
