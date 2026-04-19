import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function DiscardPanel({ discardCount, selectedCount, onConfirm }) {
  const ready = selectedCount === discardCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 text-center space-y-3"
    >
      <h3 className="font-display text-lg text-foreground">Discard {discardCount} Cards</h3>
      <p className="text-sm text-muted-foreground font-body">
        Tap cards below to select them for discard.{" "}
        <span className={ready ? "text-primary font-semibold" : "text-foreground"}>
          {selectedCount}/{discardCount} selected
        </span>
      </p>
      <Button
        onClick={onConfirm}
        disabled={!ready}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-2 disabled:opacity-40"
      >
        <Trash2 className="w-4 h-4" />
        Confirm Discard
      </Button>
    </motion.div>
  );
}