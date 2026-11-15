import type { CaseStudyContent, CodingContent, Reference } from "./types";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Fixture = [input: Json, expected: Json, explanation?: string];
type Exercise = Omit<CodingContent, "examples" | "testCases"> & {
  fixtures: Fixture[];
};

const complexityReference: Reference = {
  title: "Time complexity",
  url: "https://www.interviewbit.com/courses/programming/time-complexity/",
  provider: "InterviewBit",
};
const pointersReference: Reference = {
  title: "Two pointers technique",
  url: "https://www.geeksforgeeks.org/dsa/two-pointers-technique/",
  provider: "GeeksforGeeks",
};
const queueReference: Reference = {
  title: "Queue-based load leveling",
  url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling",
  provider: "Microsoft Learn",
};
const cacheReference: Reference = {
  title: "Cache-aside",
  url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside",
  provider: "Microsoft Learn",
};
const claimCheckReference: Reference = {
  title: "Claim Check pattern",
  url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/claim-check",
  provider: "Microsoft Learn",
};
const compensationReference: Reference = {
  title: "Compensating Transaction pattern",
  url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction",
  provider: "Microsoft Learn",
};
const consumersReference: Reference = {
  title: "Competing Consumers pattern",
  url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/competing-consumers",
  provider: "Microsoft Learn",
};
const priorityReference: Reference = {
  title: "Priority Queue pattern",
  url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/priority-queue",
  provider: "Microsoft Learn",
};

function exercise({ fixtures, ...content }: Exercise): CodingContent {
  return {
    ...content,
    solution: `${content.solution}\n\n## Further reading\n\n[${complexityReference.title}](${complexityReference.url}) explains asymptotic analysis. This exercise, explanation, and implementation are original; the link is background reading, not a source of question-bank solutions.`,
    examples: fixtures.slice(0, 2).map(([input, expected, explanation]) => ({
      input: JSON.stringify(input),
      output: JSON.stringify(expected),
      explanation: explanation ?? "Apply the stated contract to this input.",
    })),
    testCases: fixtures.map(([input, expected], index) => ({
      input: JSON.stringify(input),
      expected: JSON.stringify(expected),
      hidden: index >= 4,
    })),
  };
}

