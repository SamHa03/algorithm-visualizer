import React from "react";

const CATEGORY_OPTIONS = [
  { key: "sorting", label: "Sorting" },
  { key: "selection", label: "Selection" },
  { key: "graph", label: "Graph" },
];

export default function ControlsPanel({
  category,
  setCategory,
  algorithmKey,
  availableAlgorithms,
  setAlgorithmKey,
  algorithm,
  arraySize,
  setArraySize,
  manualInput,
  setManualInput,
  duplicateMode,
  setDuplicateMode,
  reorderMode,
  setReorderMode,
  onApplyManualInput,
  onGenerateArray,
  onApplyReorder,
}) {
  return (
    <>
      <section className="panel selection-panel">
        <div className="section-title">Selection</div>

        <div className="selection-button-group">
          <div>
            <label className="control-label">Category</label>
            <div className="tab-header-row">
              {CATEGORY_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`tab-button ${category === option.key ? "tab-button-active" : ""}`}
                  onClick={() => setCategory(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="control-label">Algorithm</label>
            <div className="tab-header-row">
              {Object.entries(availableAlgorithms).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  className={`tab-button ${algorithmKey === key ? "tab-button-active" : ""}`}
                  onClick={() => setAlgorithmKey(key)}
                >
                  {value.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="summary-grid algorithm-info-grid">
          <div className="metric-card">
            <div className="meta-title">Description</div>
            <div className="info-text">{algorithm.description}</div>
          </div>
          <div className="metric-card">
            <div className="meta-title">Time Complexity</div>
            <div className="info-text">{algorithm.timeComplexity}</div>
          </div>
          <div className="metric-card">
            <div className="meta-title">Space Complexity</div>
            <div className="info-text">{algorithm.spaceComplexity}</div>
          </div>
        </div>
      </section>

      <section className="panel configuration-panel">
        <div className="section-title">Configuration</div>

        <div className="controls-grid controls-grid-two">
          <div>
            <label className="control-label">Array Size</label>
            <input
              type="range"
              min="5"
              max="32"
              step="1"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="control-input"
            />
            <div className="helper-text">{arraySize} items</div>
          </div>

          <div>
            <label className="control-label">Duplicate Frequency</label>
            <select value={duplicateMode} onChange={(e) => setDuplicateMode(e.target.value)} className="control-input">
              <option value="normal">Normal</option>
              <option value="high">High Duplicates</option>
            </select>
          </div>
        </div>

        <div className="controls-grid controls-grid-two">
          <div>
            <label className="control-label">Enter Numbers Manually</label>
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="control-textarea"
              placeholder="Example: 9, 3, 7, 1, 7, 4"
            />
            <div className="button-row compact-row">
              <button onClick={onApplyManualInput}>Apply Numbers</button>
              <button onClick={onGenerateArray}>Generate Numbers</button>
            </div>
          </div>

          <div>
            <label className="control-label">Reorder Array</label>
            <select value={reorderMode} onChange={(e) => setReorderMode(e.target.value)} className="control-input">
              <option value="random">Random</option>
              <option value="sorted">Sorted</option>
              <option value="reverse">Reverse Sorted</option>
              <option value="nearly">Nearly Sorted</option>
            </select>
            <div className="button-row compact-row">
              <button onClick={onApplyReorder}>Apply Reordering</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}