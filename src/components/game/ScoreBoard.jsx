import React from "react";
import { motion } from "framer-motion";

export default function ScoreBoard({ scores, version, winScore }) {
  const isTeamGame = version !== "call_partner";
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card border border-border rounded-xl p-4"
    >
      <h3 className="font-display text-sm text-muted-foreground mb-3 text-center uppercase tracking-wider">
        Score — First to {winScore}
      </h3>
      {isTeamGame ? (
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-body">You & North</p>
            <p className="font-display text-2xl font-bold text-primary">{scores?.team1 || 0}</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-body">East & West</p>
            <p className="font-display text-2xl font-bold text-foreground">{scores?.team2 || 0}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2 text-center">
          {["You", "West", "North", "East", "South"].map(p => (
            <div key={p}>
              <p className="text-xs text-muted-foreground font-body">{p}</p>
              <p className="font-display text-lg font-bold text-foreground">{scores?.[p] || 0}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}