export const codingContent: CodingContent[] = [
  exercise({
    key: "practice-stable-sensor-ranks",
    title: "Stable ranks for sensor readings",
    difficulty: "EASY",
    category: "Arrays",
    description:
      'A dashboard replaces readings with dense ranks: the smallest distinct value gets rank 1, the next rank 2, and equal values share a rank. Preserve original reading order. Input is a JSON object {"readings": number[]}; output is {"ranks": number[]}. An empty input array produces an empty rank array.',
    constraints:
      "0 <= readings.length <= 100000; each reading is an integer in [-1000000, 1000000].",
    tags: ["arrays", "sorting", "hashing", "coordinate-compression"],
    hints: [
      "Sort distinct readings rather than rearranging the dashboard's input.",
      "Build a value-to-rank lookup, then map the original sequence.",
    ],
    solution:
      "## Approach\n\nDeduplicate the readings and sort those values numerically. Assign each value its one-based position in this sorted list. A lookup map allows the final pass to preserve duplicates and input order. If two readings are equal they use the same map entry; every smaller distinct value precedes them, proving the dense-rank property.\n\n## Complexity\n\nFor n readings and u distinct values, time is O(n + u log u); auxiliary space is O(u), excluding the O(n) output.",
    solutionCode: `function solve(input) {
  const values = [...new Set(input.readings)].sort((a, b) => a - b);
  const ranks = new Map(values.map((value, index) => [value, index + 1]));
  return { ranks: input.readings.map(value => ranks.get(value)) };
}`,
    fixtures: [
      [
        { readings: [40, 10, 40, 20] },
        { ranks: [3, 1, 3, 2] },
        "Distinct readings are 10, 20, 40; both 40s receive rank 3.",
      ],
      [
        { readings: [-2, 0, -5] },
        { ranks: [2, 3, 1] },
        "-5 is the smallest, followed by -2 and 0; original order is retained.",
      ],
      [{ readings: [] }, { ranks: [] }],
      [{ readings: [7] }, { ranks: [1] }],
      [{ readings: [3, 3, 3] }, { ranks: [1, 1, 1] }],
      [{ readings: [0, -1, 1, -1] }, { ranks: [2, 1, 3, 1] }],
    ],
  }),
  exercise({
    key: "practice-crate-reconciliation",
    title: "Reconcile crate counts",
    difficulty: "EASY",
    category: "Hashing",
    description:
      'Each integer identifies a crate type; duplicates represent separate crates. Report the net changes needed to transform a before inventory into an after inventory. Input: {"before": number[], "after": number[]}. Output: {"changes": [[type, delta], ...]}, sorted by numeric type, omitting zero deltas. Positive deltas mean add crates, negative deltas mean remove.',
    constraints: "Each array has 0..100000 entries; type IDs are integers in [-1000000, 1000000].",
    tags: ["hashing", "frequency-map", "arrays", "sorting"],
    hints: [
      "Decrement a type's count for every before entry and increment for every after entry.",
      "Remove zero counts only after both arrays have been processed.",
    ],
    solution:
      "## Approach\n\nKeep a signed frequency map. A before occurrence contributes -1; an after occurrence contributes +1. The sum for a type is exactly its required net change. Filter unchanged types and sort entries by ID for deterministic output. No assumption about input order is needed.\n\n## Complexity\n\nWith n total occurrences and u distinct IDs, time is O(n + u log u) and auxiliary space is O(u).",
    solutionCode: `function solve(input) {
  const counts = new Map();
  for (const id of input.before) counts.set(id, (counts.get(id) || 0) - 1);
  for (const id of input.after) counts.set(id, (counts.get(id) || 0) + 1);
  return { changes: [...counts].filter(([, count]) => count !== 0).sort((a, b) => a[0] - b[0]) };
}`,
    fixtures: [
      [
        { before: [2, 2, 5], after: [2, 7, 7] },
        {
          changes: [
            [2, -1],
            [5, -1],
            [7, 2],
          ],
        },
        "One type 2 and type 5 leave; two type 7 crates arrive.",
      ],
      [
        { before: [-1, 0], after: [0, -1] },
        { changes: [] },
        "Only order changed, so every net frequency is zero.",
      ],
      [{ before: [], after: [] }, { changes: [] }],
      [{ before: [], after: [4] }, { changes: [[4, 1]] }],
      [{ before: [3, 3], after: [] }, { changes: [[3, -2]] }],
      [
        { before: [-3, -3, 2], after: [-3, 2, 2] },
        {
          changes: [
            [-3, -1],
            [2, 1],
          ],
        },
      ],
    ],
  }),
  exercise({
    key: "practice-distinct-budget-pairs",
    title: "Distinct budget pairs",
    difficulty: "MEDIUM",
    category: "Two pointers",
    description:
      'Choose two different positions from a sorted list of credits whose values sum to a budget. Return each distinct value pair once, not index pairs. Input: {"credits": number[], "budget": number}. Output: {"pairs": [[a,b], ...]} with a <= b, sorted lexicographically by numeric values. A pair [a,a] requires two occurrences.',
    constraints:
      "0 <= credits.length <= 100000; credits are sorted nondecreasing integers in [-1000000, 1000000]; budget is an integer in [-2000000, 2000000].",
    tags: ["two-pointers", "sorted-array", "deduplication", "pair-sum"],
    hints: [
      "A sum that is too small cannot be fixed by reducing the right value.",
      "After a match, skip all occurrences of both endpoint values.",
    ],
    solution: `## Approach\n\nPlace one pointer at each end. If their sum is too low, advance the left pointer; every smaller right partner would also fail for that left value. If too high, retreat the right pointer by the symmetric argument. On equality, record the pair and skip duplicate endpoint values. Requiring \`left < right\` prevents reuse of one position.\n\n## Complexity\n\nEach pointer crosses the array once: O(n) time and O(1) auxiliary space excluding output.\n\nBackground: [two pointers](${pointersReference.url}) describes the general pattern; this budget exercise and code are independently authored.`,
    solutionCode: `function solve(input) {
  const a = input.credits, pairs = [];
  let left = 0, right = a.length - 1;
  while (left < right) {
    const sum = a[left] + a[right];
    if (sum < input.budget) left++;
    else if (sum > input.budget) right--;
    else {
      const x = a[left], y = a[right];
      pairs.push([x, y]);
      while (left < right && a[left] === x) left++;
      while (left < right && a[right] === y) right--;
    }
  }
  return { pairs };
}`,
    fixtures: [
      [
        { credits: [1, 1, 2, 3, 4, 4], budget: 5 },
        {
          pairs: [
            [1, 4],
            [2, 3],
          ],
        },
        "Repeated 1s and 4s still yield one value pair; 2 and 3 give the other.",
      ],
      [
        { credits: [-3, -1, 0, 1, 3], budget: 0 },
        {
          pairs: [
            [-3, 3],
            [-1, 1],
          ],
        },
        "Zero cannot pair with itself because it appears only once.",
      ],
      [{ credits: [], budget: 0 }, { pairs: [] }],
      [{ credits: [2], budget: 4 }, { pairs: [] }],
      [{ credits: [2, 2, 2], budget: 4 }, { pairs: [[2, 2]] }],
      [{ credits: [-4, -2, 1, 8], budget: 7 }, { pairs: [] }],
    ],
  }),
  exercise({
    key: "practice-squared-offsets",
    title: "Order squared calibration offsets",
    difficulty: "EASY",
    category: "Two pointers",
    description:
      'Calibration offsets are sorted but may be negative. Produce their squares in nondecreasing order without calling a sorting routine. Input: {"offsets": number[]}. Output: {"squares": number[]}. Duplicates remain duplicated.',
    constraints:
      "0 <= offsets.length <= 100000; offsets are nondecreasing integers in [-1000000, 1000000].",
    tags: ["two-pointers", "arrays", "sorted-array", "reverse-fill"],
    hints: [
      "The largest absolute offset must occur at an endpoint.",
      "Fill the output from right to left using the larger endpoint square.",
    ],
    solution:
      "## Approach\n\nMaintain the unconsumed interval between two endpoints. Compare the endpoint squares and write the larger into the last unfilled output slot. Remove that endpoint and repeat. The maximum absolute value in a sorted interval is always at an endpoint, so each write is the largest remaining square. Reverse filling therefore produces ascending order.\n\n## Complexity\n\nO(n) time and O(1) auxiliary space beyond the O(n) result.",
    solutionCode: `function solve(input) {
  const a = input.offsets, squares = new Array(a.length);
  let left = 0, right = a.length - 1;
  for (let at = a.length - 1; at >= 0; at--) {
    if (Math.abs(a[left]) > Math.abs(a[right])) {
      squares[at] = a[left] * a[left]; left++;
    } else {
      squares[at] = a[right] * a[right]; right--;
    }
  }
  return { squares };
}`,
    fixtures: [
      [
        { offsets: [-5, -2, 0, 3] },
        { squares: [0, 4, 9, 25] },
        "The large negative offset becomes the largest square, not the first.",
      ],
      [
        { offsets: [-2, -2, 2] },
        { squares: [4, 4, 4] },
        "All three observations have equal magnitude and are retained.",
      ],
      [{ offsets: [] }, { squares: [] }],
      [{ offsets: [-7] }, { squares: [49] }],
      [{ offsets: [0, 1, 4] }, { squares: [0, 1, 16] }],
      [{ offsets: [-1000000, 1000000] }, { squares: [1000000000000, 1000000000000] }],
    ],
  }),
  exercise({
    key: "practice-channel-window",
    title: "Longest bounded-channel recording",
    difficulty: "MEDIUM",
    category: "Sliding window",
    description:
      'Find the longest contiguous recording using at most k distinct channel IDs. Input: {"channels": number[], "k": number}. Output: {"start": number, "length": number}. Break equal positive-length ties by the earliest start. If no nonempty window is allowed, return {"start": -1, "length": 0}.',
    constraints:
      "0 <= channels.length <= 100000; channel IDs are integers in [-1000000, 1000000]; 0 <= k <= 100000.",
    tags: ["sliding-window", "hashing", "frequency-map", "variable-window"],
    hints: [
      "Maintain channel occurrence counts for the current interval.",
      "Shrink from the left until the number of map keys is at most k.",
    ],
    solution:
      "## Approach\n\nExtend the right boundary, incrementing its channel count. While too many channels are present, remove leftmost occurrences and delete zero-count keys. The resulting window is the longest valid one ending here because shrinking stops at the first valid boundary. Update the best only on strict length improvement so earlier ties survive.\n\n## Complexity\n\nO(n) expected time with a hash map; O(min(n, k + 1)) auxiliary space. Every occurrence enters and leaves at most once.",
    solutionCode: `function solve(input) {
  const counts = new Map();
  let left = 0, start = -1, length = 0;
  for (let right = 0; right < input.channels.length; right++) {
    const id = input.channels[right];
    counts.set(id, (counts.get(id) || 0) + 1);
    while (counts.size > input.k) {
      const old = input.channels[left++];
      counts.set(old, counts.get(old) - 1);
      if (counts.get(old) === 0) counts.delete(old);
    }
    if (right - left + 1 > length) {
      start = left; length = right - left + 1;
    }
  }
  return { start, length };
}`,
    fixtures: [
      [
        { channels: [1, 2, 1, 3, 3], k: 2 },
        { start: 0, length: 3 },
        "Windows [1,2,1] and [1,3,3] tie; the earlier start wins.",
      ],
      [
        { channels: [-1, -1, 2, 2, 2], k: 1 },
        { start: 2, length: 3 },
        "The run of channel 2 is longer than the run of -1.",
      ],
      [
        { channels: [], k: 2 },
        { start: -1, length: 0 },
      ],
      [
        { channels: [9], k: 0 },
        { start: -1, length: 0 },
      ],
      [
        { channels: [9], k: 1 },
        { start: 0, length: 1 },
      ],
      [
        { channels: [4, 4, 4], k: 10 },
        { start: 0, length: 3 },
      ],
    ],
  }),
  exercise({
    key: "practice-energy-burst",
    title: "Shortest sufficient energy burst",
    difficulty: "MEDIUM",
    category: "Sliding window",
    description:
      'Find the shortest nonempty contiguous burst whose total energy is at least a positive target. Input: {"energy": number[], "target": number}. Output: {"length": number}, using 0 if no burst qualifies. Zero energies are allowed; negative energies are not.',
    constraints:
      "0 <= energy.length <= 100000; each energy is an integer in [0, 1000000]; target is an integer in [1, 100000000000].",
    tags: ["sliding-window", "nonnegative-array", "minimum-window", "two-pointers"],
    hints: [
      "Nonnegative entries ensure moving the left endpoint cannot increase the sum.",
      "Whenever the sum qualifies, record its length and try shrinking again.",
    ],
    solution:
      "## Approach\n\nAccumulate each new right value. While the window reaches the target, record its length and remove the leftmost value. Every qualifying window ending at this right boundary is examined until the sum becomes insufficient. Because values are nonnegative, smaller right boundaries already handled any candidates that are skipped later.\n\n## Complexity\n\nO(n) time and O(1) auxiliary space. The nonnegative constraint is essential: signed values would invalidate this shrinking rule.",
    solutionCode: `function solve(input) {
  let left = 0, sum = 0, best = Infinity;
  for (let right = 0; right < input.energy.length; right++) {
    sum += input.energy[right];
    while (sum >= input.target) {
      best = Math.min(best, right - left + 1);
      sum -= input.energy[left++];
    }
  }
  return { length: best === Infinity ? 0 : best };
}`,
    fixtures: [
      [
        { energy: [2, 0, 3, 1, 4], target: 5 },
        { length: 2 },
        "The final [1,4] qualifies in two entries; no single entry reaches five.",
      ],
      [
        { energy: [0, 0, 7, 0], target: 7 },
        { length: 1 },
        "Shrinking through zeros isolates the single sufficient reading 7.",
      ],
      [{ energy: [], target: 1 }, { length: 0 }],
      [{ energy: [2], target: 3 }, { length: 0 }],
      [{ energy: [5], target: 5 }, { length: 1 }],
      [{ energy: [0, 0, 0], target: 1 }, { length: 0 }],
    ],
  }),
  exercise({
    key: "practice-ledger-target-runs",
    title: "Count target ledger runs",
    difficulty: "MEDIUM",
    category: "Prefix sums",
    description:
      'Count nonempty contiguous ledger runs whose signed sum equals a target. Input: {"entries": number[], "target": number}. Output: {"count": number}. Different index intervals count separately even when their values are identical.',
    constraints:
      "0 <= entries.length <= 100000; entries are integers in [-1000000, 1000000]; target is an integer in [-100000000000, 100000000000]. Counts fit JavaScript's safe integer range.",
    tags: ["prefix-sum", "hashing", "subarray-count", "signed-values"],
    hints: [
      "A run ending at prefix total p starts after a previous prefix p - target.",
      "Seed the frequency map with total zero once, and query before inserting the current prefix.",
    ],
    solution:
      "## Approach\n\nLet p be the running prefix total. Each previously seen prefix p - target defines exactly one target-sum nonempty interval ending here. Add its frequency, then register p. Querying before insertion avoids counting an empty run when target is zero. The initial zero prefix accounts for intervals starting at index zero.\n\n## Complexity\n\nO(n) expected time and O(n) auxiliary space. Repeated prefix totals require frequencies, not merely a set.",
    solutionCode: `function solve(input) {
  const seen = new Map([[0, 1]]);
  let prefix = 0, count = 0;
  for (const value of input.entries) {
    prefix += value;
    count += seen.get(prefix - input.target) || 0;
    seen.set(prefix, (seen.get(prefix) || 0) + 1);
  }
  return { count };
}`,
    fixtures: [
      [
        { entries: [2, -1, 2, -1], target: 1 },
        { count: 3 },
        "The two [2,-1] runs and the middle [-1,2] run each sum to one.",
      ],
      [
        { entries: [0, 0, 0], target: 0 },
        { count: 6 },
        "All three length-one, two length-two, and one length-three runs qualify.",
      ],
      [{ entries: [], target: 0 }, { count: 0 }],
      [{ entries: [-3], target: -3 }, { count: 1 }],
      [{ entries: [1, 2], target: 9 }, { count: 0 }],
      [{ entries: [1, -1, 1, -1], target: 0 }, { count: 4 }],
    ],
  }),
  exercise({
    key: "practice-balanced-polarity",
    title: "Longest balanced polarity segment",
    difficulty: "MEDIUM",
    category: "Prefix sums",
    description:
      'A signal contains only -1 and +1 polarity readings. Find the longest contiguous segment with equally many of each. Input: {"signal": number[]}. Output: {"start": number, "length": number}. Use the earliest start for equal positive lengths and {"start": -1, "length": 0} when no balanced nonempty segment exists.',
    constraints: "0 <= signal.length <= 100000; every signal entry is exactly -1 or 1.",
    tags: ["prefix-sum", "hashing", "earliest-occurrence", "balanced-subarray"],
    hints: [
      "Equal counts mean the segment's signed sum is zero.",
      "Store only the earliest index for each prefix total to maximize future lengths.",
    ],
    solution:
      "## Approach\n\nTwo equal prefix totals enclose a zero-sum interval. Seed total zero at index -1 and remember the first index of every total. On a repeated total, the earliest stored occurrence gives the longest interval ending at the current index. Resolve remaining ties explicitly by starting index.\n\n## Complexity\n\nO(n) expected time and O(n) auxiliary space.",
    solutionCode: `function solve(input) {
  const first = new Map([[0, -1]]);
  let prefix = 0, start = -1, length = 0;
  for (let i = 0; i < input.signal.length; i++) {
    prefix += input.signal[i];
    if (!first.has(prefix)) first.set(prefix, i);
    else {
      const candidateStart = first.get(prefix) + 1;
      const candidateLength = i - first.get(prefix);
      if (candidateLength > length || (candidateLength === length && candidateStart < start)) {
        start = candidateStart; length = candidateLength;
      }
    }
  }
  return { start, length };
}`,
    fixtures: [
      [
        { signal: [1, 1, -1, -1, 1] },
        { start: 0, length: 4 },
        "The first four readings balance; the last four also balance but start later.",
      ],
      [
        { signal: [-1, 1, -1, 1] },
        { start: 0, length: 4 },
        "The complete signal contains two readings of each polarity.",
      ],
      [{ signal: [] }, { start: -1, length: 0 }],
      [{ signal: [1] }, { start: -1, length: 0 }],
      [{ signal: [-1, -1, -1] }, { start: -1, length: 0 }],
      [{ signal: [1, -1, 1, 1, 1, -1] }, { start: 0, length: 2 }],
    ],
  }),
  exercise({
    key: "practice-timestamp-band",
    title: "Locate a timestamp band",
    difficulty: "EASY",
    category: "Binary search",
    description:
      'Locate all sorted timestamps in an inclusive numeric band [low, high]. Input: {"times": number[], "low": number, "high": number}. Output: {"start": number, "endExclusive": number}. The matching positions are a half-open index interval. For no matches return the insertion position of low for both endpoints.',
    constraints:
      "0 <= times.length <= 100000; times are nondecreasing integers in [-1000000, 1000000]; low and high are integers in that range with low <= high.",
    tags: ["binary-search", "lower-bound", "upper-bound", "sorted-array"],
    hints: [
      "Find the first timestamp greater than or equal to low.",
      "Find the first timestamp strictly greater than high for the exclusive endpoint.",
    ],
    solution:
      "## Approach\n\nUse a half-open binary-search interval [left,right). For the lower boundary, timestamps below low are discarded. For the upper boundary, timestamps at most high are discarded. Each search maintains that all positions before left satisfy its discard predicate and all positions at or after right do not. At convergence the two partition boundaries define the band, including duplicates at either endpoint.\n\n## Complexity\n\nO(log(n + 1)) time and O(1) auxiliary space.",
    solutionCode: `function solve(input) {
  function boundary(value, strict) {
    let left = 0, right = input.times.length;
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      if (input.times[mid] < value || (strict && input.times[mid] === value)) left = mid + 1;
      else right = mid;
    }
    return left;
  }
  return { start: boundary(input.low, false), endExclusive: boundary(input.high, true) };
}`,
    fixtures: [
      [
        { times: [1, 2, 2, 4, 7], low: 2, high: 4 },
        { start: 1, endExclusive: 4 },
        "Indices 1, 2, and 3 lie in the band; index 4 is excluded.",
      ],
      [
        { times: [-5, 0, 3], low: -2, high: -1 },
        { start: 1, endExclusive: 1 },
        "The empty band sits between -5 and 0 at insertion index 1.",
      ],
      [
        { times: [], low: 0, high: 0 },
        { start: 0, endExclusive: 0 },
      ],
      [
        { times: [8], low: 8, high: 8 },
        { start: 0, endExclusive: 1 },
      ],
      [
        { times: [1, 1, 1], low: 2, high: 3 },
        { start: 3, endExclusive: 3 },
      ],
      [
        { times: [-2, -2, 0, 2], low: -2, high: 2 },
        { start: 0, endExclusive: 4 },
      ],
    ],
  }),
  exercise({
    key: "practice-batch-capacity",
    title: "Minimum ordered batch capacity",
    difficulty: "MEDIUM",
    category: "Binary search",
    description:
      'Pack ordered nonnegative parcel weights into at most batches contiguous groups. Parcels cannot be reordered or split. Minimize the largest allowed group weight. Input: {"weights": number[], "batches": number}. Output: {"capacity": number}. Empty weights require capacity 0; unused batches are allowed.',
    constraints:
      "0 <= weights.length <= 100000; weights are integers in [0, 1000000]; 1 <= batches <= 100000.",
    tags: ["binary-search-on-answer", "greedy", "partitioning", "monotone-predicate"],
    hints: [
      "A capacity is feasible if greedily filling each group needs no more than batches groups.",
      "Search between the maximum individual weight and the total weight.",
    ],
    solution:
      "## Approach\n\nFor a trial capacity, greedily extend a group until the next parcel would overflow, then start another group. Nonnegative weights ensure this uses the fewest groups for that capacity: ending earlier cannot allow any later group to start farther right. Feasibility is monotone because increasing capacity cannot increase the minimum group count. Binary search its first feasible integer.\n\n## Complexity\n\nO(n log(S + 1)) time for total weight S, and O(1) auxiliary space. Empty input is handled before constructing bounds.",
    solutionCode: `function solve(input) {
  if (input.weights.length === 0) return { capacity: 0 };
  let low = 0, high = 0;
  for (const w of input.weights) { low = Math.max(low, w); high += w; }
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    let groups = 1, load = 0;
    for (const w of input.weights) {
      if (load + w > mid) { groups++; load = 0; }
      load += w;
    }
    if (groups <= input.batches) high = mid;
    else low = mid + 1;
  }
  return { capacity: low };
}`,
    fixtures: [
      [
        { weights: [4, 1, 3, 2], batches: 2 },
        { capacity: 5 },
        "Groups [4,1] and [3,2] fit five; four would need three groups.",
      ],
      [
        { weights: [2, 2, 2], batches: 1 },
        { capacity: 6 },
        "One batch must hold the whole ordered sequence.",
      ],
      [{ weights: [], batches: 3 }, { capacity: 0 }],
      [{ weights: [9], batches: 5 }, { capacity: 9 }],
      [{ weights: [0, 0, 0], batches: 1 }, { capacity: 0 }],
      [{ weights: [1, 8, 1, 8], batches: 3 }, { capacity: 9 }],
    ],
  }),
  exercise({
    key: "practice-next-stronger-pulse",
    title: "Wait for a stronger pulse",
    difficulty: "MEDIUM",
    category: "Monotonic stack",
    description:
      'For every pulse, report the number of positions until the first strictly larger later pulse, or 0 if none exists. Input: {"pulses": number[]}. Output: {"waits": number[]}. Equal pulse values do not count as stronger.',
    constraints: "0 <= pulses.length <= 100000; pulse values are integers in [-1000000, 1000000].",
    tags: ["monotonic-stack", "next-greater-element", "arrays", "strict-comparison"],
    hints: [
      "Keep unresolved indices in nonincreasing pulse order.",
      "A new pulse resolves all smaller values on top of the stack.",
    ],
    solution:
      "## Approach\n\nThe stack contains indices whose next greater pulse has not arrived. When a new pulse exceeds the top's value, pop that index and store the distance. It is the first greater pulse because the index remained unresolved at every previous position. Do not pop equal values. Any indices left at the end retain zero.\n\n## Complexity\n\nO(n) time: each index is pushed once and popped at most once. O(n) auxiliary space.",
    solutionCode: `function solve(input) {
  const stack = [], waits = new Array(input.pulses.length).fill(0);
  for (let i = 0; i < input.pulses.length; i++) {
    while (stack.length && input.pulses[stack[stack.length - 1]] < input.pulses[i]) {
      const old = stack.pop();
      waits[old] = i - old;
    }
    stack.push(i);
  }
  return { waits };
}`,
    fixtures: [
      [
        { pulses: [3, 1, 1, 4, 2] },
        { waits: [3, 2, 1, 0, 0] },
        "The pulse 4 resolves all three earlier positions; 2 has no stronger successor.",
      ],
      [
        { pulses: [-3, -2, -1] },
        { waits: [1, 1, 0] },
        "Negative pulses still compare numerically; each earlier pulse improves immediately.",
      ],
      [{ pulses: [] }, { waits: [] }],
      [{ pulses: [8] }, { waits: [0] }],
      [{ pulses: [5, 5, 5] }, { waits: [0, 0, 0] }],
      [{ pulses: [5, 4, 3, 2] }, { waits: [0, 0, 0, 0] }],
    ],
  }),
  exercise({
    key: "practice-banner-footprint",
    title: "Largest skyline banner footprint",
    difficulty: "HARD",
    category: "Monotonic stack",
    description:
      'Adjacent unit-width supports have nonnegative heights. A rectangular banner may cover a contiguous range, with its height at most every support in that range. Find the largest area. Input: {"heights": number[]}. Output: {"area": number}; the empty skyline has area 0.',
    constraints: "0 <= heights.length <= 100000; heights are integers in [0, 1000000].",
    tags: ["monotonic-stack", "histogram", "range-minimum", "amortized-analysis"],
    hints: [
      "Track a height together with the earliest position where it can begin.",
      "When a lower height arrives, finalize taller pending rectangles and pass their starts to the lower height.",
    ],
    solution:
      "## Approach\n\nKeep increasing heights with their earliest viable starts. A lower incoming height closes every taller rectangle; its width ends just before the current position. Transfer the popped start to the new height so it can extend over those same supports. Equal heights share one entry because the earlier start dominates. A virtual height zero at the end closes all positive rectangles.\n\n## Complexity\n\nO(n) time and O(n) auxiliary space. Each distinct pending entry is pushed and popped at most once.",
    solutionCode: `function solve(input) {
  const stack = [];
  let area = 0;
  for (let i = 0; i <= input.heights.length; i++) {
    const height = i === input.heights.length ? 0 : input.heights[i];
    let start = i;
    while (stack.length && stack[stack.length - 1][1] > height) {
      const [oldStart, oldHeight] = stack.pop();
      area = Math.max(area, oldHeight * (i - oldStart));
      start = oldStart;
    }
    if (height > 0 && (!stack.length || stack[stack.length - 1][1] < height)) stack.push([start, height]);
  }
  return { area };
}`,
    fixtures: [
      [
        { heights: [2, 1, 4, 4, 2] },
        { area: 8 },
        "The two height-4 supports give area eight; height two across the last three gives six.",
      ],
      [{ heights: [3, 3, 3] }, { area: 9 }, "Equal supports can all be covered at height three."],
      [{ heights: [] }, { area: 0 }],
      [{ heights: [6] }, { area: 6 }],
      [{ heights: [0, 0] }, { area: 0 }],
      [{ heights: [1, 2, 3, 4] }, { area: 6 }],
    ],
  }),
  exercise({
    key: "practice-rarest-labels",
    title: "Select the rarest label types",
    difficulty: "MEDIUM",
    category: "Heap",
    description:
      'A curator wants up to k distinct labels with the fewest occurrences. Input: {"labels": number[], "k": number}. Output: {"labels": number[]} ordered by ascending frequency, then ascending numeric label ID. Return all distinct labels if k exceeds their count. Use a heap rather than sorting all distinct labels.',
    constraints:
      "0 <= labels.length <= 100000; label IDs are integers in [-1000000, 1000000]; 0 <= k <= 100000.",
    tags: ["heap", "top-k", "frequency-map", "deterministic-ties"],
    hints: [
      "Keep the worst selected candidate at the root of a size-k max heap.",
      "Compare candidates by frequency first and ID second; remove the root on overflow.",
    ],
    solution:
      "## Approach\n\nCount frequencies, then maintain a max heap ordered by (frequency, ID). Its root is the least desirable retained label. Insert each candidate and, if capacity is exceeded, discard the root. Inductively the heap retains the k smallest candidate tuples seen so far. Sorting only the retained heap produces the required presentation order.\n\n## Complexity\n\nFor n occurrences, u distinct labels, and q = min(k,u), expected time is O(n + u log(q + 1) + q log(q + 1)). Auxiliary space is O(u + q). When k is zero, return immediately.",
    solutionCode: `function solve(input) {
  if (input.k === 0) return { labels: [] };
  const counts = new Map(), heap = [];
  for (const id of input.labels) counts.set(id, (counts.get(id) || 0) + 1);
  const compare = (a, b) => a[1] - b[1] || a[0] - b[0];
  for (const item of counts) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (compare(heap[p], heap[i]) >= 0) break;
      [heap[p], heap[i]] = [heap[i], heap[p]]; i = p;
    }
    if (heap.length > input.k) {
      const last = heap.pop();
      heap[0] = last;
      let at = 0;
      while (true) {
        let worst = at;
        for (const child of [at * 2 + 1, at * 2 + 2]) {
          if (child < heap.length && compare(heap[child], heap[worst]) > 0) worst = child;
        }
        if (worst === at) break;
        [heap[at], heap[worst]] = [heap[worst], heap[at]]; at = worst;
      }
    }
  }
  return { labels: heap.sort(compare).map(item => item[0]) };
}`,
    fixtures: [
      [
        { labels: [4, 4, 2, 2, 9, 1], k: 3 },
        { labels: [1, 9, 2] },
        "Labels 1 and 9 occur once; ID 2 wins the frequency-two tie against 4.",
      ],
      [
        { labels: [-2, 0, 5], k: 2 },
        { labels: [-2, 0] },
        "All frequencies tie at one, so choose the two smallest IDs.",
      ],
      [{ labels: [], k: 4 }, { labels: [] }],
      [{ labels: [8, 8], k: 1 }, { labels: [8] }],
      [{ labels: [1, 2], k: 0 }, { labels: [] }],
      [{ labels: [3, 3, -1], k: 10 }, { labels: [-1, 3] }],
    ],
  }),
  exercise({
    key: "practice-merge-checkpoint-feeds",
    title: "Merge checkpoint feeds",
    difficulty: "MEDIUM",
    category: "Heap",
    description:
      'Each checkpoint emits a sorted list of integer timestamps. Merge all feeds, retaining duplicates, without flattening and globally sorting. Input: {"feeds": number[][]}. Output: {"times": number[]} in nondecreasing order. Empty feeds are allowed.',
    constraints:
      "0 <= feeds.length <= 1000; total timestamps <= 100000; each feed is nondecreasing; timestamps are integers in [-1000000, 1000000].",
    tags: ["heap", "k-way-merge", "sorted-streams", "priority-queue"],
    hints: [
      "Only the current head of each nonempty feed can be the next output.",
      "After removing a head from the min heap, insert its feed's next timestamp.",
    ],
    solution:
      "## Approach\n\nStore triples (timestamp, feed index, position) in a min heap. Initialize it with every nonempty feed's first timestamp. The minimum head is the global next timestamp because all later timestamps in its feed are no smaller than its head. Emit it and insert its successor if one exists. Feed index breaks timestamp ties deterministically without deleting duplicates.\n\n## Complexity\n\nWith N timestamps and f nonempty feeds, time is O(feeds.length + N log(f + 1)); auxiliary space is O(f) excluding the output.",
    solutionCode: `function solve(input) {
  const heap = [], times = [];
  const compare = (a, b) => a[0] - b[0] || a[1] - b[1];
  function push(item) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (compare(heap[p], heap[i]) <= 0) break;
      [heap[p], heap[i]] = [heap[i], heap[p]]; i = p;
    }
  }
  function pop() {
    const first = heap[0], last = heap.pop();
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let best = i;
        for (const child of [2 * i + 1, 2 * i + 2]) {
          if (child < heap.length && compare(heap[child], heap[best]) < 0) best = child;
        }
        if (best === i) break;
        [heap[i], heap[best]] = [heap[best], heap[i]]; i = best;
      }
    }
    return first;
  }
  input.feeds.forEach((feed, index) => { if (feed.length) push([feed[0], index, 0]); });
  while (heap.length) {
    const [value, feed, position] = pop();
    times.push(value);
    if (position + 1 < input.feeds[feed].length) push([input.feeds[feed][position + 1], feed, position + 1]);
  }
  return { times };
}`,
    fixtures: [
      [
        { feeds: [[1, 5], [2, 2, 8], []] },
        { times: [1, 2, 2, 5, 8] },
        "Both timestamp-2 events survive; the empty feed contributes nothing.",
      ],
      [
        { feeds: [[-4, 0], [-3, 7], [0]] },
        { times: [-4, -3, 0, 0, 7] },
        "Negative times come first and equal zero timestamps remain separate.",
      ],
      [{ feeds: [] }, { times: [] }],
      [{ feeds: [[], []] }, { times: [] }],
      [{ feeds: [[6]] }, { times: [6] }],
      [
        {
          feeds: [
            [1, 1],
            [1, 1],
          ],
        },
        { times: [1, 1, 1, 1] },
      ],
    ],
  }),
  exercise({
    key: "practice-maintenance-route",
    title: "Shortest maintenance route",
    difficulty: "MEDIUM",
    category: "Breadth-first search",
    description:
      'A rectangular grid uses 0 for walkable cells and 1 for walls. Move orthogonally from start to goal and minimize the number of moves. Input: {"grid": number[][], "start": [row,col], "goal": [row,col]}. Output: {"distance": number}; return -1 if either endpoint is invalid, blocked, or unreachable. Empty grids are allowed.',
    constraints:
      "grid has 0..200 rows and 0..200 equal-width columns; cells are 0 or 1; endpoint coordinates are integers in [-1, 200].",
    tags: ["bfs", "grid", "shortest-path", "unweighted-graph"],
    hints: [
      "A FIFO queue explores cells by increasing distance.",
      "Mark a cell when enqueuing it, not when removing it.",
    ],
    solution:
      "## Approach\n\nValidate both endpoints before searching. Enqueue the start with distance zero and use a head index rather than shifting the queue. For each removed cell, enqueue unseen walkable neighbors at distance plus one. BFS layer order ensures the first visit to a cell is shortest. The first removal of the goal therefore gives the minimum moves; exhaustion means unreachable.\n\n## Complexity\n\nFor R rows and C columns, O(RC) time and O(RC) auxiliary space.",
    solutionCode: `function solve(input) {
  const rows = input.grid.length, cols = rows ? input.grid[0].length : 0;
  const valid = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols && input.grid[r][c] === 0;
  const [sr, sc] = input.start, [gr, gc] = input.goal;
  if (!valid(sr, sc) || !valid(gr, gc)) return { distance: -1 };
  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const queue = [[sr, sc, 0]];
  seen[sr][sc] = true;
  for (let head = 0; head < queue.length; head++) {
    const [r, c, d] = queue[head];
    if (r === gr && c === gc) return { distance: d };
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (valid(nr, nc) && !seen[nr][nc]) {
        seen[nr][nc] = true; queue.push([nr, nc, d + 1]);
      }
    }
  }
  return { distance: -1 };
}`,
    fixtures: [
      [
        {
          grid: [
            [0, 1, 0],
            [0, 0, 0],
          ],
          start: [0, 0],
          goal: [0, 2],
        },
        { distance: 4 },
        "The wall forces a detour through the lower row: down, right, right, up.",
      ],
      [
        { grid: [[0, 1, 0]], start: [0, 0], goal: [0, 2] },
        { distance: -1 },
        "The wall splits the only row into disconnected walkable regions.",
      ],
      [{ grid: [], start: [0, 0], goal: [0, 0] }, { distance: -1 }],
      [{ grid: [[0]], start: [0, 0], goal: [0, 0] }, { distance: 0 }],
      [{ grid: [[1]], start: [0, 0], goal: [0, 0] }, { distance: -1 }],
      [{ grid: [[0, 0]], start: [-1, 0], goal: [0, 1] }, { distance: -1 }],
    ],
  }),
  exercise({
    key: "practice-help-desk-distances",
    title: "Distance to the nearest help desk",
    difficulty: "MEDIUM",
    category: "Breadth-first search",
    description:
      'On an undirected campus graph, report each vertex distance to its nearest help desk. Input: {"n": number, "edges": [[u,v], ...], "desks": number[]}. Vertices are 0..n-1; every edge costs one move. Output: {"distances": number[]} in vertex order, using -1 for unreachable vertices. Duplicate edges, self-loops, and duplicate desks are valid.',
    constraints:
      "0 <= n <= 100000; edges.length <= 200000; desks.length <= 100000; every edge endpoint and desk is an integer in [0,n-1]; when n=0, edges and desks must be empty.",
    tags: ["bfs", "multi-source-bfs", "graph", "nearest-source"],
    hints: [
      "Initialize all distinct desk vertices at distance zero in one queue.",
      "One multi-source search replaces a separate BFS from each desk.",
    ],
    solution:
      "## Approach\n\nConstruct adjacency lists and enqueue every distinct desk at distance zero. BFS expands all sources together. Each first-discovered vertex receives the minimum over distances from every source because queue layers are globally nondecreasing. A -1 distance doubles as an unseen marker, protecting against cycles, parallel edges, and repeated desks.\n\n## Complexity\n\nO(n + m + s) time and O(n + m) auxiliary space, for m edges and s desk entries.",
    solutionCode: `function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [u, v] of input.edges) { graph[u].push(v); graph[v].push(u); }
  const distances = new Array(input.n).fill(-1), queue = [];
  for (const desk of input.desks) {
    if (distances[desk] === -1) { distances[desk] = 0; queue.push(desk); }
  }
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head];
    for (const v of graph[u]) {
      if (distances[v] === -1) { distances[v] = distances[u] + 1; queue.push(v); }
    }
  }
  return { distances };
}`,
    fixtures: [
      [
        {
          n: 5,
          edges: [
            [0, 1],
            [1, 2],
            [2, 3],
          ],
          desks: [0, 3],
        },
        { distances: [0, 1, 1, 0, -1] },
        "Vertices 1 and 2 use opposite desks; isolated vertex 4 has none.",
      ],
      [
        {
          n: 3,
          edges: [
            [0, 1],
            [1, 2],
          ],
          desks: [],
        },
        { distances: [-1, -1, -1] },
        "Without any desk, even connected vertices have no source distance.",
      ],
      [{ n: 0, edges: [], desks: [] }, { distances: [] }],
      [{ n: 1, edges: [], desks: [0, 0] }, { distances: [0] }],
      [
        {
          n: 2,
          edges: [
            [0, 0],
            [0, 1],
            [0, 1],
          ],
          desks: [0],
        },
        { distances: [0, 1] },
      ],
      [
        {
          n: 4,
          edges: [
            [0, 1],
            [2, 3],
          ],
          desks: [2],
        },
        { distances: [-1, -1, 0, 1] },
      ],
    ],
  }),
  exercise({
    key: "practice-connected-loads",
    title: "Total load in each connected region",
    difficulty: "MEDIUM",
    category: "Depth-first search",
    description:
      'An undirected network assigns a signed load to each vertex. Report each connected component and its total load. Input: {"loads": number[], "edges": [[u,v], ...]}. Output: {"components": [{"vertices": number[], "total": number}, ...]}. Sort vertices numerically inside each component and order components by smallest vertex. Duplicate edges and self-loops are valid.',
    constraints:
      "0 <= loads.length <= 100000; loads are integers in [-1000000,1000000]; edges.length <= 200000; endpoints are valid vertex indices.",
    tags: ["dfs", "connected-components", "graph", "iterative-traversal"],
    hints: [
      "Start a traversal at each smallest unvisited vertex.",
      "Mark vertices when pushing them, and aggregate signed loads once.",
    ],
    solution:
      "## Approach\n\nScan vertex IDs in ascending order. Each unvisited ID starts an explicit-stack DFS, collecting reachable vertices and summing their loads. Mark on push so repeated edges never add a load twice. Sorted collected IDs meet the output contract; ascending traversal roots automatically order components. An explicit stack avoids JavaScript recursion depth limits.\n\n## Complexity\n\nO(n + m + sum(c log c)) time for component sizes c; O(n + m) auxiliary space, excluding result objects.",
    solutionCode: `function solve(input) {
  const graph = Array.from({ length: input.loads.length }, () => []);
  for (const [u, v] of input.edges) { graph[u].push(v); graph[v].push(u); }
  const seen = new Array(input.loads.length).fill(false), components = [];
  for (let root = 0; root < graph.length; root++) {
    if (seen[root]) continue;
    const stack = [root], vertices = [];
    let total = 0;
    seen[root] = true;
    while (stack.length) {
      const u = stack.pop();
      vertices.push(u); total += input.loads[u];
      for (const v of graph[u]) if (!seen[v]) { seen[v] = true; stack.push(v); }
    }
    vertices.sort((a, b) => a - b);
    components.push({ vertices, total });
  }
  return { components };
}`,
    fixtures: [
      [
        {
          loads: [3, -2, 8, 1],
          edges: [
            [0, 1],
            [2, 3],
          ],
        },
        {
          components: [
            { vertices: [0, 1], total: 1 },
            { vertices: [2, 3], total: 9 },
          ],
        },
        "The first connected pair cancels to one; the second pair totals nine.",
      ],
      [
        { loads: [0, -5], edges: [] },
        {
          components: [
            { vertices: [0], total: 0 },
            { vertices: [1], total: -5 },
          ],
        },
        "Isolated vertices are separate components, including the zero-load one.",
      ],
      [{ loads: [], edges: [] }, { components: [] }],
      [{ loads: [7], edges: [[0, 0]] }, { components: [{ vertices: [0], total: 7 }] }],
      [
        {
          loads: [1, 2],
          edges: [
            [0, 1],
            [0, 1],
          ],
        },
        { components: [{ vertices: [0, 1], total: 3 }] },
      ],
      [
        {
          loads: [-1, 2, -3],
          edges: [
            [2, 0],
            [1, 2],
          ],
        },
        { components: [{ vertices: [0, 1, 2], total: -2 }] },
      ],
    ],
  }),
  exercise({
    key: "practice-workflow-cycle",
    title: "Detect a workflow dependency cycle",
    difficulty: "MEDIUM",
    category: "Depth-first search",
    description:
      'A directed workflow edge [u,v] means task u links to task v. Determine whether any directed cycle exists, including a self-loop. Input: {"n": number, "edges": [[u,v], ...]}. Output: {"hasCycle": boolean}. Repeated edges alone do not form a cycle.',
    constraints:
      "0 <= n <= 100000; edges.length <= 200000; endpoints are integers in [0,n-1]; n=0 implies no edges.",
    tags: ["dfs", "directed-graph", "cycle-detection", "three-color"],
    hints: [
      "Distinguish unseen, active on the current path, and fully processed vertices.",
      "An edge to an active vertex proves a cycle; an edge to a finished vertex does not.",
    ],
    solution:
      "## Approach\n\nUse three colors with iterative DFS frames containing a vertex and its next edge index. Entering a vertex marks it active; finishing all its outgoing edges marks it complete. An edge to an active vertex closes a path back to an ancestor, hence a directed cycle. Finished neighbors are safe because their entire reachable subgraph was already checked. Start a DFS for every unseen component.\n\n## Complexity\n\nO(n + m) time and O(n + m) auxiliary space. Iterative frames preserve path membership without relying on the language call stack.",
    solutionCode: `function solve(input) {
  const graph = Array.from({ length: input.n }, () => []);
  for (const [u, v] of input.edges) graph[u].push(v);
  const color = new Array(input.n).fill(0);
  for (let root = 0; root < input.n; root++) {
    if (color[root]) continue;
    color[root] = 1;
    const stack = [[root, 0]];
    while (stack.length) {
      const frame = stack[stack.length - 1], u = frame[0];
      if (frame[1] === graph[u].length) { color[u] = 2; stack.pop(); continue; }
      const v = graph[u][frame[1]++];
      if (color[v] === 1) return { hasCycle: true };
      if (color[v] === 0) { color[v] = 1; stack.push([v, 0]); }
    }
  }
  return { hasCycle: false };
}`,
    fixtures: [
      [
        {
          n: 4,
          edges: [
            [0, 1],
            [1, 2],
            [2, 0],
          ],
        },
        { hasCycle: true },
        "Tasks 0, 1, and 2 form a directed loop, despite isolated task 3.",
      ],
      [
        {
          n: 4,
          edges: [
            [0, 1],
            [0, 2],
            [1, 3],
            [2, 3],
          ],
        },
        { hasCycle: false },
        "Two branches meet at task 3, but no edge leads back to an active ancestor.",
      ],
      [{ n: 0, edges: [] }, { hasCycle: false }],
      [{ n: 1, edges: [[0, 0]] }, { hasCycle: true }],
      [
        {
          n: 2,
          edges: [
            [0, 1],
            [0, 1],
          ],
        },
        { hasCycle: false },
      ],
      [
        {
          n: 4,
          edges: [
            [0, 1],
            [2, 3],
            [3, 2],
          ],
        },
        { hasCycle: true },
      ],
    ],
  }),
  exercise({
    key: "practice-bounded-kit-plans",
    title: "Enumerate bounded kit plans",
    difficulty: "MEDIUM",
    category: "Backtracking",
    description:
      'There are distinct kit types, each with a positive value and a stock limit. Enumerate count vectors achieving an exact target value. Input: {"values": number[], "limits": number[], "target": number}. Output: {"plans": number[][]}, with one count per input type, sorted lexicographically by numeric counts. The empty vector is one valid plan for zero target with no types.',
    constraints:
      "0 <= values.length <= 7; limits has the same length; values are distinct integers in [1,100]; limits are integers in [0,5]; target is an integer in [0,500]. At most 6^7 count vectors are examined.",
    tags: ["backtracking", "bounded-combinations", "enumeration", "pruning"],
    hints: [
      "Choose the count for one type at a time, never exceeding its stock.",
      "Positive values let you stop increasing a count when it exceeds the remaining target.",
    ],
    solution:
      "## Approach\n\nRecurse over type positions. At each position try counts from zero upward, bounded by stock and remaining value. Subtract that contribution and recurse. At the final position accept only zero remainder and copy the vector. Each vector has exactly one path through the search tree; increasing counts at each depth makes output lexicographic without sorting. Zero target still explores zero-count choices and yields the all-zero vector.\n\n## Complexity\n\nLet P = product(limits[i] + 1) and t be the number of types. Time is O((t + 1)P) including copies, with O(t) auxiliary space beyond the output.",
    solutionCode: `function solve(input) {
  const plans = [], path = [];
  function visit(index, remaining) {
    if (index === input.values.length) {
      if (remaining === 0) plans.push(path.slice());
      return;
    }
    const max = Math.min(input.limits[index], Math.floor(remaining / input.values[index]));
    for (let count = 0; count <= max; count++) {
      path.push(count); visit(index + 1, remaining - count * input.values[index]); path.pop();
    }
  }
  visit(0, input.target);
  return { plans };
}`,
    fixtures: [
      [
        { values: [2, 3], limits: [3, 2], target: 6 },
        {
          plans: [
            [0, 2],
            [3, 0],
          ],
        },
        "Either two value-3 kits or three value-2 kits reach six, within stock.",
      ],
      [
        { values: [1, 4], limits: [2, 1], target: 5 },
        { plans: [[1, 1]] },
        "One kit of each type reaches five; stock prevents five value-1 kits.",
      ],
      [{ values: [], limits: [], target: 0 }, { plans: [[]] }],
      [{ values: [], limits: [], target: 1 }, { plans: [] }],
      [{ values: [3], limits: [0], target: 0 }, { plans: [[0]] }],
      [{ values: [2, 5], limits: [1, 1], target: 4 }, { plans: [] }],
    ],
  }),
  exercise({
    key: "practice-separated-panel-slots",
    title: "Choose separated panel slots",
    difficulty: "MEDIUM",
    category: "Backtracking",
    description:
      'Select exactly k slot indices from 0..n-1, with no two chosen indices adjacent. Input: {"n": number, "k": number}. Output: {"selections": number[][]}, each selection increasing and the list sorted lexicographically by numeric indices. For k=0 return one empty selection; impossible requests return an empty list.',
    constraints:
      "n and k are integers with 0 <= n <= 20 and 0 <= k <= 20. Slot indices range from 0 to n-1. Requests with k > ceil(n/2) are valid inputs but have no selections.",
    tags: ["backtracking", "combinations", "constraint-pruning", "independent-set-path"],
    hints: [
      "After choosing index i, the next choice must be at least i+2.",
      "The suffix of length remainingSlots can fit at most ceil(remainingSlots/2) nonadjacent choices.",
    ],
    solution:
      "## Approach\n\nTry possible next indices in increasing order. Choosing i recurses from i+2. If the suffix cannot fit the requested remaining choices, prune it. Copy the path when no choices remain. Every legal increasing selection has a unique sequence of next-index choices, and depth-first increasing choices emit lexicographic output.\n\n## Complexity\n\nA conservative bound is O((n + 1)2^n) time including copied outputs. Auxiliary space is O(n), excluding selections. The small n constraint makes enumeration intentional.",
    solutionCode: `function solve(input) {
  const selections = [], path = [];
  function visit(start, need) {
    if (need === 0) { selections.push(path.slice()); return; }
    if (Math.ceil((input.n - start) / 2) < need) return;
    for (let i = start; i < input.n; i++) {
      if (Math.ceil((input.n - i) / 2) < need) break;
      path.push(i); visit(i + 2, need - 1); path.pop();
    }
  }
  visit(0, input.k);
  return { selections };
}`,
    fixtures: [
      [
        { n: 4, k: 2 },
        {
          selections: [
            [0, 2],
            [0, 3],
            [1, 3],
          ],
        },
        "These are exactly the two-slot choices with at least one unused index between them.",
      ],
      [
        { n: 5, k: 3 },
        { selections: [[0, 2, 4]] },
        "Fitting three separated slots uses the only alternating arrangement.",
      ],
      [{ n: 0, k: 0 }, { selections: [[]] }],
      [{ n: 0, k: 1 }, { selections: [] }],
      [{ n: 1, k: 1 }, { selections: [[0]] }],
      [{ n: 3, k: 3 }, { selections: [] }],
    ],
  }),
  exercise({
    key: "practice-voucher-minimum",
    title: "Fewest reusable vouchers",
    difficulty: "MEDIUM",
    category: "Dynamic programming",
    description:
      'Each positive voucher value may be used any number of times. Find the fewest vouchers whose sum is exactly amount. Input: {"values": number[], "amount": number}. Output: {"minimum": number}, or -1 if impossible. Duplicate voucher values are permitted and do not change the answer; amount zero uses zero vouchers.',
    constraints:
      "0 <= values.length <= 100; each value is an integer in [1,10000]; 0 <= amount <= 10000.",
    tags: ["dynamic-programming", "unbounded-knapsack", "minimum-count", "one-dimensional-dp"],
    hints: [
      "Let dp[x] be the minimum vouchers for exact sum x.",
      "The last voucher of value v leaves the smaller subproblem x-v.",
    ],
    solution:
      "## Approach\n\nInitialize dp[0] to zero and other states to infinity. For each sum x in increasing order, try every voucher `v <= x` and minimize dp[x-v]+1. Every exact solution has a last voucher, so these transitions cover all possibilities. Positive voucher values ensure all predecessor sums are smaller and already final. Convert an infinite final state to -1 rather than emitting an invalid JSON number.\n\n## Complexity\n\nO(amount * values.length) time and O(amount) auxiliary space.",
    solutionCode: `function solve(input) {
  const dp = new Array(input.amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let sum = 1; sum <= input.amount; sum++) {
    for (const value of input.values) {
      if (value <= sum) dp[sum] = Math.min(dp[sum], dp[sum - value] + 1);
    }
  }
  return { minimum: dp[input.amount] === Infinity ? -1 : dp[input.amount] };
}`,
    fixtures: [
      [
        { values: [1, 3, 4], amount: 6 },
        { minimum: 2 },
        "Two value-3 vouchers beat a greedy value-4 plus two value-1 choice.",
      ],
      [
        { values: [2, 5], amount: 3 },
        { minimum: -1 },
        "Neither a single voucher nor any positive combination totals three.",
      ],
      [{ values: [], amount: 0 }, { minimum: 0 }],
      [{ values: [], amount: 7 }, { minimum: -1 }],
      [{ values: [7], amount: 7 }, { minimum: 1 }],
      [{ values: [2, 2, 3], amount: 7 }, { minimum: 3 }],
    ],
  }),
  exercise({
    key: "practice-route-toll",
    title: "Minimum right-down route toll",
    difficulty: "MEDIUM",
    category: "Dynamic programming",
    description:
      'Move from the top-left to bottom-right of a rectangular toll grid using only right or down moves. Pay each visited cell including both endpoints. Integer tolls may be negative; null cells are blocked. Input: {"tolls": (number|null)[][]}. Output: {"cost": number|null}, using null for an empty grid or unreachable destination.',
    constraints:
      "0..200 rows and 0..200 equal-width columns; non-null tolls are integers in [-1000000,1000000].",
    tags: ["dynamic-programming", "grid-dp", "dag-shortest-path", "rolling-array"],
    hints: [
      "Every route to a cell comes from its top or left neighbor.",
      "One row of DP suffices: before updating, dp[col] is the top state and dp[col-1] is the left state.",
    ],
    solution:
      "## Approach\n\nSweep rows left to right with a rolling array of costs. Blocked cells reset their state to infinity, preventing routes from passing through them. The start uses its own toll; all other cells add their toll to the cheaper reachable predecessor. Negative tolls cause no cycle issue because every move strictly increases row plus column. Infinity at the destination is returned as JSON null.\n\n## Complexity\n\nO(RC) time and O(C) auxiliary space.",
    solutionCode: `function solve(input) {
  const rows = input.tolls.length, cols = rows ? input.tolls[0].length : 0;
  if (!rows || !cols) return { cost: null };
  const dp = new Array(cols).fill(Infinity);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const toll = input.tolls[r][c];
      if (toll === null) dp[c] = Infinity;
      else if (r === 0 && c === 0) dp[c] = toll;
      else dp[c] = Math.min(dp[c], c > 0 ? dp[c - 1] : Infinity) + toll;
    }
  }
  return { cost: dp[cols - 1] === Infinity ? null : dp[cols - 1] };
}`,
    fixtures: [
      [
        {
          tolls: [
            [1, 8, 1],
            [2, -4, 3],
          ],
        },
        { cost: 2 },
        "Down, right, right pays 1+2-4+3=2; the more expensive upper route is avoided.",
      ],
      [
        {
          tolls: [
            [1, null],
            [null, 2],
          ],
        },
        { cost: null },
        "Both possible first moves are blocked, so the destination is unreachable.",
      ],
      [{ tolls: [] }, { cost: null }],
      [{ tolls: [[-5]] }, { cost: -5 }],
      [{ tolls: [[null]] }, { cost: null }],
      [
        {
          tolls: [
            [0, 0],
            [0, 0],
          ],
        },
        { cost: 0 },
      ],
    ],
  }),
  exercise({
    key: "practice-room-demonstrations",
    title: "Schedule the most demonstrations",
    difficulty: "MEDIUM",
    category: "Greedy",
    description:
      'Choose the maximum number of nonoverlapping demonstrations for one room. Input: {"slots": [[start,end], ...]}; each slot occupies the half-open interval [start,end). Output: {"selected": number[]} containing chosen original indices in execution order. Use the deterministic earliest-finish greedy rule: sort by end, then start, then original index, and accept a slot if start >= the last accepted end.',
    constraints:
      "0 <= slots.length <= 100000; endpoints are integers in [-1000000,1000000]; start < end. Identical intervals are allowed.",
    tags: ["greedy", "interval-scheduling", "sorting", "exchange-argument"],
    hints: [
      "Finishing earlier leaves at least as much room for all future choices.",
      "Keep original indices while sorting, and permit touching half-open endpoints.",
    ],
    solution:
      "## Approach\n\nSort annotated intervals by the specified tuple. Repeatedly accept the next compatible interval. An optimal schedule's first compatible choice can be replaced by the earliest-finishing one without invalidating any later interval. Applying that exchange to each suffix proves maximum cardinality. The tie rules define one reproducible answer even when many optimal schedules exist.\n\n## Complexity\n\nO(n log n) time and O(n) auxiliary space for annotated intervals, excluding output.",
    solutionCode: `function solve(input) {
  const slots = input.slots.map(([start, end], index) => ({ start, end, index }));
  slots.sort((a, b) => a.end - b.end || a.start - b.start || a.index - b.index);
  const selected = [];
  let end = -Infinity;
  for (const slot of slots) {
    if (slot.start >= end) { selected.push(slot.index); end = slot.end; }
  }
  return { selected };
}`,
    fixtures: [
      [
        {
          slots: [
            [0, 4],
            [0, 2],
            [2, 3],
            [3, 5],
          ],
        },
        { selected: [1, 2, 3] },
        "The shorter first slot leaves room for two more; touching endpoints do not overlap.",
      ],
      [
        {
          slots: [
            [-3, -1],
            [-1, 1],
            [-2, 2],
          ],
        },
        { selected: [0, 1] },
        "Negative times are valid; the long overlapping interval is skipped.",
      ],
      [{ slots: [] }, { selected: [] }],
      [{ slots: [[5, 6]] }, { selected: [0] }],
      [
        {
          slots: [
            [1, 3],
            [1, 3],
            [3, 4],
          ],
        },
        { selected: [0, 2] },
      ],
      [
        {
          slots: [
            [1, 5],
            [0, 5],
            [5, 8],
          ],
        },
        { selected: [1, 2] },
      ],
    ],
  }),
  exercise({
    key: "practice-escaped-field-parser",
    title: "Parse escaped telemetry fields",
    difficulty: "MEDIUM",
    category: "String parsing",
    description:
      'Parse a telemetry string into fields separated by unescaped | characters. Backslash may escape only | or another backslash; any other escape or a trailing backslash is invalid. All other printable ASCII characters, including spaces, are literal. Input: {"text": string}. Output: {"valid": boolean, "fields": string[]}. On invalid input, fields must be []. Empty input is one empty field; leading, trailing, and consecutive separators preserve empty fields. JSON itself needs backslashes escaped before parsing; solve receives the already parsed string.',
    constraints:
      "0 <= text.length <= 100000; text contains printable ASCII characters (character codes 32..126).",
    tags: ["string-parsing", "finite-state-machine", "escaping", "linear-scan"],
    hints: [
      "Use an escape-state flag rather than splitting at every separator.",
      "Reject unsupported escapes immediately and reject unfinished escape state at the end.",
    ],
    solution:
      "## Approach\n\nScan characters with a normal state and an escaped state. In normal state, a separator completes the current field and a backslash enters escaped state. In escaped state, accept only a literal separator or backslash and return to normal. Accumulate characters in an array to avoid depending on repeated-string-concatenation performance. Append the final field even if empty. Any invalid escape discards all partial fields.\n\n## Complexity\n\nO(n) time and O(n) space including accumulated field characters and output.",
    solutionCode: `function solve(input) {
  const fields = [];
  let buffer = [], escaped = false;
  for (const char of input.text) {
    if (escaped) {
      if (char !== "|" && char !== "\\\\") return { valid: false, fields: [] };
      buffer.push(char); escaped = false;
    } else if (char === "\\\\") escaped = true;
    else if (char === "|") { fields.push(buffer.join("")); buffer = []; }
    else buffer.push(char);
  }
  if (escaped) return { valid: false, fields: [] };
  fields.push(buffer.join(""));
  return { valid: true, fields };
}`,
    fixtures: [
      [
        { text: "a\\|b|c" },
        { valid: true, fields: ["a|b", "c"] },
        "The escaped separator stays in the first field; the unescaped one separates c.",
      ],
      [
        { text: "|x||" },
        { valid: true, fields: ["", "x", "", ""] },
        "Leading, consecutive, and trailing separators each preserve empty fields.",
      ],
      [{ text: "" }, { valid: true, fields: [""] }],
      [{ text: "z" }, { valid: true, fields: ["z"] }],
      [{ text: "a\\" }, { valid: false, fields: [] }],
      [{ text: "\\q" }, { valid: false, fields: [] }],
      [{ text: "a\\\\b| x " }, { valid: true, fields: ["a\\b", " x "] }],
    ],
  }),
];

