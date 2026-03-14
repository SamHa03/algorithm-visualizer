import React from "react";

export default function SummaryCards({ algorithm, currentStep }) {
  return (
    <div className="summary-grid">
      <div className="panel">
        <div className="meta-title">How it works</div>
        <div>{algorithm.description}</div>
      </div>
      <div className="panel">
        <div className="meta-title">Complexity</div>
        <div>{algorithm.complexity}</div>
      </div>
      <div className="panel">
        <div className="meta-title">Current step</div>
        <div>{currentStep.message}</div>
      </div>
    </div>
  );
}