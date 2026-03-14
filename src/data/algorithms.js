import { createMetrics, pushStep } from "../utils/metrics";

const DEFAULT_ARRAY = [42, 17, 8, 99, 23, 61, 4, 75, 12, 54, 30, 88];

function bubbleSortSteps(input) {
  const arr = [...input];
  const metrics = createMetrics();
  const steps = [];
  const sorted = [];
  pushStep(steps, arr, [], [], "Initial array", metrics);

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      metrics.comparisons += 1;
      metrics.arrayAccesses += 2;
      pushStep(steps, arr, [j, j + 1], [...sorted], `Compare ${arr[j]} and ${arr[j + 1]}`, metrics);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        metrics.swaps += 1;
        metrics.writes += 2;
        metrics.arrayAccesses += 2;
        pushStep(steps, arr, [j, j + 1], [...sorted], `Swap ${arr[j]} and ${arr[j + 1]}`, metrics);
      }
    }
    sorted.unshift(arr.length - 1 - i);
    pushStep(steps, arr, [], [...sorted], `${arr[arr.length - 1 - i]} is now in its final position`, metrics);
  }
  return steps;
}

function selectionSortSteps(input) {
  const arr = [...input];
  const metrics = createMetrics();
  const steps = [];
  const sorted = [];
  pushStep(steps, arr, [], [], "Initial array", metrics);

  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    pushStep(steps, arr, [i], [...sorted], `Start searching for the minimum from index ${i}`, metrics);
    for (let j = i + 1; j < arr.length; j++) {
      metrics.comparisons += 1;
      metrics.arrayAccesses += 2;
      pushStep(steps, arr, [minIndex, j], [...sorted], `Compare current minimum ${arr[minIndex]} with ${arr[j]}`, metrics);
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        pushStep(steps, arr, [i, minIndex], [...sorted], `New minimum found: ${arr[minIndex]}`, metrics);
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      metrics.swaps += 1;
      metrics.writes += 2;
      metrics.arrayAccesses += 2;
      pushStep(steps, arr, [i, minIndex], [...sorted], `Swap ${arr[minIndex]} into position ${i}`, metrics);
    }
    sorted.push(i);
    pushStep(steps, arr, [], [...sorted], `${arr[i]} is fixed in its final position`, metrics);
  }
  return steps;
}

function insertionSortSteps(input) {
  const arr = [...input];
  const metrics = createMetrics();
  const steps = [];
  const sorted = [0];
  pushStep(steps, arr, [0], [0], "First element starts as sorted", metrics);

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    pushStep(steps, arr, [i], [...sorted], `Pick ${key} to insert into the sorted section`, metrics);
    while (j >= 0) {
      metrics.comparisons += 1;
      metrics.arrayAccesses += 1;
      pushStep(steps, arr, [j, j + 1], [...sorted], `Compare ${arr[j]} with key ${key}`, metrics);
      if (!(arr[j] > key)) break;
      arr[j + 1] = arr[j];
      metrics.writes += 1;
      pushStep(steps, arr, [j, j + 1], [...sorted], `Shift ${arr[j + 1]} to the right`, metrics);
      j -= 1;
    }
    arr[j + 1] = key;
    metrics.writes += 1;
    for (let k = 0; k <= i; k++) if (!sorted.includes(k)) sorted.push(k);
    pushStep(steps, arr, [j + 1], [...sorted].sort((a, b) => a - b), `Insert ${key} at position ${j + 1}`, metrics);
  }
  return steps;
}

