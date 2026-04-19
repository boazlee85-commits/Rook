import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import RookCard from "./RookCard";

const POSITIONS = {
  "You": { x: 0, y: 40 },
  "West": { x: -80, y: 0 },
  "North": { x: 0, y: -40 },
  "East": { x: 80, y: 0 },
  "South": { x: 40, y: 40 },
};

export default function TrickArea({ currentTrick, trumpColor }) {
  return (
    <div className="relative w-64 h-48 md:w-80 md:h-56 mx-auto flex items-center justify-center">
      {trumpColor && trumpColor !== "none" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-body text-muted-foreground">
          Trump: <span className="capitalize font-semibold text-primary">{trumpColor}</span>
        </div>
      )}
      
      <AnimatePresence>
        {currentTrick?.map((play, i) => {
          const pos = POSITIONS[play.player] || { x: 0, y: 0 };
          return (
            <motion.div
              key={`${play.card.id}-${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute"
            >
              <div className="relative">
                <RookCard card={play.card} small disabled />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-body whitespace-nowrap">
                  {play.player}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {(!currentTrick || currentTrick.length === 0) && (
        <div className="text-muted-foreground/30 font-display text-lg">Play Area</div>
      )}
    </div>
  );
}