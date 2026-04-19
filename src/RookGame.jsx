import React, { useState } from "react";

const SUITS = ["Red", "Green", "Yellow", "Black"];
const VALUES = [1,2,3,4,5,6,7,8,9,10,11,12,13];

function createDeck() {
  const deck = [];
  SUITS.forEach(suit => {
    VALUES.forEach(value => {
      deck.push({ suit, value });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
}

export default function RookGame() {
  const [deck] = useState(createDeck());

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Rook Game</h1>

      <div className="grid grid-cols-6 gap-2">
        {deck.map((card, i) => (
          <div
            key={i}
            className="border p-2 rounded bg-white text-black text-center"
          >
            {card.value} {card.suit}
          </div>
        ))}
      </div>
    </div>
  );
}
