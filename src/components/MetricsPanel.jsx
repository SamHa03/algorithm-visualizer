import React from "react";

function Metric({ value, label }) {
  return (
    <div className="metric-chip">
      <div className="metric-chip-value">{value}</div>
      <div className="metric-chip-label">{label}</div>
    </div>
  );
}

export default function MetricsPanel({ metrics }) {
  return (
    <section className="metrics-panel-compact">
      <Metric value={metrics.comparisons} label="Comparisons" />
      <Metric value={metrics.swaps} label="Swaps" />
      <Metric value={metrics.arrayAccesses} label="Accesses" />
      <Metric value={metrics.writes} label="Writes" />
      <Metric value={metrics.recursionDepth} label="Depth" />
    </section>
  );
}
