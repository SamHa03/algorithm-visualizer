import React from "react";
import Bar from "./Bar";

export default function VisualizationPanel({
  currentStep,
  stepIndex,
  totalSteps,
  baseArray,
  onMoveLeft,
  onMoveRight,
  isPlaying,
}) {
  const maxValue = Math.max(...currentStep.array, 1);

  return (
    <section className="panel visualization-panel">
      <div className="visualization-header">
        <div>Array state: [{currentStep.array.join(", ")}]</div>
        <div>Step {stepIndex + 1} of {totalSteps}</div>
      </div>

      {!isPlaying && (
        <div className="manual-reorder-row">
          {baseArray.map((value, index) => (
            <div key={`${index}-${value}`} className="manual-reorder-card">
              <div className="manual-reorder-value">{value}</div>
              <div className="manual-reorder-buttons">
                <button onClick={() => onMoveLeft(index)}>←</button>
                <button onClick={() => onMoveRight(index)}>→</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bars-area">
        {currentStep.array.map((value, index) => (
          <div key={`${index}-${value}-${stepIndex}`} className="bars-column">
            <Bar
              value={value}
              maxValue={maxValue}
              isComparing={currentStep.comparing.includes(index)}
              isSorted={currentStep.sorted.includes(index)}
            />
          </div>
        ))}
      </div>

      <div className="legend-row">
        <span className="legend-pill"><span className="dot dot-comparing" /> Compared</span>
        <span className="legend-pill"><span className="dot dot-sorted" /> Sorted</span>
        <span className="legend-pill"><span className="dot dot-unsorted" /> Unsorted</span>
      </div>
    </section>
  );
}
