import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GameMessage({ message }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-center py-2 px-4 bg-primary/10 border border-primary/20 rounded-lg"
        >
          <p className="text-sm font-body text-primary font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}