function mergeSortSteps(input) {
  const arr = [...input];
  const metrics = createMetrics();
  const steps = [];
  pushStep(steps, arr, [], [], "Initial array", metrics);

  function merge(start, mid, end) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0;
    let j = 0;
    let k = start;
    while (i < left.length && j < right.length) {
      metrics.comparisons += 1;
      pushStep(steps, arr, [start + i, mid + 1 + j], [], `Compare ${left[i]} and ${right[j]} while merging`, metrics);
      if (left[i] <= right[j]) arr[k] = left[i++];
      else arr[k] = right[j++];
      metrics.writes += 1;
      pushStep(steps, arr, [k], [], `Write ${arr[k]} into merged position ${k}`, metrics);
      k += 1;
    }
    while (i < left.length) {
      arr[k] = left[i++];
      metrics.writes += 1;
      pushStep(steps, arr, [k], [], `Copy remaining left value ${arr[k]}`, metrics);
      k += 1;
    }
    while (j < right.length) {
      arr[k] = right[j++];
      metrics.writes += 1;
      pushStep(steps, arr, [k], [], `Copy remaining right value ${arr[k]}`, metrics);
      k += 1;
    }
  }

  function sort(start, end, depth = 1) {
    metrics.recursionDepth = Math.max(metrics.recursionDepth, depth);
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    sort(start, mid, depth + 1);
    sort(mid + 1, end, depth + 1);
    merge(start, mid, end);
  }

  sort(0, arr.length - 1);
  pushStep(steps, arr, [], arr.map((_, idx) => idx), "Array fully sorted", metrics);
  return steps;
}