export const caseStudies: CaseStudyContent[] = [
  {
    topicSlug: "system-design",
    key: "case-community-workshop-reservations",
    title: "Hypothetical community workshop seat reservations",
    excerpt:
      "Design a small seat-allocation service whose central invariant is preventing overselling, even with retries, expired holds, and notification outages.",
    tags: ["system-design", "transactions", "idempotency", "reservation", "outbox"],
    references: [queueReference, cacheReference],
    content: `# Community workshop seat reservations

This is an original hypothetical design for a community workshop platform, not a description of any company's internal reservation system.

## Requirements and scope

Organizers publish workshops with a fixed capacity. Members can hold one seat for five minutes, confirm a hold, cancel a booking, and inspect their own booking history. Assume 20,000 workshops, 50 seats per workshop, and bursts of 500 hold requests per second for a popular release. The essential invariant is that confirmed seats plus unexpired holds never exceed capacity. A member may have at most one live allocation per workshop. Browsing should remain available during a notification outage, but reservation writes should fail closed if their transactional authority is unavailable.

Capacity reductions are allowed only if the new capacity is not below currently allocated seats. Payment processing is outside this exercise; confirmation represents an organizer-approved booking. Hold expiration is based on database time, not a browser clock. Public availability is informational and may lag by a few seconds; a successful hold is the authoritative promise.

## API and data model

Use POST /workshops/{id}/holds with an Idempotency-Key and an authenticated member identity. The response contains holdId, expiresAt, and status. POST /holds/{id}/confirm and DELETE /bookings/{id} are idempotent state transitions. GET /workshops/{id}/availability returns capacity, estimatedAvailable, and observedAt. Unauthorized callers must not learn another member's booking details.

Workshop stores id, capacity, state, and version. Allocation stores id, workshopId, memberId, state, expiresAt, and revision; states are HELD, CONFIRMED, EXPIRED, and CANCELLED. An idempotency table has a unique memberId/key pair, request hash, outcome, and retention deadline. Reusing a key with a different request is a conflict. Outbox stores eventId, aggregateId, revision, payload, and publishedAt. Index allocation by workshopId/state/expiresAt and memberId/workshopId. Preserve historical rows instead of overwriting the member's audit trail.

## Consistency and execution

A hold transaction locks the workshop row, marks its due holds expired, checks for an existing live member allocation, counts current allocations, and inserts the new hold only if room remains. All mutations for the same workshop take the same row lock in the same order. Confirmation locks that row and allocation, rechecks state and expiration against database time, and writes a confirmed transition plus an outbox event. It cannot revive an expired hold, even if the expiration worker has not visited it. Cancellation releases capacity within the same transaction. Database constraints and a member/workshop guard row can additionally serialize conflicting allocations from the same member.

The expiry worker is an optimization, not the correctness mechanism: every write settles due holds before allocating. Availability reads may use a short-lived cache, but cached counts never decide whether a seat can be granted. The publisher sends outbox events after commit, retries with stable event IDs, and consumers deduplicate event IDs. A notification failure cannot roll back a confirmed booking.

## Alternatives and tradeoffs

A counter-based design is faster than counting allocations under a lock, but introduces reconciliation obligations when holds expire. A Redis-only hold inventory offers low latency but requires a convincing durability and failover story; losing acknowledged holds violates this platform's promise. Optimistic version checks avoid waiting on locks at modest contention, yet create retry storms during a seat release. The row-serialized approach is intentionally conservative for workshops with only tens of seats. Partitioning by workshop distributes different workshops but cannot eliminate one hot workshop's serialized decision point.

## Bottlenecks, failures, and operations

The hot workshop lock is the primary bottleneck. Bound lock wait time, use admission control per workshop, and return a retryable busy response instead of piling up connections. Track hold success latency, lock waits, expiration lag, outbox age, and reconciliation discrepancies. A crash after commit but before the HTTP response is handled by the idempotency record. A crash before commit grants no seat. During database failover, return an unavailable response; do not consult stale availability to approve writes. Keep idempotency records longer than supported client retry windows, and document that a new key represents a new attempt.

## Testing and evolution

Run concurrency tests with more clients than seats, including simultaneous cancellation, confirmation, and expiration. Assert the capacity invariant after every committed transition. Inject a crash between commit and response, replay the same key, and verify exactly one allocation. Advance a controlled database clock around the five-minute boundary, and test capacity reduction during live holds. Replay duplicate outbox events and simulate a week of notification outage without corrupting bookings. Before changing the allocation schema, compare a read-only shadow availability calculation against production records and repair discrepancies transactionally.

## Sources

[Queue-based load leveling](${queueReference.url}) motivates decoupling notifications from reservation commits. [Cache-aside](${cacheReference.url}) provides background for advisory availability caching. These public patterns inform the tradeoff discussion; the scenario, API, state machine, and failure analysis above are independently authored.`,
  },
  {
    topicSlug: "system-design",
    key: "case-study-progress-sync",
    title: "Hypothetical offline study-progress synchronization",
    excerpt:
      "Separate append-only attempt events from editable preferences so intermittent devices can synchronize without overwriting valid learning activity.",
    tags: ["system-design", "offline-sync", "event-log", "conflict-resolution", "pagination"],
    references: [queueReference, cacheReference],
    content: `# Offline study-progress synchronization

This original hypothetical architecture serves a study application used on laptops and phones. It is not a claim about an existing vendor's internal synchronization implementation.

## Requirements and boundaries

Learners record practice attempts while offline, then synchronize later. The application displays completed lessons, recent attempts, and personal study goals across devices. Assume 100,000 daily learners, two devices per learner, and up to 1,000 offline events per device. Acknowledged attempts must not disappear. Synchronization can be eventually consistent for dashboards, but authorization and event ingestion must be immediate. The system must tolerate duplicated uploads, clock skew, device resets, and lesson revisions.

An attempt is immutable evidence that an activity occurred, whereas a daily goal is an editable preference. Treating both as last-write-wins documents would lose attempts when devices overwrite each other. Client timestamps describe user experience but must not control ordering or access. Completion is defined against a specific lesson revision; completing revision 3 does not silently certify newly added material in revision 4.

## APIs and persistence

POST /sync/events accepts at most 200 records with eventId, deviceId, localSequence, lessonId, lessonRevision, kind, and payload. Return an outcome per record: accepted, alreadyAccepted, or rejected with a stable validation code. A batch may partially succeed, so clients remove only acknowledged entries. GET /sync/changes?cursor=... returns authorized account changes and a new opaque cursor. PUT /preferences/goal requires an If-Match revision; a stale revision receives a conflict including the current value.

AttemptEvent has accountId/eventId as a unique key, a canonical payload hash, receivedAt, and a serverSequence scoped to the account. Device has accountId, deviceId, status, and lastSeenAt. LessonProgress materializes completion by accountId/lessonId/revision. Preference stores value and revision. ChangeLog indexes accountId/serverSequence. A second event with the same ID but a different hash is rejected instead of being mistaken for a valid retry. Validate device ownership on every upload, even if it was valid when an event was originally created offline.

## Merge and synchronization protocol

Store new events and their change-log rows in one database transaction. Allocate server sequences under a per-account guard so commit order cannot create permanent cursor gaps: a later visible sequence must not allow a cursor to skip an earlier uncommitted event. Alternatively use a durable log whose offsets are commit ordered. A client downloads all changes after its cursor and atomically persists both changes and the next cursor locally.

An asynchronous projector computes dashboard views from immutable events. Completion is a set union over valid lesson-revision completions. Attempts remain separate events rather than being compressed into a destructive latest document. Goal edits use compare-and-set and let the client explicitly choose a value after a conflict. Expose projectedThroughSequence so a device knows whether a freshly accepted attempt is included in the dashboard. A device can overlay its pending local events without pretending they are server-confirmed.

## Alternatives and tradeoffs

A full CRDT framework can support collaborative editing, but is unnecessary for immutable attempts plus a few scalar preferences. Whole-account snapshot replacement is simple yet unsafe across devices. Server ingestion followed by synchronous projection gives immediate dashboard consistency but makes large offline uploads hold database resources longer. The asynchronous projector trades a visible lag indicator for shorter ingestion transactions. Cache account dashboards with a short TTL and a version key; do not cache event deduplication decisions.

## Failure modes and bottlenecks

Long-offline devices can create bursty uploads. Apply account quotas, batch limits, and queue backpressure to projection work. A poison event must be isolated with an explicit rejection reason rather than blocking the entire account forever. If the projection worker crashes, replay from its persisted sequence checkpoint and use idempotent upserts. If change-log retention expires a cursor, return a resnapshot-required response; paginate the snapshot consistently and obtain a cursor corresponding to its snapshot boundary. Deleting an account revokes devices first, then removes retained events and cached views according to policy.

Measure ingestion latency, duplicate ratio, projection lag, cursor-expiry rate, and per-account queue depth. Avoid logging educational payloads or device identifiers unnecessarily. Bound payload sizes and reject unsupported schema versions rather than accepting data the projector cannot interpret.

## Testing and rollout

Generate two-device histories with reordered uploads, repeated events, skewed timestamps, and concurrent goal updates. Verify attempt-set union and explicitly exercised preference conflicts. Crash the projector before and after checkpoint persistence and compare a rebuild against incremental results. Test retention-boundary resnapshot while another device writes new events. Use lesson-revision fixtures to prevent accidental completion carryover. Roll out a new projector beside the old one, compare account aggregates, and switch only after the replayed history agrees.

## Sources

[Queue-based load leveling](${queueReference.url}) is background for absorbing synchronization bursts. [Cache-aside](${cacheReference.url}) discusses the risks of stale materialized reads. The event identity, cursor protocol, and domain merge rules here are original design decisions.`,
  },
  {
    topicSlug: "system-design",
    key: "case-document-preview-pipeline",
    title: "Hypothetical document-preview processing pipeline",
    excerpt:
      "Build bounded, retryable preview generation with quarantined uploads, immutable job versions, and explicit resource limits.",
    tags: ["system-design", "queues", "object-storage", "idempotency", "worker-isolation"],
    references: [queueReference, claimCheckReference],
    content: `# Document-preview processing pipeline

This is an independently authored hypothetical service for generating previews of teaching documents. It does not describe the internals of a real file-hosting company.

## Functional and operational requirements

Teachers upload PDF documents and receive a small thumbnail plus a text-only preview. Files are private to a classroom unless explicitly published. Assume 50,000 uploads daily, a 20 MB file limit, and occasional bursts of 100 uploads per second after class. Upload acknowledgement should be quick; previews may take up to a minute. The system must never publish a partially written result, must bound CPU and memory consumption per file, and must delete source files and all derived objects when an owner requests deletion.

Only PDF is supported initially. Type declarations and filename extensions are not trusted; ingestion validates actual file signatures and parser outcomes. Rendering untrusted documents belongs in isolated workers with no broad service credentials. A FAILED result is an explicit state, not a promise that retries will eventually succeed. Retryable infrastructure errors and permanent malformed-file errors must be distinguished.

## APIs and records

POST /documents creates an upload session after checking classroom permissions and quota. Return documentId, an expiring upload URL restricted to one object key, and a checksum requirement. POST /documents/{id}/complete verifies stored length and checksum, transitions the source to QUARANTINED, and creates a processing job. GET /documents/{id}/preview returns status or an authorized short-lived result URL. DELETE /documents/{id} starts deletion and immediately makes preview reads unavailable.

Document stores ownerId, classroomId, sourceKey, sourceHash, bytes, state, deletionEpoch, and createdAt. PreviewJob stores documentId, sourceHash, rendererVersion, attemptCount, leaseUntil, fenceToken, status, and errorCode. Enforce uniqueness on documentId/sourceHash/rendererVersion. PreviewArtifact stores immutable object keys, dimensions, byte lengths, and the publishing job version. Outbox rows connect the database job creation to queue publication. Never use a user-supplied filename as an object key.

## Processing and publication

The completion transaction records source metadata, inserts the job, and appends its outbox event. A queue delivers the stable job ID at least once. Workers claim a lease and a monotonically increasing fence token using a conditional update. They fetch the quarantined source, scan it, and render within strict page, memory, CPU, and wall-clock limits. Derived objects are written to versioned keys. A publication transaction verifies the current lease token, matching source hash, and unchanged deletion epoch before atomically setting READY and attaching artifact metadata.

If a stale worker finishes after its lease expires, its conditional publication fails. This prevents it from overwriting a newer worker's result. Orphaned versioned objects are cleaned by a delayed sweep, not by a worker deleting keys that another job might now use. Deletion increments the epoch and marks the document DELETING; all reads reject immediately while a reconciler removes source, thumbnails, text, and old versions. A deleted document cannot be resurrected by a late job.

## Alternatives and tradeoffs

Synchronous rendering saves a queue but ties request duration to a potentially adversarial parser workload. A shared worker process amortizes startup cost but makes per-job containment harder. One isolated container per job improves isolation at higher cold-start and scheduling cost. A managed batch pool with per-task resource limits is a middle ground. Storing previews in the relational database simplifies atomicity but amplifies backups and row transfer costs; immutable object storage plus an atomic metadata pointer separates bulk data from control state.

## Bottlenecks, failures, and capacity

Rendering capacity, not API throughput, is likely limiting. At an average four seconds of CPU per document, 100 sustained uploads per second need roughly 400 busy cores before overhead; the burst must queue or be admitted more slowly. Scale by oldest job age and resource saturation, not queue length alone. Apply per-classroom concurrency limits so one teacher cannot monopolize workers. Retry transient storage or scheduler failures with capped backoff; quarantine malformed documents permanently and expose a safe error code without parser traces.

Observe upload-finalization failures, queue age, lease conflicts, render duration percentiles, artifact orphan counts, and deletion lag. Reconcile objects with metadata periodically. If the queue is down, committed outbox jobs remain durable but preview latency grows; the service should say PROCESSING rather than manufacture readiness.

## Testing and releases

Test duplicate completion calls, duplicate queue delivery, lease expiry mid-render, worker termination after upload but before publication, and deletion during every job phase. Use harmless malformed documents, oversized page counts, and invalid checksums to verify rejection boundaries. Compare rendered output for a versioned fixture corpus when changing renderer versions. Deploy new workers for new versioned jobs, keeping old results readable until controlled reprocessing succeeds. Audit object permissions independently of application route checks.

## Sources

[Queue-based load leveling](${queueReference.url}) supplies general background for asynchronous processing and backlog control. [Claim Check](${claimCheckReference.url}) explains keeping large payloads outside the message broker; this pipeline follows that separation by queuing a stable job ID and resolving its source object through durable metadata. Source authorization, retention, and deletion still require explicit coordination. The upload contract, fencing protocol, resource assumptions, and deletion design are original educational choices.`,
  },
  {
    topicSlug: "system-design",
    key: "case-neighborhood-directory-search",
    title: "Hypothetical neighborhood resource directory",
    excerpt:
      "Design search over moderated resource listings while making freshness, authorization, and index-rebuild behavior explicit.",
    tags: ["system-design", "search-index", "cache-aside", "versioning", "moderation"],
    references: [cacheReference, queueReference],
    content: `# Neighborhood resource directory

This original hypothetical directory lists public community rooms, equipment libraries, and local classes. It is not a description of any commercial search product's internal architecture.

## Requirements and product semantics

Visitors search by keyword, category, neighborhood, and opening day. Volunteers propose edits; moderators approve them before publication. Listings have geographic coordinates, opening schedules, accessibility notes, and an owner contact that may remain private. Assume 200,000 listings, 2 million searches daily, and 10,000 proposed edits daily. Search should usually reflect an approved edit within 30 seconds. A listing detail read must immediately hide a removed listing, even if a stale search hit still exists.

The primary database is authoritative for publication status. Search is a discovery projection, not a permissions database. Results need stable pagination within a short browsing session, but perfect ranking stability across days is unnecessary. Exact travel-time routing and personalized behavioral ranking are outside scope. Each result carries the listing revision so the detail page can identify stale snippets.

## API and model

GET /resources/search accepts q, category, neighborhoodId, openDay, cursor, and a limit capped at 50. Return hits, an opaque next cursor, and indexObservedAt. GET /resources/{id} performs a canonical visibility check. POST /resources/{id}/proposals submits a versioned proposal; POST /proposals/{id}/approve requires moderator authorization and the expected base revision. A stale proposal is a conflict rather than silently discarding another moderator's edit.

Resource stores id, publicRevision, state, category, location, schedule, publicText, and privateContact. Proposal stores submitterId, baseRevision, proposedPublicFields, state, and review metadata. IndexEvent stores resourceId, revision, desiredOperation, and its outbox event ID. Search documents include only public fields plus sourceRevision. Approval writes the canonical resource, review history, and outbox event atomically. An indexer ignores events older than the currently indexed revision and treats deletions as versioned tombstones.

## Read and indexing paths

Search queries an inverted index with structured filters and simple relevance scoring. A cursor binds the query hash, sort tuple, and index snapshot token; changing filters invalidates it. For removal-sensitive results, bulk-check the candidate IDs against canonical publication status before responding, avoiding a query per hit. This may return fewer than the requested limit when many candidates are stale; fetch a bounded extra candidate batch rather than scanning without a limit.

Detail pages use cache-aside for public resource fields with a short TTL, revisioned keys, and invalidation after approval or removal. The authorization and removal check is not bypassed on a cache hit. Cache search pages only for popular nonpersonal queries, and never include private owner contacts. An index rebuild consumes a database snapshot then catches up from a captured event boundary. Switch an alias only after revision checks pass, retaining the old index briefly for compatible cursors.

## Alternatives and tradeoffs

Database text search can be sufficient initially and removes dual-write projection complexity, but sophisticated relevance and facet traffic compete with transactional edits. A dedicated index isolates that workload at the price of lag and reconciliation. Updating the index inside the approval request appears immediate but cannot atomically commit both systems; an outbox avoids losing approved edits if the index is unavailable. Long-lived snapshot cursors stabilize pages but retain index resources; short expiry and a clear restart response cap that cost.

## Bottlenecks and failures

Broad one-letter queries and high-cardinality facets can consume disproportionate index CPU. Enforce minimum query rules, limit facets, set query deadlines, and use rate limits independent of cache hits. Retry outbox processing with stable event IDs and alert on oldest unindexed revision age. A full index outage can fall back to a small database-backed exact-name search or return an explicit degraded response; pretending cached results are fresh would conceal removals.

Ranking changes can invalidate cursors, so version the ranking configuration. Poisoned proposals with excessive text or unsupported schedule structures must fail validation before approval. Reconcile a sample of database revisions against index revisions daily, and retain tombstones long enough to defeat delayed stale upserts. Track search latency, zero-hit rate, stale-hit filtering, moderation conflicts, cache hit rate, and index lag without storing full user search histories unnecessarily.

## Testing and evolution

Exercise approval races, duplicate index events, out-of-order revisions, deletion followed by delayed update, and rebuilding while edits continue. Test a cursor against changed filters and expired snapshots. Verify public search documents never contain private contacts. Use a synthetic relevance set with misspellings, ambiguous neighborhood names, and schedule boundaries to measure intentional ranking changes. Load-test broad queries and cache expiry bursts, then verify detail removal remains immediate during index failure.

## Sources

[Cache-aside](${cacheReference.url}) informs the public-field caching discussion. [Queue-based load leveling](${queueReference.url}) is background for moderation-to-index event processing. All domain requirements, APIs, and consistency decisions above are original.`,
  },
  {
    topicSlug: "low-level-design",
    key: "case-versioned-cart-engine",
    title: "Hypothetical versioned equipment-rental cart engine",
    excerpt:
      "Specify a deterministic pricing engine with immutable quotes, explicit rule versions, and safe optimistic concurrency.",
    tags: ["low-level-design", "domain-modeling", "strategy", "money", "optimistic-concurrency"],
    references: [cacheReference, compensationReference],
    content: `# Versioned equipment-rental cart engine

This is an original hypothetical low-level design for renting community equipment. It makes no claim about the pricing internals of any marketplace.

## Requirements and invariants

A member builds a cart containing equipment IDs, integer quantities, and a rental date range. The cart can be edited, priced, and converted into a reservation request. Prices may include daily rates, a refundable deposit, and one mutually exclusive membership discount. This module calculates prices; it does not claim to reserve stock. A displayed quote must identify the rule and catalog versions used and expire after ten minutes. A checkout using an expired or mismatched quote must request repricing rather than silently charging a new amount.

All monetary amounts use integer minor units and a single explicit currency per cart. Quantity must be positive and bounded, rental end must be after start, and date interpretation uses the depot's configured calendar timezone. No floating-point multiplication of currency is permitted. Refundable deposits remain distinct from rental fees and are never discounted. A pricing result must be deterministic for identical canonical inputs and versions.

## Objects, interfaces, and API

Cart is an aggregate with id, memberId, currency, revision, and ordered CartLine records. Each line has a stable lineId, equipmentId, quantity, startDate, and endDate. Money is a value object containing currency and safe-integer minorUnits with checked addition. RentalPeriod validates dates and derives billable calendar days through a CalendarPolicy interface. PricingContext contains immutable catalogVersion, ruleVersion, membershipTier, and effectiveAt.

Define RateProvider.getRates(equipmentIds, version) as a bulk lookup, DiscountPolicy.evaluate(lines, context) as a pure function, and QuoteRepository.save(quote) as persistence. PricingEngine receives providers through construction, obtains one catalog snapshot, and returns Quote with line breakdowns, deposits, discount allocation, totals, inputHash, and expiresAt. It does not perform HTTP requests from within individual rule objects. Invalid lines produce typed validation results; infrastructure failure is distinct from a business rule rejection.

PATCH /carts/{id} requires expectedRevision and structured line operations. POST /carts/{id}/quotes returns a quote for the current revision. POST /reservation-requests accepts cartId, quoteId, and an idempotency key. It checks member ownership, quote expiry, input hash, and cart revision inside the application's transaction boundary. Persist Cart, CartLine, Quote, QuoteLine, and RequestOutcome; quote records are immutable and index memberId/cartId/revision for retrieval.

## Pricing flow and rule composition

Normalize date ranges and line ordering before hashing. Fetch all equipment rates from one catalog version, calculate base fees and separate deposits with overflow checks, then select the single eligible discount according to a documented precedence. For percentage discounts, calculate one rounded total discount and allocate minor units by largest remainder with lineId as the deterministic tie breaker. The allocated discounts must sum exactly to the total discount. A quote contains the unrounded rational basis and final integer allocation for auditability.

Rules are small strategies, but orchestration defines their order. Allowing arbitrary rule chaining would make two percentage discounts order-dependent and hard to reproduce. Store rule versions with historical quotes so future edits do not reinterpret a prior amount. The checkout coordinator handles inventory allocation in a separate domain service; pricing cannot guarantee availability and must communicate that boundary explicitly.

## Alternatives and tradeoffs

A single procedural pricing function is readable for three rules and may be preferable initially. Strategy interfaces pay off when tests need controlled catalogs or rules vary by depot. A universal expression language increases flexibility but adds validation, sandboxing, and migration complexity. Persisting only quote totals is compact but inadequate for explaining deposits or resolving rounding disputes. Persisting complete breakdowns costs space while providing reproducible customer support and audits.

Cached versioned catalogs improve latency. Never cache a mutable rate under an unversioned key and assume a quote is reproducible. Cache failures can fall back to the source provider; a missing archived catalog version should fail explicitly. Membership validation occurs at quote creation and, if product policy requires it, at checkout with a reprice response rather than retroactively changing a signed quote.

## Failures, bottlenecks, and testing

Concurrent cart edits use compare-and-set revisions to prevent lost updates. A checkout race cannot consume a quote for a different cart version. A crash after request commit is handled by the stored idempotency outcome. Bulk rate reads avoid N+1 requests; bound line count and date duration to limit pricing work. Record quote latency, catalog lookup failures, reprice frequency, and money-overflow rejections without logging private member details.

Unit-test calendar boundaries, leap days, currencies, zero discount, deposit exclusion, and deterministic one-cent allocation ties. Property tests should assert nonnegative payable totals, discount conservation, and identical quotes under repeated evaluation of the same snapshot. Integration tests race two edits, expire a quote between display and checkout, and retry a committed reservation request. Use a fake RateProvider to simulate incomplete catalog snapshots and ensure no partial quote is saved.

## Sources

[Cache-aside](${cacheReference.url}) is general background for the versioned catalog cache. [Compensating Transaction](${compensationReference.url}) informs the separate checkout coordinator's failure boundary: if an external stock hold succeeds but reservation finalization fails, release that particular hold through an idempotent compensating operation rather than restoring an old inventory snapshot. Compensation belongs to checkout orchestration, not the pure PricingEngine, and cannot retroactively change an immutable quote. The object model, monetary rules, revision protocol, and tests are independently authored educational design decisions.`,
  },
  {
    topicSlug: "low-level-design",
    key: "case-local-task-scheduler",
    title: "Hypothetical local task scheduler with leased execution",
    excerpt:
      "Model job states, concurrency permits, cancellation, and cooperative retries without pretending external side effects are exactly once.",
    tags: ["low-level-design", "state-machine", "scheduler", "leases", "retry-policy"],
    references: [queueReference, consumersReference],
    content: `# Local task scheduler with leased execution

This independently authored hypothetical scheduler runs background imports for a desktop-to-server application. It is not an account of any proprietary job framework.

## Requirements and semantics

Clients submit named jobs with a JSON payload, an optional delay, and a stable submission key. The scheduler supports at most eight concurrent executions, retries transient failures, cancels pending work, and exposes status. Jobs survive process restarts through a durable repository. Assume 10,000 pending jobs and handlers taking milliseconds to minutes. Scheduling is at least once: a handler may run again after a crash. Exactly-once external effects are not promised.

Cancellation of a pending job is final. Cancellation of a running job is a request delivered through a cooperative signal; handlers must check it at safe boundaries. The API must not report that an irreversible external side effect was undone. Delayed scheduling uses persisted absolute timestamps for recovery and a monotonic timer for waiting within one process. Payload size, execution duration, and retry count are bounded.

## Class model and state machine

JobRecord contains jobId, type, schemaVersion, payload, submissionKey, state, dueAt, attempt, leaseUntil, fenceToken, cancellationRequested, and outcomeCode. States are WAITING, RUNNING, SUCCEEDED, FAILED, and CANCELLED. Retry returns RUNNING to WAITING with a future dueAt; exhausted permanent failures become FAILED. A transition table, not arbitrary setters, defines valid changes.

JobRepository offers insertIfAbsent, claimDue(limit, owner), renewLease(jobId, token), finish(jobId, token, outcome), requestCancel, and recoverExpiredLeases. Claim and finish are conditional durable operations. HandlerRegistry maps type plus schemaVersion to a handler. A handler receives payload, jobId, attempt, a cancellation signal, and a side-effect idempotency token derived from jobId plus the logical operation name. RetryPolicy maps typed failures to retry delay or terminal status. Scheduler owns a bounded permit pool and never launches a task without a permit.

## APIs and control flow

POST /jobs accepts type, schemaVersion, payload, and Submission-Key. The same key with the same canonical request returns the original job; a different request conflicts. GET /jobs/{id} exposes safe status and attempt metadata. POST /jobs/{id}/cancel is idempotent. Job type schemas validate payloads at submission and handlers revalidate persisted schema versions when executing. Unknown historical handler versions are quarantined instead of guessed.

The scheduler claims no more jobs than free permits. Each claim increments a fence token and installs a lease. A running handler periodically renews its lease while it remains healthy. Finish succeeds only for the active token; a stale executor cannot overwrite a later attempt. The permit is released in a finally path regardless of handler success. A process restart recovers expired claims, with bounded backoff to prevent every orphaned job restarting simultaneously.

## Ordering, retries, and external effects

A priority queue by dueAt and insertion sequence accelerates local wakeups, while the durable repository is the authority. New earlier jobs notify the scheduler so it recomputes its sleep deadline. Stable insertion sequence defines FIFO only among equally due jobs, not global completion order. Retry delays use exponential backoff with bounded jitter and a maximum elapsed retry window. Permanent validation errors do not retry.

Fencing protects job-state updates but cannot itself prevent a duplicate email or payment in a downstream system. Handlers must supply idempotency keys to compatible destinations or reconcile uncertain outcomes before repeating effects. A timeout after an external call is an unknown result, not automatically a safe retry. Handlers performing multiple steps keep durable checkpoints for completed logical operations.

## Alternatives and tradeoffs

An in-memory-only scheduler is simpler but loses jobs on restart. Polling the repository avoids a local heap but costs queries and adds wakeup latency. Combining a local heap with periodic durable refresh improves latency while tolerating missed notifications. One global concurrency limit is easy to understand; per-type permits improve isolation when slow imports otherwise starve quick tasks. A distributed queue may become appropriate at larger scale, but introduces acknowledgement and visibility-timeout semantics the small deployment may not need yet.

## Failure handling and test plan

Repository outage stops new claims; already running jobs should stop before making more unfenced irreversible effects if they cannot renew. Alert on expired lease rate, oldest waiting job age, permit utilization, retries, and cancellation latency. Keep error codes safe and preserve detailed traces only in access-controlled operational logs. Poison jobs move to FAILED with an operator-visible diagnostic reference.

Use a fake clock and repository to test earlier-job wakeups, retry boundaries, delayed jobs, and restart recovery deterministically. Race cancellation against claim and against successful finish; specify which committed transition wins. Crash after an external effect but before finish and verify the handler's idempotency strategy. Assert permits are always returned after exceptions, no stale token can finalize, and unsupported payload versions never execute. Stress-test 10,000 delayed jobs without one timer per job.

## Sources

[Queue-based load leveling](${queueReference.url}) provides general background for buffering background workloads. [Competing Consumers](${consumersReference.url}) informs the multi-executor alternative: workers share pending jobs through exclusive claims, but concurrent completion order is not submission order, and crash recovery still requires idempotent handlers. The scheduler's bounded permits and durable claims adapt those concerns to a small local deployment. The state machine, repository interfaces, cooperative cancellation semantics, and fencing analysis are original.`,
  },
  {
    topicSlug: "low-level-design",
    key: "case-library-lending-ledger",
    title: "Hypothetical equipment-library lending ledger",
    excerpt:
      "Model physical copies, loans, return inspections, and fair wait queues as separate concepts with transactional invariants.",
    tags: ["low-level-design", "aggregates", "state-machine", "transactions", "wait-queue"],
    references: [queueReference, priorityReference],
    content: `# Equipment-library lending ledger

This original hypothetical low-level design supports a neighborhood equipment library. It is not presented as the implementation of a real library or rental company.

## Requirements and invariants

Members borrow physical copies of tools, return them, and join a wait queue when no copy is ready. A catalog item such as a drill can have many copies with independent condition and availability. A returned copy enters inspection before becoming available again. Each copy has at most one active loan, a suspended member cannot start a loan, and a member may borrow at most three copies. The lending desk needs synchronous authoritative decisions; reminder messages can be asynchronous.

Assume one library, 5,000 copies, and fewer than 20 concurrent clerks. Due dates use the library's local calendar and closed-day policy. An overdue loan remains a loan until returned or explicitly marked lost; changing its display status must not release the copy. Fines and payment collection are outside this module. Waiting members receive a short hold when a copy becomes ready, rather than an immediate loan without their consent.

## Domain model and interfaces

CatalogItem describes shared metadata. Copy has copyId, itemId, state, conditionNote, and revision. Copy states are READY, HELD, ON_LOAN, INSPECTION, and RETIRED. Loan records loanId, copyId, memberId, borrowedAt, dueAt, returnedAt, and state. Member has eligibilityState, revision, and a borrowing-limit policy. WaitEntry contains itemId, memberId, enqueueSequence, state, and offerExpiresAt. Hold binds one copy to one waiting member and expires independently of the loan record.

LendingService coordinates CheckoutPolicy, DueDatePolicy, CopyRepository, LoanRepository, MemberRepository, and WaitQueueRepository. Policies are pure decisions over supplied snapshots; repositories own persistence. ReturnService accepts a loan identity rather than merely a catalog title, preventing the wrong physical copy from being released. An InspectionDecision is READY or RETIRED with a required reason for retirement. NotificationPort receives committed domain events, never runs inside an aggregate's state transition.

## API and transactional flow

POST /loans accepts copyId, memberId, expectedCopyRevision, and an idempotency key. Lock the member guard before the copy guard in every checkout transaction, recheck eligibility and active-loan count, verify READY or a valid hold owned by that member, then create the loan and move the copy to ON_LOAN. A database uniqueness rule for active copy loans provides a final defensive check. Concurrent checkouts by the same member serialize through the member guard, avoiding a limit-check race.

POST /loans/{id}/return verifies the active loan, records returnedAt, moves the copy to INSPECTION, and writes an outbox event atomically. Repeating it returns the original completed result. POST /copies/{id}/inspection finalizes the condition decision. If READY, the service locks the catalog item's wait-queue guard and creates a hold for the oldest eligible active entry. POST /holds/{id}/accept converts an unexpired hold into a loan under the same checkout constraints. Expiration releases the copy and advances the queue transactionally.

## Fairness and edge behavior

Queue fairness is FIFO among currently eligible entries, using a durable enqueueSequence rather than client time. A suspended member's entry is skipped and marked temporarily ineligible with an explanation; it must not block everyone behind it. Define whether reactivation preserves priority or requires rejoining. This design requires rejoining so old inactive requests cannot unexpectedly capture new stock. Repeated join requests use a uniqueness guard for an active member/item pair.

Lock order is member, item, copy wherever multiple guards are required. Inspection and hold-expiry operations that do not need a member start at item then copy. Avoid holding a copy lock while trying to acquire an earlier guard. A clerk's stale revision yields a conflict with the current safe copy state. Correctness is based on database time for hold expiry and on explicit state, not cached catalog availability.

## Alternatives and tradeoffs

Combining catalog item and copy into one object hides physical-copy identity and fails for mixed conditions. A huge aggregate containing all copies and queue entries is easy to reason about but causes unnecessary serialization. Separate records with a thin service transaction suit this modest concurrency. Event sourcing could provide a richer historical ledger, but raises replay-versioning and migration costs; an append-only audit table plus current-state records is sufficient here.

## Failures, bottlenecks, and testing

The item wait-queue guard can be hot for popular tools. Keep the queue-selection transaction short and index itemId/state/enqueueSequence. Notifications use outbox delivery with deduplication; a reminder outage never reverses a loan. Expiry workers settle due holds before issuing the next one, and acceptance rechecks expiration even if the worker is delayed. Monitor active-loan uniqueness violations, hold-expiry lag, inspection backlog, and checkout conflicts.

Test two clerks checking out the same copy, four parallel checkouts against a three-loan limit, repeated returns, inspection racing a hold expiry, and acceptance exactly at expiry. Model-test every legal and illegal copy transition. Verify closed-day due dates with deterministic calendar fixtures. Replay duplicate notifications and rebuild availability counts from copies and loans to detect drift. Exercise lock-order tests under concurrent checkout and inspection to reveal deadlocks before deployment.

## Sources

[Queue-based load leveling](${queueReference.url}) is background for asynchronous lending reminders. [Priority Queue](${priorityReference.url}) supplies a contrasting queue policy: prioritizing urgent requests could reduce their wait, but would weaken this library's published FIFO fairness promise and risk starving ordinary borrowers. This design deliberately keeps enqueueSequence ordering for eligible members; any future urgency tier would require an explicit fairness policy and starvation tests rather than silently changing the comparator. The physical-copy model, borrowing guards, wait fairness policy, and transition rules above are independently authored.`,
  },
  {
    topicSlug: "system-design",
    key: "case-classroom-announcement-delivery",
    title: "Hypothetical classroom announcement delivery",
    excerpt:
      "Separate durable publication, audience snapshots, inbox creation, and optional email delivery while preserving consent and deletion semantics.",
    tags: ["system-design", "fan-out", "outbox", "delivery-semantics", "consent"],
    references: [queueReference, cacheReference],
    content: `# Classroom announcement delivery

This is an original hypothetical notification architecture for classroom announcements. It makes no claims about any messaging provider's internal delivery infrastructure.

## Requirements and explicit guarantees

Teachers publish an announcement to one class. Eligible students get a durable in-app inbox item, and consenting students may receive an email summary. Assume 50,000 classes, up to 500 members per class, and 20,000 announcements daily. Publication should return within a second while inbox fan-out usually completes within a minute. The inbox must not create duplicate logical announcements under retries. Email delivery is best effort with explicit provider outcomes; the service does not promise exactly-once email delivery when a provider offers no idempotency support.

The audience is the class membership snapshot at publication, excluding members already revoked. Before actually rendering a private announcement or sending email, current access and consent are checked again. This makes historical audience membership insufficient to bypass a later revocation. Announcements may be withdrawn, but emails already delivered cannot be recalled. Attachments are links requiring authorization, not unrestricted objects embedded in an email.

## API and persistent model

POST /classes/{id}/announcements accepts title, body, and an Idempotency-Key after teacher authorization. Return announcementId, revision, and fanoutStatus. GET /inbox uses an opaque cursor and a page limit of 50. PUT /inbox/{id}/read is idempotent. POST /announcements/{id}/withdraw marks a published announcement unavailable immediately and increments its revision.

Announcement stores classId, authorId, body, state, revision, and audienceSnapshotId. AudienceSnapshot and AudienceMember capture recipient IDs under a consistent membership revision. InboxItem has a unique recipientId/announcementId pair, createdAt, readAt, and announcementRevision. DeliveryAttempt stores recipientId, announcementId, channel, status, attemptCount, providerMessageId, consentRevision, and nextRetryAt. Outbox connects publication to fan-out jobs. Store safe operational status codes separately from sensitive provider response text.

## Publication and fan-out

The publication transaction writes the announcement, captures its membership snapshot, and inserts an outbox row. For a class of at most 500 members, snapshot rows can be created within this bounded transaction. A worker reads snapshot recipients in batches and inserts inbox rows idempotently. Its checkpoint is a stable snapshot position, not an offset into a changing membership table. A retry can repeat the last batch because the inbox uniqueness key absorbs duplicates.

Email jobs are distinct from inbox jobs. Immediately before sending, check announcement state, current class access, and current email consent. A revocation before dispatch suppresses the email. A revocation racing an already dispatched provider request cannot retract it; this boundary must be part of the product's documented privacy semantics. Where supported, the provider receives a stable announcement/recipient/channel idempotency key. An ambiguous timeout is reconciled through provider status before retry, rather than assumed to be a failed send.

## Read path and alternatives

Inbox reads bulk-fetch authorized announcement metadata for the page, avoiding one query per item. Withdrawn or inaccessible entries are hidden or displayed as unavailable according to policy, never served from stale cached body text without a canonical status check. Cache immutable revisioned public rendering fragments, not recipient authorization or consent. Read state belongs to the recipient inbox item and does not alter the announcement itself.

Fan-out-on-write gives quick inbox reads but creates one row per recipient. Fan-out-on-read saves storage for very large audiences but makes membership history, unread counts, and pagination harder. A hybrid may fit school-wide broadcasts, while bounded class announcements favor fan-out-on-write. Sending email inside publication creates long request latency and an unresolvable dual-write boundary; outbox delivery separates durable intent from provider availability.

## Bottlenecks and failure handling

Email throughput and provider quotas are likely bottlenecks. Use separate queues for inbox fan-out and email, apply per-class fairness, and cap retries so a failing provider cannot starve inbox creation. Backoff with jitter handles throttling; permanent invalid-address failures are terminal and may prompt address verification. A dead-letter record should reference the logical delivery, not expose the announcement body in broad logs.

Track oldest fan-out age, inbox insertion conflicts, provider throttles, ambiguous sends, consent suppressions, and withdrawal propagation. If a worker crashes after inserts but before checkpointing, its retry repeats safely. If outbox publication fails, the committed intent is retried. A teacher retry after a lost HTTP response returns the original announcement through the idempotency outcome. Deletion policies remove bodies and attachment references while retaining minimal noncontent audit records only when justified by policy.

## Testing and rollout

Test duplicate publication keys, duplicate fan-out batches, membership changes during publication, and withdrawal between fan-out and send. Revoke consent while a job is delayed and verify suppression. Simulate provider success followed by a response timeout, both with and without provider idempotency support, and assert the documented outcome rather than claiming magical deduplication. Race read-state updates and paginate while newer announcements arrive using stable keyset ordering. Run outage drills with inbox workers healthy and email unavailable, then validate backlog recovery stays within quotas.

## Sources

[Queue-based load leveling](${queueReference.url}) informs queue isolation and quota-aware processing. [Cache-aside](${cacheReference.url}) is background for revisioned rendering caches. This audience contract, delivery model, and failure analysis are original educational material.`,
  },
];
