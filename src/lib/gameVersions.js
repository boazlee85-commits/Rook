export const VERSIONS = {
  standard: {
    id: "standard",
    name: "Standard Rook",
    players: 4,
    teams: 2,
    description: "Classic 4-player partnership game. Teams of 2 bid and take tricks to score points.",
    rules: "Deal 41 cards (1-14 in 4 colors + Rook Bird). 5 cards go to the nest. Highest bidder names trump, takes the nest, and discards 5. Play tricks to capture point cards.",
    pointCards: "5s=5pts, 10s & 14s=10pts, Rook Bird=20pts. Total: 200 pts per round.",
    winScore: 300,
    minBid: 70,
    maxBid: 200,
    bidIncrement: 5,
    icon: "Crown"
  },
  partnership: {
    id: "partnership",
    name: "Partnership Rook",
    players: 4,
    teams: 2,
    description: "Enhanced partnership play with communication signals and advanced bidding strategies.",
    rules: "Same base as Standard but partners sit across. Signaling through card play is encouraged. First team to 500 wins.",
    pointCards: "5s=5pts, 10s & 14s=10pts, Rook Bird=20pts. Total: 200 pts per round.",
    winScore: 500,
    minBid: 80,
    maxBid: 200,
    bidIncrement: 5,
    icon: "Users"
  },
  tournament: {
    id: "tournament",
    name: "Tournament Rook",
    players: 4,
    teams: 2,
    description: "Competitive format with stricter rules and higher stakes bidding.",
    rules: "No table talk allowed. Must follow suit. Rook Bird is always highest trump. Overbid penalty: lose your bid amount. First to 500.",
    pointCards: "1s=15pts, 5s=5pts, 10s & 14s=10pts, Rook Bird=20pts. Total: 260 pts per round.",
    winScore: 500,
    minBid: 100,
    maxBid: 260,
    bidIncrement: 5,
    icon: "Trophy"
  },
  kentucky: {
    id: "kentucky",
    name: "Kentucky Rook",
    players: 4,
    teams: 2,
    description: "Southern-style variant where 1s are high and the Rook Bird is removed.",
    rules: "Remove the Rook Bird card. 1s are the highest card in each color (above 14). 1s are worth 15 points each. Deal all cards evenly.",
    pointCards: "1s=15pts, 5s=5pts, 10s & 14s=10pts. Total: 200 pts per round.",
    winScore: 300,
    minBid: 70,
    maxBid: 200,
    bidIncrement: 5,
    icon: "MapPin"
  },
  call_partner: {
    id: "call_partner",
    name: "Call Partner",
    players: 5,
    teams: 0,
    description: "5-player variant where the bid winner secretly calls a partner by naming a card.",
    rules: "5 players, no fixed teams. Bid winner calls a specific card — whoever holds it is secretly their partner. Points split accordingly. First to 300.",
    pointCards: "5s=5pts, 10s & 14s=10pts, Rook Bird=20pts. Total: 200 pts per round.",
    winScore: 300,
    minBid: 70,
    maxBid: 200,
    bidIncrement: 5,
    icon: "Phone"
  }
};

export const COLORS = {
  red: { name: "Red", bg: "bg-red-500", text: "text-red-500", border: "border-red-500", gradient: "from-red-600 to-red-800", shadow: "shadow-red-500/30" },
  green: { name: "Green", bg: "bg-green-600", text: "text-green-500", border: "border-green-600", gradient: "from-green-700 to-green-900", shadow: "shadow-green-500/30" },
  yellow: { name: "Yellow", bg: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500", gradient: "from-yellow-600 to-yellow-800", shadow: "shadow-yellow-500/30" },
  black: { name: "Black", bg: "bg-gray-800", text: "text-gray-400", border: "border-gray-800", gradient: "from-gray-700 to-gray-900", shadow: "shadow-gray-500/30" },
};

export function generateDeck(version) {
  const cards = [];
  const colors = ["red", "green", "yellow", "black"];
  const maxVal = 14;
  const minVal = 1;

  for (const color of colors) {
    for (let value = minVal; value <= maxVal; value++) {
      cards.push({ color, value, id: `${color}-${value}` });
    }
  }

  if (version !== "kentucky") {
    cards.push({ color: "rook", value: 0, id: "rook-bird", isRookBird: true });
  }

  return cards;
}

export function shuffleDeck(cards) {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards(deck, numPlayers, nestSize = 5) {
  const hands = {};
  const players = ["You", "West", "North", "East"];
  if (numPlayers === 5) players.push("South");

  const cardsPerPlayer = Math.floor((deck.length - nestSize) / numPlayers);
  let cardIndex = 0;

  for (const player of players) {
    hands[player] = deck.slice(cardIndex, cardIndex + cardsPerPlayer);
    cardIndex += cardsPerPlayer;
  }

  const nest = deck.slice(cardIndex, cardIndex + nestSize);
  return { hands, nest };
}

export function getCardPoints(card, version) {
  if (card.isRookBird) return 20;
  if (card.value === 5) return 5;
  if (card.value === 10 || card.value === 14) return 10;
  if ((version === "tournament" || version === "kentucky") && card.value === 1) return 15;
  return 0;
}

export function getCardDisplayValue(card) {
  if (card.isRookBird) return "R";
  if (card.value === 1) return "1";
  return String(card.value);
}

export function sortHand(hand) {
  const colorOrder = { red: 0, green: 1, yellow: 2, black: 3, rook: 4 };
  return [...hand].sort((a, b) => {
    if (a.color !== b.color) return colorOrder[a.color] - colorOrder[b.color];
    return a.value - b.value;
  });
}

export function getCardStrength(card, trumpColor, leadColor, version) {
  if (card.isRookBird) {
    return 1000; // Rook bird is always highest trump
  }
  
  let base = card.value;
  if ((version === "kentucky" || version === "tournament") && card.value === 1) {
    base = 15; // 1s are highest
  }
  
  if (card.color === trumpColor) return 500 + base;
  if (card.color === leadColor) return 100 + base;
  return base;
}

export function determineTrickWinner(trick, trumpColor, version) {
  if (trick.length === 0) return null;
  const leadColor = trick[0].card.isRookBird ? trumpColor : trick[0].card.color;
  
  let bestIndex = 0;
  let bestStrength = getCardStrength(trick[0].card, trumpColor, leadColor, version);
  
  for (let i = 1; i < trick.length; i++) {
    const strength = getCardStrength(trick[i].card, trumpColor, leadColor, version);
    if (strength > bestStrength) {
      bestStrength = strength;
      bestIndex = i;
    }
  }
  
  return trick[bestIndex].player;
}