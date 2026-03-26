import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { PlayGame } from "./pages/PlayGame";
import { GamePlay } from "./pages/GamePlay";
import { PlaylistGenerator } from "./pages/PlaylistGenerator";
import { Results } from "./pages/Results";
import { Scoreboard } from "./pages/Scoreboard";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "play", Component: PlayGame },
      { path: "game/:difficulty", Component: GamePlay },
      { path: "playlist", Component: PlaylistGenerator },
      { path: "results", Component: Results },
      { path: "scoreboard", Component: Scoreboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
