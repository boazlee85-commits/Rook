import React from "react";

export default function OpponentHands({ hands, numPlayers }) {
  const opponents = numPlayers === 5 
    ? ["West", "North", "East", "South"] 
    : ["West", "North", "East"];

  return (
    <div className="flex justify-between items-start px-4 md:px-8">
      {opponents.map(name => {
        const count = hands?.[name]?.length || 0;
        return (
          <div key={name} className="text-center">
            <p className="text-xs text-muted-foreground font-body mb-1">{name}</p>
            <div className="flex gap-0.5 justify-center">
              {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-5 md:w-4 md:h-6 rounded-sm bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20"
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground/50 font-body mt-1">{count} cards</p>
          </div>
        );
      })}
    </div>
  );
}