import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VERSIONS, COLORS } from "@/lib/gameVersions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Rules() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">How to Play</h1>
            <p className="font-body text-sm text-muted-foreground">Learn Rook card game rules</p>
          </div>
        </div>

        {/* General rules */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">General Rules</h2>
          <div className="space-y-3 font-body text-sm text-muted-foreground leading-relaxed">
            <p>Rook is a trick-taking card game using a special deck of 57 cards: numbers 1-14 in four colors (Red, Green, Yellow, Black) plus the Rook Bird card.</p>
            <p><strong className="text-foreground">Bidding:</strong> Players take turns bidding on how many points they think their team can capture. The highest bidder picks the trump color.</p>
            <p><strong className="text-foreground">Tricks:</strong> Players must follow the lead color. If they can't, they may play any card including trump. Highest card in lead suit wins unless trumped.</p>
            <p><strong className="text-foreground">Scoring:</strong> Point cards are captured in tricks. The bid winner's team must meet their bid or lose that many points.</p>
          </div>

          <h3 className="font-display text-base font-semibold text-foreground mt-6 mb-3">Card Colors</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(COLORS).map(([key, color]) => (
              <div key={key} className={`px-4 py-2 rounded-lg ${color.bg} text-white font-body text-sm font-medium`}>
                {color.name}
              </div>
            ))}
          </div>
        </div>

        {/* Version specific rules */}
        <Tabs defaultValue="standard">
          <TabsList className="w-full flex-wrap h-auto gap-1 bg-secondary p-1 rounded-xl">
            {Object.values(VERSIONS).map(v => (
              <TabsTrigger key={v.id} value={v.id} className="font-body text-xs rounded-lg">
                {v.name.replace("Rook", "").trim() || "Standard"}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.values(VERSIONS).map(v => (
            <TabsContent key={v.id} value={v.id}>
              <div className="bg-card border border-border rounded-xl p-6 mt-4">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{v.name}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">{v.rules}</p>
                <p className="font-body text-sm text-primary/80">{v.pointCards}</p>
                <div className="flex gap-4 mt-4 pt-3 border-t border-border font-body text-sm text-muted-foreground">
                  <span>Players: <strong className="text-foreground">{v.players}</strong></span>
                  <span>Bid Range: <strong className="text-foreground">{v.minBid}–{v.maxBid}</strong></span>
                  <span>Win: <strong className="text-foreground">{v.winScore}</strong></span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}