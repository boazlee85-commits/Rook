import React from "react";
import { motion } from "framer-motion";
import { COLORS, getCardDisplayValue } from "@/lib/gameVersions";

export default function RookCard({ card, onClick, disabled, small, faceDown, selected }) {
  if (faceDown) {
    return (
      <div className="w-16 h-24 md:w-20 md:h-28 rounded-lg bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-primary/30 flex items-center justify-center shadow-lg">
        <span className="font-display text-primary/60 text-xl font-bold">R</span>
      </div>
    );
  }

  const colorStyle = card.isRookBird 
    ? { bg: "bg-primary", text: "text-primary", border: "border-primary" }
    : COLORS[card.color] || COLORS.black;

  const displayValue = getCardDisplayValue(card);
  const sizeClass = small ? "w-12 h-18 md:w-14 md:h-20" : "w-16 h-24 md:w-20 md:h-28";

  return (
    <motion.button
      whileHover={!disabled ? { y: -8, scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={() => !disabled && onClick?.(card)}
      disabled={disabled}
      className={`
        ${sizeClass} rounded-lg border-2 ${colorStyle.border}
        bg-gradient-to-br from-card to-secondary
        flex flex-col items-center justify-center gap-0.5
        shadow-lg hover:shadow-xl transition-shadow cursor-pointer
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background -translate-y-2" : ""}
        relative overflow-hidden
      `}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${colorStyle.bg}`} />
      <span className={`font-display text-lg md:text-xl font-bold ${colorStyle.text}`}>
        {displayValue}
      </span>
      {card.isRookBird ? (
        <span className="text-xs text-primary font-body font-medium">ROOK</span>
      ) : (
        <div className={`w-2 h-2 rounded-full ${colorStyle.bg}`} />
      )}
      <div className={`absolute bottom-0 left-0 w-full h-1 ${colorStyle.bg}`} />
    </motion.button>
  );
}