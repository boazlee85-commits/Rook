import React from "react";
import { Button } from "@/components/ui/button";
import { COLORS } from "@/lib/gameVersions";
import { motion } from "framer-motion";

export default function TrumpSelector({ onSelectTrump }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl p-6 space-y-4 text-center"
    >
      <h3 className="font-display text-lg text-foreground">Choose Trump Color</h3>
      <p className="text-sm text-muted-foreground font-body">You won the bid! Pick a trump color.</p>
      <div className="flex flex-wrap justify-center gap-3">
        {Object.entries(COLORS).map(([key, color]) => (
          <Button
            key={key}
            onClick={() => onSelectTrump(key)}
            className={`${color.bg} text-white hover:opacity-80 font-body capitalize px-6`}
          >
            {color.name}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}