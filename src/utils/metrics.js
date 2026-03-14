export function createMetrics() {
  return {
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    writes: 0,
    recursionDepth: 0,
  };
}

export function snapshotMetrics(metrics) {
  return {
    comparisons: metrics.comparisons,
    swaps: metrics.swaps,
    arrayAccesses: metrics.arrayAccesses,
    writes: metrics.writes,
    recursionDepth: metrics.recursionDepth,
  };
}

export function pushStep(steps, arr, comparing, sorted, message, metrics) {
  steps.push({
    array: [...arr],
    comparing,
    sorted,
    message,
    metrics: snapshotMetrics(metrics),
  });
}
