import React from "react";
import { sortHand } from "@/lib/gameVersions";
import RookCard from "./RookCard";

export default function PlayerHand({ cards, onPlayCard, disabled, selectedCard, setSelectedCard }) {
  const sorted = sortHand(cards || []);

  return (
    <div className="flex flex-wrap justify-center gap-1 md:gap-2 px-2">
      {sorted.map((card) => (
        <RookCard
          key={card.id}
          card={card}
          onClick={(c) => {
            if (setSelectedCard) {
              setSelectedCard(c.id === selectedCard ? null : c.id);
            }
            if (onPlayCard) onPlayCard(c);
          }}
          disabled={disabled}
          selected={card.id === selectedCard}
        />
      ))}
    </div>
  );
}