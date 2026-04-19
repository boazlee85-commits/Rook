import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, Play, BookOpen, Users, Plus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getMergedRookConfig } from "@/lib/gameSettings";
import { useSocket } from "@/lib/SocketContext";

export default function Home() {
  const config = getMergedRookConfig();
  const navigate = useNavigate();
  const { createGame, joinGame, isConnected } = useSocket();
  const [playerName, setPlayerName] = useState("");
  const [gameId, setGameId] = useState("");
  const [numPlayers, setNumPlayers] = useState("4");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  const handleCreateGame = () => {
    if (!playerName.trim()) return;
    createGame(playerName.trim(), parseInt(numPlayers));
    setIsCreateDialogOpen(false);
    navigate("/game");
  };

  const handleJoinGame = () => {
    if (!playerName.trim() || !gameId.trim()) return;
    joinGame(gameId.trim(), playerName.trim());
    setIsJoinDialogOpen(false);
    navigate("/game");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-amber-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <Link to="/settings" className="absolute top-6 right-6 z-20">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-white/15 bg-black/20 backdrop-blur hover:bg-white/10"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-x-0 top-12 text-center z-10"
      >
        <p className="font-body text-sm uppercase tracking-[0.35em] text-amber-200/70">
          Trick Taking Card Game
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-xl"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-gradient-to-br from-amber-200/15 via-red-400/10 to-yellow-200/10 border border-white/10 flex items-center justify-center mb-8 shadow-2xl shadow-black/30"
        >
          <span className="font-display text-6xl md:text-7xl font-black text-amber-100">R</span>
        </motion.div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          ROOK
        </h1>
        <p className="font-body text-muted-foreground mt-3 text-base md:text-lg max-w-md mx-auto leading-relaxed">
          Play Rook with friends! Create a game or join an existing one to start playing.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-14 min-w-48 px-8 bg-amber-300 text-black hover:bg-amber-200 font-body text-lg gap-3 rounded-full shadow-xl shadow-amber-600/20">
                  <Plus className="w-5 h-5" />
                  Create Game
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Game</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="playerName">Your Name</Label>
                    <Input
                      id="playerName"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="numPlayers">Number of Players</Label>
                    <Select value={numPlayers} onValueChange={setNumPlayers}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 Players</SelectItem>
                        <SelectItem value="5">5 Players</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateGame} disabled={!playerName.trim() || !isConnected} className="w-full">
                    Create Game
                  </Button>
                  {!isConnected && <p className="text-sm text-red-500">Server not connected</p>}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-14 min-w-48 px-8 font-body text-lg gap-3 rounded-full border-white/20 bg-white/5 hover:bg-white/10">
                  <LogIn className="w-5 h-5" />
                  Join Game
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Game</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="joinPlayerName">Your Name</Label>
                    <Input
                      id="joinPlayerName"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gameId">Game ID</Label>
                    <Input
                      id="gameId"
                      value={gameId}
                      onChange={(e) => setGameId(e.target.value)}
                      placeholder="Enter game ID"
                    />
                  </div>
                  <Button onClick={handleJoinGame} disabled={!playerName.trim() || !gameId.trim() || !isConnected} className="w-full">
                    Join Game
                  </Button>
                  {!isConnected && <p className="text-sm text-red-500">Server not connected</p>}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Link to="/game" className="block">
            <Button variant="ghost" className="h-12 px-6 font-body text-base gap-2 text-muted-foreground hover:text-foreground">
              <Play className="w-4 h-4" />
              Play Solo (vs AI)
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4 max-w-md mx-auto"
        >
          <p className="font-body text-sm text-amber-100">
            Current rules: <span className="font-semibold">{config.name}</span>
          </p>
          <p className="font-body text-sm text-muted-foreground mt-1">
            First to {config.winScore}, opening bid {config.minBid}, bid step {config.bidIncrement}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-3 mt-6"
        >
          <Link to="/rules">
            <Button variant="ghost" className="font-body gap-3 text-muted-foreground hover:text-foreground">
              <BookOpen className="w-4 h-4" />
              How to Play
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" className="font-body gap-3 text-muted-foreground hover:text-foreground">
              <Settings className="w-4 h-4" />
              Rules
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-2 mt-12"
        >
          {["bg-red-500", "bg-green-600", "bg-yellow-500", "bg-gray-800"].map((color, i) => (
            <motion.div
              key={color}
              initial={{ rotate: -10 + i * 7, y: 20 }}
              animate={{ rotate: -10 + i * 7, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className={`w-10 h-14 md:w-12 md:h-16 rounded-lg ${color} shadow-lg shadow-black/30 flex items-center justify-center`}
            >
              <span className="font-display text-white text-sm font-bold">
                {["14", "R", "10", "1"][i]}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
