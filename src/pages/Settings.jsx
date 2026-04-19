import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VERSIONS } from "@/lib/gameVersions";
import { getRookSettings, saveRookSettings } from "@/lib/gameSettings";
import VersionCard from "@/components/home/VersionCard";

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => getRookSettings());
  const selectedVersion = settings.version;
  const currentVersion = VERSIONS[selectedVersion];

  useEffect(() => {
    saveRookSettings(settings);
  }, [settings]);

  function updateSetting(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function usePreset(version) {
    setSettings({
      version: version.id,
      winScore: version.winScore,
      minBid: version.minBid,
      bidIncrement: version.bidIncrement,
    });
  }

  function resetToPreset() {
    usePreset(currentVersion);
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
            <p className="font-body text-sm text-muted-foreground">Pick the kind of Rook game you want to play</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {Object.values(VERSIONS).map((version, index) => (
            <VersionCard
              key={version.id}
              version={version}
              isSelected={selectedVersion === version.id}
              onSelect={() => usePreset(version)}
              index={index}
            />
          ))}
        </div>

        <motion.div
          key={selectedVersion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 mb-6 space-y-6"
        >
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">
              {currentVersion.name} Rules
            </h3>
            <div className="space-y-2 font-body text-sm text-muted-foreground leading-relaxed">
              <p>{currentVersion.rules}</p>
              <p className="text-primary/80">{currentVersion.pointCards}</p>
              <div className="flex gap-4 mt-3 pt-3 border-t border-border">
                <span>Players: <strong className="text-foreground">{currentVersion.players}</strong></span>
                <span>Min Bid: <strong className="text-foreground">{currentVersion.minBid}</strong></span>
                <span>Win at: <strong className="text-foreground">{currentVersion.winScore}</strong></span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="font-display text-base text-foreground">Custom rule tweaks</h4>
                <p className="font-body text-sm text-muted-foreground">
                  Adjust the match goal and bidding for a faster or tougher round.
                </p>
              </div>
              <Button variant="outline" onClick={resetToPreset} className="font-body">
                Reset Preset
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="font-body text-sm text-muted-foreground">
                Winning score
                <input
                  type="number"
                  min="100"
                  max="1000"
                  step="10"
                  value={settings.winScore}
                  onChange={(event) => updateSetting("winScore", Number(event.target.value) || currentVersion.winScore)}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>

              <label className="font-body text-sm text-muted-foreground">
                Opening bid
                <input
                  type="number"
                  min="50"
                  max={currentVersion.maxBid}
                  step="5"
                  value={settings.minBid}
                  onChange={(event) => updateSetting("minBid", Number(event.target.value) || currentVersion.minBid)}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>

              <label className="font-body text-sm text-muted-foreground">
                Bid step
                <input
                  type="number"
                  min="5"
                  max="20"
                  step="5"
                  value={settings.bidIncrement}
                  onChange={(event) => updateSetting("bidIncrement", Number(event.target.value) || currentVersion.bidIncrement)}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>
            </div>
          </div>
        </motion.div>

        <Button
          onClick={() => navigate("/game")}
          className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-body text-lg gap-3 rounded-xl shadow-lg shadow-primary/20"
        >
          <Play className="w-5 h-5" />
          Play {currentVersion.name}
        </Button>
      </div>
    </div>
  );
}
