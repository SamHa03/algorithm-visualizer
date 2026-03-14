import React from "react";
import { motion } from "framer-motion";

export default function Bar({ value, maxValue, isComparing, isSorted }) {
  const height = `${(value / maxValue) * 100}%`;
  let barClass = "bar";
  if (isSorted) barClass = "bar bar-sorted";
  if (isComparing) barClass = "bar bar-comparing";

  return (
    <div className="bar-wrapper">
      <div className="bar-label">{value}</div>
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className={barClass}
        style={{ height, minHeight: "12%" }}
      />
    </div>
  );
}