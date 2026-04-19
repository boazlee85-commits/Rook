import React from "react";
import { motion } from "framer-motion";
import { Crown, Users, Trophy, MapPin, Phone } from "lucide-react";

const ICONS = { Crown, Users, Trophy, MapPin, Phone };

export default function VersionCard({ version, isSelected, onSelect, index }) {
  const Icon = ICONS[version.icon] || Crown;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        w-full text-left p-5 rounded-xl border-2 transition-all
        ${isSelected 
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" 
          : "border-border bg-card hover:border-primary/30 hover:bg-card/80"
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center shrink-0
          ${isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}
        `}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-foreground">{version.name}</h3>
            <span className="text-xs font-body text-muted-foreground">{version.players}P</span>
          </div>
          <p className="text-sm text-muted-foreground font-body mt-1 leading-relaxed">
            {version.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}