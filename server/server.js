const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Game state management
const games = new Map(); // gameId -> game state
const players = new Map(); // socketId -> { gameId, playerName, playerIndex }

const SUITS = ["Red", "Green", "Yellow", "Black"];
const VALUES = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]; // 14 is Rook

function createDeck() {
  const deck = [];
  SUITS.forEach(suit => {
    VALUES.slice(0, -1).forEach(value => { // Exclude 14 for suits
      deck.push({ suit, value });
    });
  });
  deck.push({ suit: "Rook", value: 14 }); // Add the Rook
  return deck.sort(() => Math.random() - 0.5);
}

function dealCards(deck, numPlayers) {
  const hands = {};
  const players = ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'].slice(0, numPlayers);

  players.forEach(player => {
    hands[player] = [];
  });

  // Deal 10 cards to each player (or 9 for 5 players)
  const cardsPerPlayer = numPlayers === 5 ? 9 : 10;
  for (let i = 0; i < cardsPerPlayer; i++) {
    players.forEach(player => {
      if (deck.length > 0) {
        hands[player].push(deck.pop());
      }
    });
  }

  // Remaining cards go to nest
  const nest = deck;

  return { hands, nest };
}

function determineTrickWinner(trick, trumpColor) {
  if (!trick || trick.length === 0) return null;

  let winningCard = trick[0];
  let winningPlayer = trick[0].player;

  for (let i = 1; i < trick.length; i++) {
    const currentCard = trick[i];
    const currentPlayer = trick[i].player;

    // Rook always wins
    if (currentCard.suit === "Rook") {
      winningCard = currentCard;
      winningPlayer = currentPlayer;
      continue;
    }

    // If previous winner was Rook, only another Rook can beat it
    if (winningCard.suit === "Rook") continue;

    // Trump beats non-trump
    if (currentCard.suit === trumpColor && winningCard.suit !== trumpColor) {
      winningCard = currentCard;
      winningPlayer = currentPlayer;
      continue;
    }

    // Same suit, higher value wins
    if (currentCard.suit === winningCard.suit && currentCard.value > winningCard.value) {
      winningCard = currentCard;
      winningPlayer = currentPlayer;
    }
  }

  return winningPlayer;
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Create or join game
  socket.on('createGame', (data) => {
    const { playerName, numPlayers } = data;
    const gameId = Math.random().toString(36).substring(7);

    const deck = createDeck();
    const { hands, nest } = dealCards(deck, numPlayers);

    const gameState = {
      id: gameId,
      players: [playerName],
      maxPlayers: numPlayers,
      status: 'waiting', // waiting, bidding, trump, discard, playing, finished
      hands: hands,
      nest: nest,
      currentTrick: [],
      tricksWon: {},
      scores: {},
      currentPlayer: 0,
      bidWinner: null,
      trumpColor: null,
      currentBid: 0,
      passedPlayers: []
    };

    games.set(gameId, gameState);
    players.set(socket.id, { gameId, playerName, playerIndex: 0 });

    socket.join(gameId);
    socket.emit('gameCreated', { gameId, gameState });
    console.log(`Game ${gameId} created by ${playerName}`);
  });

  socket.on('joinGame', (data) => {
    const { gameId, playerName } = data;
    const game = games.get(gameId);

    if (!game) {
      socket.emit('error', 'Game not found');
      return;
    }

    if (game.players.length >= game.maxPlayers) {
      socket.emit('error', 'Game is full');
      return;
    }

    if (game.status !== 'waiting') {
      socket.emit('error', 'Game already started');
      return;
    }

    const playerIndex = game.players.length;
    game.players.push(playerName);
    players.set(socket.id, { gameId, playerName, playerIndex });

    socket.join(gameId);
    socket.emit('gameJoined', { gameId, gameState: game });

    // Notify other players
    socket.to(gameId).emit('playerJoined', { playerName, gameState: game });

    console.log(`${playerName} joined game ${gameId}`);

    // Start game if all players joined
    if (game.players.length === game.maxPlayers) {
      game.status = 'bidding';
      io.to(gameId).emit('gameStarted', game);
      console.log(`Game ${gameId} started`);
    }
  });

  socket.on('makeBid', (data) => {
    const { bid } = data;
    const playerData = players.get(socket.id);
    if (!playerData) return;

    const game = games.get(playerData.gameId);
    if (!game || game.status !== 'bidding') return;

    if (bid === 'pass') {
      game.passedPlayers.push(playerData.playerName);
    } else {
      game.currentBid = bid;
      game.bidWinner = playerData.playerName;
      game.passedPlayers = []; // Reset passes when someone bids
    }

    // Check if bidding is complete
    const activePlayers = game.players.filter(p => !game.passedPlayers.includes(p));
    if (activePlayers.length === 1 && game.currentBid > 0) {
      game.status = 'trump';
      game.currentPlayer = game.players.indexOf(game.bidWinner);
    } else {
      game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
    }

    io.to(playerData.gameId).emit('bidMade', game);
  });

  socket.on('selectTrump', (data) => {
    const { trumpColor } = data;
    const playerData = players.get(socket.id);
    if (!playerData) return;

    const game = games.get(playerData.gameId);
    if (!game || game.status !== 'trump' || game.bidWinner !== playerData.playerName) return;

    game.trumpColor = trumpColor;
    game.status = 'discard';

    io.to(playerData.gameId).emit('trumpSelected', game);
  });

  socket.on('discardCards', (data) => {
    const { cardsToDiscard } = data;
    const playerData = players.get(socket.id);
    if (!playerData) return;

    const game = games.get(playerData.gameId);
    if (!game || game.status !== 'discard' || game.bidWinner !== playerData.playerName) return;

    // Remove discarded cards from hand and add to nest
    game.hands[playerData.playerName] = game.hands[playerData.playerName].filter(
      card => !cardsToDiscard.some(discard => discard.suit === card.suit && discard.value === card.value)
    );
    game.nest.push(...cardsToDiscard);

    game.status = 'playing';
    game.currentPlayer = game.players.indexOf(game.bidWinner);

    io.to(playerData.gameId).emit('cardsDiscarded', game);
  });

  socket.on('playCard', (data) => {
    const { card } = data;
    const playerData = players.get(socket.id);
    if (!playerData) return;

    const game = games.get(playerData.gameId);
    if (!game || game.status !== 'playing' || game.players[game.currentPlayer] !== playerData.playerName) return;

    // Validate card can be played
    const hand = game.hands[playerData.playerName];
    const cardInHand = hand.find(c => c.suit === card.suit && c.value === card.value);
    if (!cardInHand) return;

    // Remove card from hand
    game.hands[playerData.playerName] = hand.filter(c => !(c.suit === card.suit && c.value === card.value));

    // Add to current trick
    game.currentTrick.push({ player: playerData.playerName, card });

    if (game.currentTrick.length === game.players.length) {
      // Trick complete
      const winner = determineTrickWinner(game.currentTrick, game.trumpColor);
      game.tricksWon[winner] = (game.tricksWon[winner] || 0) + 1;

      game.currentTrick = [];
      game.currentPlayer = game.players.indexOf(winner);

      // Check if round is over
      const totalTricks = Object.values(game.tricksWon).reduce((sum, tricks) => sum + tricks, 0);
      if (totalTricks === Math.floor(57 / game.players.length)) { // 57 cards total minus nest
        game.status = 'finished';
        // Calculate final scores here
      }
    } else {
      game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
    }

    io.to(playerData.gameId).emit('cardPlayed', game);
  });

  socket.on('disconnect', () => {
    const playerData = players.get(socket.id);
    if (playerData) {
      const game = games.get(playerData.gameId);
      if (game) {
        // Remove player from game
        game.players = game.players.filter(p => p !== playerData.playerName);
        if (game.players.length === 0) {
          games.delete(playerData.gameId);
        } else {
          io.to(playerData.gameId).emit('playerLeft', { playerName: playerData.playerName, gameState: game });
        }
      }
      players.delete(socket.id);
    }
    console.log('Player disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});