function quickSortSteps(input) {
  const arr = [...input];
  const metrics = createMetrics();
  const steps = [];
  const sortedSet = new Set();
  pushStep(steps, arr, [], [], "Initial array", metrics);

  function partition(low, high) {
    const pivot = arr[high];
    pushStep(steps, arr, [high], [...sortedSet], `Choose pivot ${pivot}`, metrics);
    let i = low - 1;
    for (let j = low; j < high; j++) {
      metrics.comparisons += 1;
      pushStep(steps, arr, [j, high], [...sortedSet], `Compare ${arr[j]} with pivot ${pivot}`, metrics);
      if (arr[j] < pivot) {
        i += 1;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        metrics.swaps += 1;
        pushStep(steps, arr, [i, j], [...sortedSet], `Move ${arr[i]} before the pivot`, metrics);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    metrics.swaps += 1;
    sortedSet.add(i + 1);
    pushStep(steps, arr, [i + 1], [...sortedSet], `Place pivot ${pivot} into its final position`, metrics);
    return i + 1;
  }

  function sort(low, high, depth = 1) {
    metrics.recursionDepth = Math.max(metrics.recursionDepth, depth);
    if (low < high) {
      const pivotIndex = partition(low, high);
      sort(low, pivotIndex - 1, depth + 1);
      sort(pivotIndex + 1, high, depth + 1);
    } else if (low === high) sortedSet.add(low);
  }

  sort(0, arr.length - 1);
  pushStep(steps, arr, [], arr.map((_, idx) => idx), "Array fully sorted", metrics);
  return steps;
}

export const algorithms = {
  bubble: {
    category: "sorting",
    label: "Bubble Sort",
    description: "Repeatedly compares adjacent values and swaps them when they are out of order.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    steps: bubbleSortSteps,
    code: {
      python: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr`,
      cpp: `vector<int> bubbleSort(vector<int> arr) {\n    int n = arr.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap(arr[j], arr[j + 1]);\n            }\n        }\n    }\n    return arr;\n}`,
      java: `public static int[] bubbleSort(int[] arr) {\n    int n = arr.length;\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n    return arr;\n}`,
    },
  },
  selection: {
    category: "sorting",
    label: "Selection Sort",
    description: "Finds the smallest remaining element and places it into the next sorted position.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    steps: selectionSortSteps,
    code: {
      python: `def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_index = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_index]:\n                min_index = j\n        arr[i], arr[min_index] = arr[min_index], arr[i]\n    return arr`,
      cpp: `vector<int> selectionSort(vector<int> arr) {\n    int n = arr.size();\n    for (int i = 0; i < n; i++) {\n        int minIndex = i;\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIndex]) {\n                minIndex = j;\n            }\n        }\n        swap(arr[i], arr[minIndex]);\n    }\n    return arr;\n}`,
      java: `public static int[] selectionSort(int[] arr) {\n    for (int i = 0; i < arr.length; i++) {\n        int minIndex = i;\n        for (int j = i + 1; j < arr.length; j++) {\n            if (arr[j] < arr[minIndex]) {\n                minIndex = j;\n            }\n        }\n        int temp = arr[i];\n        arr[i] = arr[minIndex];\n        arr[minIndex] = temp;\n    }\n    return arr;\n}`,
    },
  },
  insertion: {
    category: "sorting",
    label: "Insertion Sort",
    description: "Builds a sorted section one value at a time by inserting each element where it belongs.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    steps: insertionSortSteps,
    code: {
      python: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr`,
      cpp: `vector<int> insertionSort(vector<int> arr) {\n    for (int i = 1; i < arr.size(); i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }\n    return arr;\n}`,
      java: `public static int[] insertionSort(int[] arr) {\n    for (int i = 1; i < arr.length; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }\n    return arr;\n}`,
    },
  },
  merge: {
    category: "sorting",
    label: "Merge Sort",
    description: "Divides the array into smaller halves, sorts them, then merges them back together.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    steps: mergeSortSteps,
    code: {
      python: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n\n    merged = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] < right[j]:\n            merged.append(left[i])\n            i += 1\n        else:\n            merged.append(right[j])\n            j += 1\n\n    merged.extend(left[i:])\n    merged.extend(right[j:])\n    return merged`,
      cpp: `vector<int> mergeSort(vector<int> arr) {\n    if (arr.size() <= 1) return arr;\n\n    int mid = arr.size() / 2;\n    vector<int> left(arr.begin(), arr.begin() + mid);\n    vector<int> right(arr.begin() + mid, arr.end());\n\n    left = mergeSort(left);\n    right = mergeSort(right);\n\n    vector<int> merged;\n    int i = 0, j = 0;\n    while (i < left.size() && j < right.size()) {\n        if (left[i] < right[j]) merged.push_back(left[i++]);\n        else merged.push_back(right[j++]);\n    }\n    while (i < left.size()) merged.push_back(left[i++]);\n    while (j < right.size()) merged.push_back(right[j++]);\n    return merged;\n}`,
      java: `public static int[] mergeSort(int[] arr) {\n    if (arr.length <= 1) return arr;\n\n    int mid = arr.length / 2;\n    int[] left = java.util.Arrays.copyOfRange(arr, 0, mid);\n    int[] right = java.util.Arrays.copyOfRange(arr, mid, arr.length);\n\n    left = mergeSort(left);\n    right = mergeSort(right);\n\n    int[] merged = new int[arr.length];\n    int i = 0, j = 0, k = 0;\n    while (i < left.length && j < right.length) {\n        if (left[i] < right[j]) merged[k++] = left[i++];\n        else merged[k++] = right[j++];\n    }\n    while (i < left.length) merged[k++] = left[i++];\n    while (j < right.length) merged[k++] = right[j++];\n    return merged;\n}`,
    },
  },
  quick: {
    category: "sorting",
    label: "Quick Sort",
    description: "Chooses a pivot, partitions the array around it, and recursively sorts the partitions.",
    timeComplexity: "Average O(n log n), Worst O(n²)",
    spaceComplexity: "O(log n)",
    steps: quickSortSteps,
    code: {
      python: `def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n\n    pivot = arr[-1]\n    left = [x for x in arr[:-1] if x < pivot]\n    right = [x for x in arr[:-1] if x >= pivot]\n    return quick_sort(left) + [pivot] + quick_sort(right)`,
      cpp: `vector<int> quickSort(vector<int> arr) {\n    if (arr.size() <= 1) return arr;\n\n    int pivot = arr.back();\n    vector<int> left, right;\n    for (int i = 0; i < arr.size() - 1; i++) {\n        if (arr[i] < pivot) left.push_back(arr[i]);\n        else right.push_back(arr[i]);\n    }\n\n    left = quickSort(left);\n    right = quickSort(right);\n    left.push_back(pivot);\n    left.insert(left.end(), right.begin(), right.end());\n    return left;\n}`,
      java: `public static java.util.List<Integer> quickSort(java.util.List<Integer> arr) {\n    if (arr.size() <= 1) return arr;\n\n    int pivot = arr.get(arr.size() - 1);\n    java.util.List<Integer> left = new java.util.ArrayList<>();\n    java.util.List<Integer> right = new java.util.ArrayList<>();\n\n    for (int i = 0; i < arr.size() - 1; i++) {\n        if (arr.get(i) < pivot) left.add(arr.get(i));\n        else right.add(arr.get(i));\n    }\n\n    java.util.List<Integer> result = new java.util.ArrayList<>();\n    result.addAll(quickSort(left));\n    result.add(pivot);\n    result.addAll(quickSort(right));\n    return result;\n}`,
    },
  },
};

export { DEFAULT_ARRAY };
