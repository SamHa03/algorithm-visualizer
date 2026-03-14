import React, { useEffect, useMemo, useRef, useState } from "react";
import { algorithms, DEFAULT_ARRAY } from "../data/algorithms";
import { randomArray } from "../utils/randomArray";
import ControlsPanel from "./ControlsPanel";
import MetricsPanel from "./MetricsPanel";
import VisualizationPanel from "./VisualizationPanel";
import CodeExamples from "./CodeExamples";

const CATEGORY_MAP = {
  sorting: ["bubble", "selection", "insertion", "merge", "quick"],
  selection: [],
  graph: [],
};

function clampArraySize(values, size) {
  const next = [...values].slice(0, size);
  while (next.length < size) next.push(Math.floor(Math.random() * 95) + 5);
  return next;
}

function generateArrayByMode(size, duplicateMode) {
  if (duplicateMode === "high") {
    const pool = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    return Array.from({ length: size }, () => pool[Math.floor(Math.random() * pool.length)]);
  }
  return randomArray(size);
}

function nearlySortedArray(values) {
  const next = [...values].sort((a, b) => a - b);
  if (next.length < 4) return next;
  const i = Math.floor(next.length / 3);
  const j = Math.floor((next.length * 2) / 3);
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function reorderArray(values, mode) {
  if (mode === "sorted") return [...values].sort((a, b) => a - b);
  if (mode === "reverse") return [...values].sort((a, b) => b - a);
  if (mode === "nearly") return nearlySortedArray(values);
  return randomArray(values.length);
}

function inferActiveCodeLine(stepMessage, algorithmKey) {
  const message = (stepMessage || "").toLowerCase();

  if (algorithmKey === "bubble") {
    if (message.includes("compare")) return { python: 4, cpp: 4, java: 4 };
    if (message.includes("swap")) return { python: 5, cpp: 5, java: 5 };
    return { python: 3, cpp: 3, java: 3 };
  }
  if (algorithmKey === "selection") {
    if (message.includes("new minimum") || message.includes("compare current minimum")) return { python: 5, cpp: 5, java: 5 };
    if (message.includes("swap")) return { python: 6, cpp: 6, java: 8 };
    return { python: 3, cpp: 3, java: 3 };
  }
  if (algorithmKey === "insertion") {
    if (message.includes("pick")) return { python: 2, cpp: 2, java: 2 };
    if (message.includes("compare") || message.includes("shift")) return { python: 5, cpp: 5, java: 5 };
    if (message.includes("insert")) return { python: 7, cpp: 8, java: 8 };
    return { python: 2, cpp: 2, java: 2 };
  }
  if (algorithmKey === "merge") {
    if (message.includes("compare")) return { python: 10, cpp: 11, java: 11 };
    if (message.includes("write") || message.includes("copy")) return { python: 11, cpp: 12, java: 12 };
    return { python: 6, cpp: 6, java: 6 };
  }
  if (algorithmKey === "quick") {
    if (message.includes("choose pivot")) return { python: 4, cpp: 4, java: 4 };
    if (message.includes("compare")) return { python: 5, cpp: 6, java: 8 };
    if (message.includes("move") || message.includes("place pivot")) return { python: 6, cpp: 7, java: 9 };
    return { python: 4, cpp: 4, java: 4 };
  }
  return { python: null, cpp: null, java: null };
}

export default function AlgorithmVisualizer() {
  const [category, setCategory] = useState("sorting");
  const [algorithmKey, setAlgorithmKey] = useState("bubble");
  const [baseArray, setBaseArray] = useState(DEFAULT_ARRAY);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedPercent, setSpeedPercent] = useState(60);
  const [language, setLanguage] = useState("python");
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY.length);
  const [manualInput, setManualInput] = useState(DEFAULT_ARRAY.join(", "));
  const [duplicateMode, setDuplicateMode] = useState("normal");
  const [reorderMode, setReorderMode] = useState("random");
  const timerRef = useRef(null);

  const availableAlgorithms = useMemo(() => {
    const keys = CATEGORY_MAP[category] || [];
    return keys.reduce((acc, key) => {
      if (algorithms[key]) acc[key] = algorithms[key];
      return acc;
    }, {});
  }, [category]);

  useEffect(() => {
    const keys = Object.keys(availableAlgorithms);
    if (!keys.includes(algorithmKey)) setAlgorithmKey(keys[0] || "bubble");
  }, [availableAlgorithms, algorithmKey]);

  const algorithm = algorithms[algorithmKey] || algorithms.bubble;
  const steps = useMemo(() => algorithm.steps(baseArray), [algorithm, baseArray]);
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const activeCodeLine = inferActiveCodeLine(currentStep?.message, algorithmKey);
  const speedMs = Math.max(20, Math.round(1020 - speedPercent * 10));

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [algorithmKey, baseArray]);

  useEffect(() => {
    setBaseArray((previous) => clampArraySize(previous, arraySize));
  }, [arraySize]);

  useEffect(() => {
    setManualInput(baseArray.join(", "));
  }, [baseArray]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }
    timerRef.current = window.setTimeout(() => setStepIndex((previous) => previous + 1), speedMs);
    return () => window.clearTimeout(timerRef.current);
  }, [isPlaying, stepIndex, steps.length, speedMs]);

  const handleApplyManualInput = () => {
    const parsed = manualInput
      .split(/[,\s]+/)
      .map((value) => Number(value.trim()))
      .filter((value) => !Number.isNaN(value));
    if (parsed.length > 0) setBaseArray(clampArraySize(parsed, arraySize));
  };

  const handleGenerateArray = () => {
    setIsPlaying(false);
    setBaseArray(generateArrayByMode(arraySize, duplicateMode));
    setStepIndex(0);
  };

  const handleApplyReorder = () => {
    setIsPlaying(false);
    setBaseArray((previous) => reorderArray(previous, reorderMode));
    setStepIndex(0);
  };

  const handleBarMove = (index, direction) => {
    setIsPlaying(false);
    setBaseArray((previous) => {
      const next = [...previous];
      const target = index + direction;
      if (target < 0 || target >= next.length) return next;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setStepIndex(0);
  };

  return (
    <main className="page-shell">
      <section className="hero-panel hero-panel-simple">
        <h1>Algorithm Visualizer</h1>
      </section>

      <ControlsPanel
        category={category}
        setCategory={setCategory}
        algorithmKey={algorithmKey}
        availableAlgorithms={availableAlgorithms}
        setAlgorithmKey={setAlgorithmKey}
        algorithm={algorithm}
        arraySize={arraySize}
        setArraySize={setArraySize}
        manualInput={manualInput}
        setManualInput={setManualInput}
        duplicateMode={duplicateMode}
        setDuplicateMode={setDuplicateMode}
        reorderMode={reorderMode}
        setReorderMode={setReorderMode}
        onApplyManualInput={handleApplyManualInput}
        onGenerateArray={handleGenerateArray}
        onApplyReorder={handleApplyReorder}
      />

      <section className="panel visualization-section">
        <div className="section-title">Visualization</div>

        <div className="button-row visualization-controls-row">
          <button onClick={() => setIsPlaying((value) => !value)}>{isPlaying ? "Pause" : "Play"}</button>
          <button onClick={() => { setIsPlaying(false); setStepIndex(0); }}>Reset</button>
          <button onClick={() => { setIsPlaying(false); setStepIndex((previous) => Math.min(previous + 1, steps.length - 1)); }}>Step Forward</button>
        </div>

        <div className="controls-grid controls-grid-two speed-row">
          <div>
            <label className="control-label">Speed</label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={speedPercent}
              onChange={(e) => setSpeedPercent(Number(e.target.value))}
              className="control-input"
            />
            <div className="helper-text">{speedPercent}%</div>
          </div>
        </div>

        <MetricsPanel metrics={currentStep.metrics} />
        <VisualizationPanel
          currentStep={currentStep}
          stepIndex={stepIndex}
          totalSteps={steps.length}
          baseArray={baseArray}
          onMoveLeft={(index) => handleBarMove(index, -1)}
          onMoveRight={(index) => handleBarMove(index, 1)}
          isPlaying={isPlaying}
        />
        <CodeExamples algorithm={algorithm} language={language} setLanguage={setLanguage} activeCodeLine={activeCodeLine} />
      </section>
    </main>
  );
}
