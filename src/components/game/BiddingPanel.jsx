import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function BiddingPanel({ currentBid, minBid, maxBid, increment, onBid, onPass, isPlayerTurn, currentBidder }) {
  const [bidAmount, setBidAmount] = useState(Math.max(minBid, (currentBid || 0) + increment));

  const nextBid = Math.max(minBid, (currentBid || 0) + increment);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-4"
    >
      <div className="text-center">
        <h3 className="font-display text-lg text-foreground">Bidding Round</h3>
        <p className="text-sm text-muted-foreground font-body mt-1">
          {isPlayerTurn ? "Your turn to bid" : `${currentBidder} is bidding...`}
        </p>
        {currentBid > 0 && (
          <div className="mt-2 text-primary font-display text-2xl font-bold">{currentBid}</div>
        )}
      </div>

      {isPlayerTurn && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBidAmount(Math.max(nextBid, bidAmount - increment))}
              disabled={bidAmount <= nextBid}
            >
              −
            </Button>
            <span className="font-display text-xl font-bold text-foreground w-16 text-center">
              {bidAmount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBidAmount(Math.min(maxBid, bidAmount + increment))}
              disabled={bidAmount >= maxBid}
            >
              +
            </Button>
          </div>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => {
                onBid(bidAmount);
                setBidAmount(bidAmount + increment);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body"
            >
              Bid {bidAmount}
            </Button>
            <Button
              variant="outline"
              onClick={onPass}
              className="font-body"
            >
              Pass
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}