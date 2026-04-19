import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  generateDeck, shuffleDeck, dealCards, 
  getCardPoints, determineTrickWinner, getCardStrength
} from "@/lib/gameVersions";
import { getMergedRookConfig } from "@/lib/gameSettings";
import PlayerHand from "@/components/game/PlayerHand";
import RookCard from "@/components/game/RookCard";
import TrickArea from "@/components/game/TrickArea";
import BiddingPanel from "@/components/game/BiddingPanel";
import TrumpSelector from "@/components/game/TrumpSelector";
import ScoreBoard from "@/components/game/ScoreBoard";
import OpponentHands from "@/components/game/OpponentHands";
import GameMessage from "@/components/game/GameMessage";
import DiscardPanel from "@/components/game/DiscardPanel";
import { useSocket } from "@/lib/SocketContext";

const PLAYERS_4 = ["Player1", "Player2", "Player3", "Player4"];
const PLAYERS_5 = ["Player1", "Player2", "Player3", "Player4", "Player5"];

export default function Game() {
  const config = getMergedRookConfig();
  const players = config.players === 5 ? PLAYERS_5 : PLAYERS_4;
  const { gameState, currentPlayer, makeBid, selectTrump, discardCards, playCard } = useSocket();

  const [discardSelection, setDiscardSelection] = useState([]);
  const [message, setMessage] = useState("Waiting for game to start...");
  const [selectedCard, setSelectedCard] = useState(null);

  // Update local state when gameState changes
  useEffect(() => {
    if (gameState) {
      switch (gameState.status) {
        case 'waiting':
          setMessage(`Waiting for players... ${gameState.players.length}/${gameState.maxPlayers}`);
          break;
        case 'bidding':
          setMessage(`${gameState.players[gameState.currentPlayer]}'s turn to bid`);
          break;
        case 'trump':
          setMessage(`${gameState.bidWinner} is selecting trump`);
          break;
        case 'discard':
          setMessage(`${gameState.bidWinner} is discarding cards`);
          break;
        case 'playing':
          setMessage(`${gameState.players[gameState.currentPlayer]}'s turn to play`);
          break;
        case 'finished':
          setMessage("Game finished!");
          break;
      }
    }
  }, [gameState]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to game...</p>
        </div>
      </div>
    );
  }

  const isPlayerTurn = gameState.players[gameState.currentPlayer] === currentPlayer;
  const isBidderTurn = gameState.status === 'bidding' && isPlayerTurn;
  const isTrumpSelector = gameState.status === 'trump' && gameState.bidWinner === currentPlayer;
  const isDiscarder = gameState.status === 'discard' && gameState.bidWinner === currentPlayer;

  function handlePlayerBid(amount) {
    makeBid(amount);
  }

  function handlePlayerPass() {
    makeBid('pass');
  }

  function handleSelectTrump(color) {
    selectTrump(color);
    setDiscardSelection([]);
  }

  function handleConfirmDiscard() {
    const cardsToDiscard = discardSelection.map(index => gameState.hands[currentPlayer][index]);
    discardCards(cardsToDiscard);
    setDiscardSelection([]);
  }

  function canPlayCard(card, hand) {
    if (gameState.currentTrick.length === 0) return true;
    const leadSuit = gameState.currentTrick[0].card.suit;
    const hasLeadSuit = hand.some(c => c.suit === leadSuit);
    if (!hasLeadSuit) return true;
    return card.suit === leadSuit;
  }

  function handlePlayCard(card) {
    if (gameState.status !== "playing" || !isPlayerTurn) return;

    const hand = gameState.hands[currentPlayer] || [];
    if (!canPlayCard(card, hand)) {
      setMessage("You must follow suit!");
      return;
    }

    playCard(card);
  }

  function toggleDiscardCard(cardIndex) {
    setDiscardSelection(prev => {
      if (prev.includes(cardIndex)) {
        return prev.filter(i => i !== cardIndex);
      }
      if (prev.length >= (gameState.maxPlayers === 5 ? 2 : 5)) {
        return prev;
      }
      return [...prev, cardIndex];
    });
  }

  const discardCount = gameState.maxPlayers === 5 ? 2 : 5;

  const startNewRound = useCallback(() => {
    const deck = shuffleDeck(generateDeck(version));
    const nestSize = config.players === 5 ? 2 : 5;
    const { hands: newHands, nest: newNest } = dealCards(deck, config.players, nestSize);
    setHands(newHands);
    setNest(newNest);
    setPhase("bidding");
    setCurrentBid(0);
    setBidWinner(null);
    setBiddingPlayer(0);
    setPassedPlayers(new Set());
    setTrumpColor("none");
    setCurrentTrick([]);
    setCurrentPlayerIndex(0);
    setTricksWon(Object.fromEntries(players.map(p => [p, []])));
    setMessage("Bidding begins!");
    setSelectedCard(null);
  }, [version, config.players, players]);

  useEffect(() => {
    startNewRound();
  }, []);

  // AI bidding logic
  useEffect(() => {
    if (phase !== "bidding" || players[biddingPlayer] === "You") return;
    if (passedPlayers.has(players[biddingPlayer])) {
      // Skip passed players
      const nextBidder = findNextBidder(biddingPlayer);
      if (nextBidder === null) return;
      const timer = setTimeout(() => setBiddingPlayer(nextBidder), 300);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      const ai = players[biddingPlayer];
      const hand = hands[ai] || [];
      const handStrength = hand.reduce((sum, c) => sum + getCardPoints(c, version) + (c.value >= 12 ? 5 : 0), 0);
      const shouldBid = handStrength > 40 && currentBid < config.maxBid - 20;
      
      if (shouldBid && Math.random() > 0.4) {
        const newBid = Math.max(config.minBid, currentBid + config.bidIncrement);
        setCurrentBid(newBid);
        setMessage(`${ai} bids ${newBid}`);
        const next = findNextBidder(biddingPlayer);
        if (next !== null) setBiddingPlayer(next);
      } else {
        setPassedPlayers(prev => new Set([...prev, ai]));
        setMessage(`${ai} passes`);
        const next = findNextBidder(biddingPlayer);
        if (next !== null) setBiddingPlayer(next);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [phase, biddingPlayer, passedPlayers]);

  // Check if bidding is done
  useEffect(() => {
    if (phase !== "bidding") return;
    const activeBidders = players.filter(p => !passedPlayers.has(p));
    
    if (activeBidders.length === 1 && currentBid > 0) {
      const winner = activeBidders[0];
      setBidWinner(winner);
      setMessage(`${winner} wins the bid at ${currentBid}!`);
      
      if (winner === "You") {
        // Add nest to player's hand so they can see all cards when picking trump
        setHands(prev => ({
          ...prev,
          "You": [...(prev["You"] || []), ...nest]
        }));
        setNest([]);
        setTimeout(() => setPhase("trump"), 1000);
      } else {
        // AI picks trump and auto-discards
        const aiHand = hands[winner] || [];
        const colorCounts = { red: 0, green: 0, yellow: 0, black: 0 };
        aiHand.forEach(c => { if (colorCounts[c.color] !== undefined) colorCounts[c.color]++; });
        const bestColor = Object.entries(colorCounts).sort(([,a],[,b]) => b - a)[0][0];

        // AI discards lowest non-point cards from its hand + nest
        const aiDiscardCount = config.players === 5 ? 2 : 5;
        const aiFullHand = [...aiHand, ...nest];
        const sorted = [...aiFullHand].sort((a, b) => {
          const aP = getCardPoints(a, version);
          const bP = getCardPoints(b, version);
          if (aP !== bP) return aP - bP;
          return a.value - b.value;
        });
        const aiKept = sorted.slice(aiDiscardCount);
        const aiDiscarded = sorted.slice(0, aiDiscardCount);

        setTimeout(() => {
          setTrumpColor(bestColor);
          setMessage(`${winner} chooses ${bestColor} as trump and discards ${aiDiscardCount} cards`);
          setHands(prev => ({ ...prev, [winner]: aiKept }));
          setNest(aiDiscarded);
          // Bid winner leads first
          setCurrentPlayerIndex(players.indexOf(winner));
          setTimeout(() => setPhase("playing"), 1000);
        }, 1500);
      }
    } else if (activeBidders.length === 0 || (activeBidders.length <= 1 && currentBid === 0)) {
      // Everyone passed, re-deal
      setMessage("Everyone passed! Re-dealing...");
      setTimeout(() => startNewRound(), 2000);
    }
  }, [passedPlayers, phase]);

  function findNextBidder(current) {
    for (let i = 1; i <= players.length; i++) {
      const next = (current + i) % players.length;
      if (!passedPlayers.has(players[next])) return next;
    }
    return null;
  }

  function handlePlayerBid(amount) {
    setCurrentBid(amount);
    setMessage(`You bid ${amount}`);
    const next = findNextBidder(biddingPlayer);
    if (next !== null) setBiddingPlayer(next);
  }

  function handlePlayerPass() {
    setPassedPlayers(prev => new Set([...prev, "You"]));
    setMessage("You pass");
    const next = findNextBidder(biddingPlayer);
    if (next !== null) setBiddingPlayer(next);
  }

  function handleSelectTrump(color) {
    setTrumpColor(color);
    setDiscardSelection([]);
    setMessage(`You chose ${color} as trump. Now select ${discardCount} cards to discard.`);
    setPhase("discard");
  }

  function toggleDiscardCard(cardId) {
    setDiscardSelection(prev => {
      if (prev.includes(cardId)) return prev.filter(id => id !== cardId);
      if (prev.length >= discardCount) return prev;
      return [...prev, cardId];
    });
  }

  function handleConfirmDiscard() {
    const hand = hands["You"] || [];
    const kept = hand.filter(c => !discardSelection.includes(c.id));
    const discarded = hand.filter(c => discardSelection.includes(c.id));
    setHands(prev => ({ ...prev, "You": kept }));
    setNest(discarded);
    setDiscardSelection([]);
    // Bid winner leads first
    const bidWinnerIndex = players.indexOf("You");
    setCurrentPlayerIndex(bidWinnerIndex);
    setMessage("You won the bid — lead the first trick!");
    setPhase("playing");
  }

  function canPlayCard(card, hand) {
    if (currentTrick.length === 0) return true;
    const leadColor = currentTrick[0].card.isRookBird ? trumpColor : currentTrick[0].card.color;
    const hasLeadColor = hand.some(c => c.color === leadColor && !c.isRookBird);
    if (!hasLeadColor) return true;
    return card.color === leadColor || card.isRookBird;
  }

  function handlePlayCard(card) {
    if (phase !== "playing") return;
    if (players[currentPlayerIndex] !== "You") return;

    const hand = hands["You"] || [];
    if (!canPlayCard(card, hand)) {
      setMessage("You must follow suit!");
      return;
    }

    playCard(card);
  }

  // AI play logic
  useEffect(() => {
    if (phase !== "playing") return;
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer === "You") return;

    const timer = setTimeout(() => {
      const hand = hands[currentPlayer] || [];
      if (hand.length === 0) return;

      let playable = hand.filter(c => canPlayCard(c, hand));
      if (playable.length === 0) playable = hand;

      // Simple AI: play lowest non-point card, or highest if trying to win
      const leadColor = currentTrick.length > 0 
        ? (currentTrick[0].card.isRookBird ? trumpColor : currentTrick[0].card.color) 
        : null;

      let chosen;
      if (currentTrick.length === players.length - 1) {
        // Last to play, play highest to try to win
        chosen = playable.sort((a, b) => 
          getCardStrength(b, trumpColor, leadColor, version) - getCardStrength(a, trumpColor, leadColor, version)
        )[0];
      } else {
        // Play lowest
        chosen = playable.sort((a, b) => {
          const aPoints = getCardPoints(a, version);
          const bPoints = getCardPoints(b, version);
          if (aPoints !== bPoints) return aPoints - bPoints;
          return a.value - b.value;
        })[0];
      }

      playCard(currentPlayer, chosen);
    }, 600);

    return () => clearTimeout(timer);
  }, [phase, currentPlayerIndex]);

  function endRound(lastTrickWinner) {
    // Add nest points to bid winner
    const nestPoints = nest.reduce((sum, c) => sum + getCardPoints(c, version), 0);
    
    let roundScores = {};
    for (const player of players) {
      const playerCards = tricksWon[player] || [];
      roundScores[player] = playerCards.reduce((sum, c) => sum + getCardPoints(c, version), 0);
    }
    
    // Add nest to bid winner
    if (bidWinner) {
      roundScores[bidWinner] = (roundScores[bidWinner] || 0) + nestPoints;
    }

    const newScores = { ...scores };
    
    if (config.teams === 2) {
      const team1Points = (roundScores["You"] || 0) + (roundScores["North"] || 0);
      const team2Points = (roundScores["East"] || 0) + (roundScores["West"] || 0);
      
      const team1IsBidder = bidWinner === "You" || bidWinner === "North";
      const team2IsBidder = bidWinner === "East" || bidWinner === "West";
      
      if (team1IsBidder && team1Points < currentBid) {
        newScores.team1 -= currentBid;
      } else {
        newScores.team1 += team1Points;
      }
      
      if (team2IsBidder && team2Points < currentBid) {
        newScores.team2 -= currentBid;
      } else {
        newScores.team2 += team2Points;
      }
    } else {
      for (const player of players) {
        const pts = roundScores[player] || 0;
        if (player === bidWinner && pts < currentBid) {
          newScores[player] = (newScores[player] || 0) - currentBid;
        } else {
          newScores[player] = (newScores[player] || 0) + pts;
        }
      }
    }

    setScores(newScores);

    // Check for game winner
    let gameOver = false;
    if (config.teams === 2) {
      if (newScores.team1 >= config.winScore || newScores.team2 >= config.winScore) {
        gameOver = true;
        const winner = newScores.team1 >= config.winScore ? "You & North" : "East & West";
        setMessage(`${winner} wins the game!`);
      }
    } else {
      const winner = players.find(p => (newScores[p] || 0) >= config.winScore);
      if (winner) {
        gameOver = true;
        setMessage(`${winner} wins the game!`);
      }
    }

    if (gameOver) {
      setPhase("gameOver");
    } else {
      setPhase("roundOver");
      setMessage(`Round ${round} complete!`);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="text-center">
          <span className="font-display text-sm text-primary">Game: {gameState.id}</span>
          <span className="text-xs text-muted-foreground font-body ml-2">Status: {gameState.status}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Playing as: {currentPlayer}
        </div>
      </div>

      {/* Players list */}
      <div className="px-3 pt-3">
        <div className="flex justify-center gap-4 text-sm">
          {gameState.players.map((player, index) => (
            <div key={player} className={`px-3 py-1 rounded ${index === gameState.currentPlayer ? 'bg-amber-500 text-black' : 'bg-muted'}`}>
              {player} {player === currentPlayer ? '(You)' : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Game message */}
      <div className="px-4 pt-3">
        <GameMessage message={message} />
      </div>

      {/* Main play area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 gap-4">
        {gameState.status === "bidding" && (
          <BiddingPanel
            currentBid={gameState.currentBid}
            minBid={config.minBid}
            maxBid={config.maxBid}
            increment={config.bidIncrement}
            onBid={handlePlayerBid}
            onPass={handlePlayerPass}
            isPlayerTurn={isBidderTurn}
            currentBidder={gameState.players[gameState.currentPlayer]}
          />
        )}

        {gameState.status === "trump" && isTrumpSelector && (
          <TrumpSelector onSelectTrump={handleSelectTrump} />
        )}

        {gameState.status === "discard" && isDiscarder && (
          <DiscardPanel
            discardCount={discardCount}
            selectedCount={discardSelection.length}
            onConfirm={handleConfirmDiscard}
          />
        )}

        {gameState.status === "playing" && (
          <TrickArea currentTrick={gameState.currentTrick} trumpColor={gameState.trumpColor} />
        )}

        {gameState.status === "waiting" && (
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Waiting for more players...</p>
            <p className="text-sm text-muted-foreground mt-2">
              {gameState.players.length}/{gameState.maxPlayers} players joined
            </p>
          </div>
        )}
      </div>

      {/* Player hand */}
      <div className="px-3 pb-3">
        {gameState.hands && gameState.hands[currentPlayer] && (
          <PlayerHand
            hand={gameState.hands[currentPlayer]}
            onCardClick={gameState.status === "playing" ? handlePlayCard : undefined}
            onDiscardClick={gameState.status === "discard" && isDiscarder ? toggleDiscardCard : undefined}
            discardSelection={discardSelection}
            canPlayCard={(card) => canPlayCard(card, gameState.hands[currentPlayer])}
            isPlayerTurn={isPlayerTurn}
            trumpColor={gameState.trumpColor}
          />
        )}
      </div>
    </div>
  );
}
