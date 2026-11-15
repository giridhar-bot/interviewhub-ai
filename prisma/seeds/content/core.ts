import type { TopicContent } from "./types";

// Original teaching material; references identify scope, not copied text.
// Checked 2026-11-15: W3Schools returned 403; JavaTpoint was unreachable.
// Tpoint Tech, InterviewBit, and GeeksforGeeks references were reachable.
type Question = TopicContent["questions"][number];
type QuizQuestion = TopicContent["quiz"]["questions"][number];

function q(
  key: string,
  title: string,
  prompt: string,
  answer: string,
  difficulty: Question["difficulty"],
  tags: string[]
): Question {
  return { key, title, prompt, answer, difficulty, tags };
}

function mc(
  question: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string
): QuizQuestion {
  return { question, options, correctIndex, explanation };
}

export const coreContent: TopicContent[] = [
  {
    slug: "data-structures",
    references: [
      {
        title: "DSA learning overview",
        url: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/",
        provider: "GeeksforGeeks",
      },
      {
        title: "Data structure interview guide",
        url: "https://www.interviewbit.com/data-structure-interview-questions/",
        provider: "InterviewBit",
      },
      {
        title: "DSA introduction (fetch returned HTTP 403)",
        url: "https://www.w3schools.com/dsa/dsa_intro.php",
        provider: "W3Schools",
      },
    ],
    questions: [
      q(
        "array-list-locality",
        "Arrays versus linked lists",
        "A service scans records often and occasionally inserts in the middle. Which representation would you consider?",
        "An array gives contiguous storage and constant-time indexed access, so scans benefit from cache locality. Middle insertion shifts O(n) elements. A linked list changes links in O(1) only after locating the node, usually O(n), and pays pointer and allocation overhead. For a scan-heavy record catalog, a dynamic array often wins despite occasional shifts; measure before choosing a list.",
        "EASY",
        ["arrays", "linked-lists", "locality"]
      ),
      q(
        "dynamic-array-amortization",
        "Amortized append cost",
        "Why can dynamic-array append be amortized O(1) when resizing copies every element?",
        "With geometric growth, a capacity sequence such as 4, 8, 16 makes the total copies across n appends a geometric sum bounded by O(n). Dividing by n yields amortized O(1), not a promise about each append. Growing capacity by one instead causes quadratic copying. Reserving capacity reduces latency spikes but can waste memory if an estimate is too large.",
        "MEDIUM",
        ["arrays", "amortized-analysis"]
      ),
      q(
        "list-cycle",
        "Detecting a linked-list cycle",
        "How do you detect a cycle and locate its entry without storing visited nodes?",
        "Move slow by one link and fast by two. If fast reaches null there is no cycle; if they meet, reset one pointer to the head and move both one step until they meet at the entry. The relative speed guarantees a meeting within the cycle, and the traveled-distance congruence explains the second phase. Time is O(n), space O(1); never run an unbounded traversal before checking.",
        "MEDIUM",
        ["linked-lists", "two-pointers"]
      ),
      q(
        "list-reversal",
        "Reversing links safely",
        "Describe an in-place singly linked-list reversal and its edge cases.",
        "Maintain previous, current, and a saved next pointer. Save current.next before redirecting it to previous, then advance both pointers. The invariant is that previous heads the reversed prefix while current heads the untouched suffix. Null input and one node work without special mutation rules. The operation is O(n) time and O(1) space, but shared aliases may observe changed structure.",
        "EASY",
        ["linked-lists", "invariants"]
      ),
      q(
        "stack-parser",
        "Stacks for nested delimiters",
        "Why does delimiter validation need a stack rather than counts for each delimiter type?",
        "Counts cannot distinguish properly nested pairs from crossed pairs such as ([)]. Push each opening delimiter and compare each closer with the most recent opener. Reject an empty-stack close, a type mismatch, or leftover openers. This is O(n) time and O(depth) space. A real source parser must also handle strings and comments so delimiters inside quoted text are not treated as syntax.",
        "EASY",
        ["stacks", "parsing"]
      ),
      q(
        "queue-two-stacks",
        "A queue built from stacks",
        "How do two stacks provide FIFO order, and when is a dequeue expensive?",
        "Push incoming items onto an input stack. Pop from an output stack; refill it by moving all input items only when output is empty. Moving reverses newest-first order into oldest-first order. Each item crosses at most once, giving amortized O(1) operations, although one dequeue can be O(n). It suits simple queues but not workloads requiring tight worst-case latency.",
        "MEDIUM",
        ["queues", "stacks", "amortized-analysis"]
      ),
      q(
        "ring-buffer",
        "Bounded queues and wraparound",
        "How would you represent a bounded queue without shifting items?",
        "Use an array, a read index, a write index, and either a count or an unused slot to distinguish full from empty. Advance indices modulo capacity. Enqueue and dequeue are O(1), but specify what happens when full: reject, block, or overwrite. An audio buffer might drop old frames, whereas a job queue should not silently discard work. Concurrent use also needs synchronization.",
        "MEDIUM",
        ["queues", "buffers"]
      ),
      q(
        "hash-collisions",
        "Collision strategies",
        "Compare chaining and open addressing for a hash table.",
        "Chaining stores colliding entries in per-bucket collections and tolerates a load factor above one, at the cost of pointer overhead. Open addressing keeps entries in the table and probes alternatives, improving locality but degrading as the table fills. Deletion needs tombstones or a correct backshift strategy. For a lookup cache, reserve spare capacity and test collision-heavy keys, not just random inputs.",
        "MEDIUM",
        ["hash-tables", "collisions"]
      ),
      q(
        "hash-key-contract",
        "Hash and equality contracts",
        "What breaks when an object used as a hash-map key changes?",
        "Equal keys must produce equal hashes, and equality-relevant state should remain stable while a key is stored. If a customer key is hashed from an editable email, changing that email can leave the entry in a bucket that later lookups never inspect. Use an immutable identifier or remove and reinsert the key. Unequal keys may share a hash; equality checks resolve collisions.",
        "MEDIUM",
        ["hash-tables", "immutability"]
      ),
      q(
        "bst-balance",
        "Why search trees need balance",
        "When does a binary search tree lose its logarithmic behavior?",
        "Search follows one root-to-leaf path, so cost depends on height rather than merely node count. Inserting sorted IDs into an ordinary BST can create a chain with height n and O(n) lookup. AVL or red-black balancing keeps height O(log n), adding rotation and metadata costs. A tree is useful for ordered range queries, unlike an unordered hash map with only expected constant-time point lookup.",
        "EASY",
        ["trees", "complexity"]
      ),
      q(
        "bst-delete",
        "Deleting a two-child tree node",
        "How do you remove a BST node with two children without violating ordering?",
        "Replace its key and associated payload with the in-order successor, the minimum node in its right subtree, then delete that successor at its old position. The successor has no left child, simplifying removal. Reconnect parent links and rebalance if required. Duplicate-key policy must be consistent; copying only the key while leaving the old payload silently corrupts a key-value tree.",
        "MEDIUM",
        ["trees", "mutation"]
      ),
      q(
        "heap-top-k",
        "Maintaining the largest k items",
        "A stream is too large to sort. How do you retain its largest k values?",
        "Keep a min-heap of at most k values. Insert until full; afterward replace the root only when the new value is larger. The root is the smallest retained candidate, so rejected values cannot belong to the current top k. Total cost is O(n log k) and O(k) space. Define whether equal values count as separate records and how to break ties if record identity matters.",
        "MEDIUM",
        ["heaps", "streaming"]
      ),
      q(
        "heap-build",
        "Linear-time heap construction",
        "Why is bottom-up heapify O(n) rather than O(n log n)?",
        "Heapify starts at the last internal node and sifts downward. Most nodes are near leaves and move only a few levels; only very few nodes can move the full height. Summing work by node height gives O(n). Repeated insertion instead has an O(n log n) upper bound. For a batch priority queue, bottom-up construction is preferable, though later push and pop remain O(log n).",
        "MEDIUM",
        ["heaps", "analysis"]
      ),
      q(
        "trie-prefix",
        "Prefix lookup with a trie",
        "When is a trie preferable to a hash map of complete words?",
        "A trie shares prefix paths and supports prefix enumeration without scanning every stored key. Finding a prefix takes O(L) for length L, plus the cost of returned results. A hash map is usually simpler for exact membership and may use less memory because trie nodes have substantial overhead. For autocomplete, compressed edges and sparse child maps can reduce memory while preserving prefix navigation.",
        "MEDIUM",
        ["tries", "strings"]
      ),
      q(
        "graph-representation",
        "Sparse versus dense graphs",
        "Compare adjacency lists and adjacency matrices for a network model.",
        "An adjacency list uses O(V+E) storage and enumerates a vertex's neighbors in O(degree), making it natural for sparse dependency graphs. A matrix uses O(V^2) storage but supports O(1) edge tests and suits dense graphs or bitset-based operations. For an undirected graph, lists usually record each edge twice. Preserve weight and parallel-edge semantics rather than assuming all graphs are simple.",
        "EASY",
        ["graphs", "representation"]
      ),
      q(
        "union-find",
        "Dynamic connectivity",
        "How does disjoint-set union answer connectivity queries efficiently?",
        "Represent each component by a parent tree. Find returns its representative; union links two representatives using size or rank. Path compression shortens paths during finds, giving near-constant amortized cost with balancing. It efficiently answers whether two newly connected sites share a component, but cannot directly handle arbitrary edge deletions or return the route connecting them. Those require other structures.",
        "MEDIUM",
        ["union-find", "graphs"]
      ),
      q(
        "lru-cache",
        "An O(1) LRU cache",
        "Which structures support fast lookup, recency updates, and eviction?",
        "Combine a hash map from key to node with a doubly linked list ordered by recency. On access, detach the node and move it to the front; evict from the tail when capacity is exceeded. Map and link updates are expected O(1). A singly linked list lacks efficient removal of arbitrary nodes. Synchronize the map and list together, and distinguish a missing key from a cached null value.",
        "HARD",
        ["hash-tables", "linked-lists", "caching"]
      ),
      q(
        "range-structures",
        "Fenwick trees versus segment trees",
        "Which range-query structure would you choose for point updates and interval sums?",
        "A Fenwick tree gives O(log n) point updates and prefix sums with compact storage; interval sums subtract two prefixes. A segment tree also gives O(log n) operations and more easily supports arbitrary associative aggregates or lazy range updates. For a mutable sales-total dashboard, Fenwick is often enough. Range minimum cannot be obtained by subtracting prefix minima, so the aggregate's algebra matters.",
        "HARD",
        ["fenwick-tree", "segment-tree"]
      ),
      q(
        "monotonic-deque",
        "Sliding-window maxima",
        "How does a deque find every window maximum in linear time?",
        "Store indices in decreasing value order. Remove expired indices from the front and remove dominated values from the back before adding the new index. The front is then the maximum of the current window. Each index enters and leaves at most once, giving O(n) time and O(k) space. Keeping indices, not just values, handles expiration and duplicate values correctly.",
        "HARD",
        ["deques", "sliding-window"]
      ),
      q(
        "persistent-structures",
        "Persistent snapshots",
        "How can versions of a tree share storage without copying the entire tree?",
        "Path copying creates new nodes only along the modified root-to-leaf path while reusing untouched immutable subtrees. A balanced tree update can therefore allocate O(log n) nodes and retain previous roots as snapshots. This is useful for undo history or consistent readers, but retained versions keep memory alive. Persistence does not automatically provide thread-safe mutation of root pointers or transactional multi-object updates.",
        "HARD",
        ["trees", "persistence"]
      ),
    ],
    notes: [
      {
        key: "representation-foundations",
        title: "Representation, invariants, and cost models",
        excerpt: "Choose storage by operations and prove what each mutation preserves.",
        content: `# Representation before implementation

A data structure is a representation plus rules that keep it meaningful. Start with the workload: point lookup, ordered traversal, middle insertion, prefix lookup, or range aggregation. Record the expected number of items, update frequency, memory budget, and whether latency spikes are acceptable. An asymptotically attractive structure can lose on a small workload because allocation and pointer chasing dominate its operations.

## Distinguish three kinds of cost

Worst-case cost bounds one operation. Average-case cost needs an input distribution. Amortized cost spreads expensive events across an operation sequence without assuming random inputs. A geometrically growing array has amortized constant-time append, but the append that reallocates still copies existing elements. Hash-table lookup is usually expected constant time under suitable hashing and load control, not universally constant time.

## Write invariants explicitly

For a list, the reachable next links must terminate unless cycles are intentionally supported. For a doubly linked list, each node's next neighbor must point back through previous. For a BST, all keys in the left subtree obey the chosen ordering rule relative to the root. For a min-heap, every parent's value is no greater than its children's values; siblings need not be ordered.

\`\`\`text
Dynamic array: 0 <= size <= capacity
Queue: logical order starts at readIndex and contains count items
Hash map: equal keys hash equally; every live entry is discoverable
Disjoint set: each parent chain ends at a representative
\`\`\`

These statements guide both code and tests. After an LRU cache eviction, verify that the evicted node is absent from both the list and the map. Checking only returned values may miss a memory leak or stale reference.

## Model the machine as well as the mathematics

Arrays pack records together and make sequential reads predictable. Linked structures allow local relinking but consume references and frequently touch scattered memory. A matrix makes edge existence cheap but allocates space for absent edges. A trie may share character prefixes while spending more memory on child collections than on the words themselves.

Use a practical decision: for a catalog of 500 products mostly rendered in order, an array is a strong default. For a large event stream requiring only its best 50 scores, a bounded heap avoids retaining the whole stream. For dependency traversal, a sparse adjacency list avoids quadratic storage. Explain the operation that drives the decision and one requirement that would make you change it.

## Ownership and identity

Mutations are observable through aliases. Reversing a list changes what every holder of those nodes sees. Mutable hash keys can become unreachable in their original bucket. Prefer immutable keys and clearly owned mutable containers. A snapshot needs a deliberate copy or persistent structure, not merely another reference to the same root.`,
      },
      {
        key: "structure-lab",
        title: "A practical structures laboratory",
        excerpt:
          "Build small containers, compare them to an oracle, and measure realistic operations.",
        content: `# Build, trace, and test

Use a local in-memory exercise set; no production data is needed. Begin with a bounded queue of capacity four. Track read index, write index, and count on paper through enqueue A, enqueue B, dequeue, enqueue C, enqueue D, enqueue E. The wraparound must preserve B, C, D, E in that order. Specify full behavior before implementing it: rejection is easier to test than silent overwrite.

## Exercise 1: linked mutations

Reverse a list of three labeled nodes. Before changing a link, save the next node. Check that the new tail points to null and every original node is reachable exactly once. Add empty and singleton inputs. Then implement cycle detection on a list whose last node points to its middle node; do not use ordinary traversal as your test oracle because it would never terminate.

\`\`\`text
previous = null
current = head
while current is not null:
  savedNext = current.next
  current.next = previous
  previous = current
  current = savedNext
return previous
\`\`\`

The key assertion is about two regions: a reversed prefix and an untouched suffix. This is more explanatory than memorizing pointer assignments.

## Exercise 2: stream ranking

Feed scores 7, 2, 9, 4, 11, 3 into a min-heap with k = 3. The retained multiset should end as 7, 9, 11, although heap storage is not sorted. Compare results with sorting a copy of each short prefix and taking its largest three values. Include duplicates, negative scores, and k larger than the number of observed values. Reject negative k and define zero as an empty result.

## Exercise 3: recency and connectivity

Create an LRU cache of capacity two. Insert A and B, read A, then insert C; B must be evicted. Updating A should not create a second list node. For disjoint sets, join sites 0-1 and 2-3, then 1-2. All four should share a representative, but its numeric ID is an implementation detail, not the expected answer.

## Exercise 4: ranges

Build a Fenwick tree over daily counts 3, 1, 4, 2. Check every interval against a direct array sum, then update one day and repeat. Keep external zero-based indexing separate from the tree's internal one-based indexing. Use a segment tree instead if the exercise changes from sums to minimum with general point replacement.

## Measure responsibly

Benchmark batches of operations after setup, keeping input generation outside the timed loop. Compare scan-heavy arrays with lists and sparse graphs with matrices. Report item count, operation mixture, memory usage where available, and multiple timings. A benchmark of repeated access to one hot key does not represent a large random working set. Finish with a short decision record linking the observed behavior to the representation rather than declaring one structure universally best.`,
      },
      {
        key: "structure-pitfalls",
        title: "Failures hidden behind correct-looking results",
        excerpt: "Review boundary conditions, ownership, collision behavior, and retained memory.",
        content: `# Structural correctness is more than a sample output

A queue can return the right first item and still corrupt its wraparound state. A tree can find existing keys while quietly losing a subtree on deletion. Review internal invariants after mutations, not just the visible answer. Keep a simple array or map as a reference model for short randomized operation sequences.

## Boundary traps

An empty heap cannot supply a root. A window of width zero needs an explicit rejection or documented interpretation. A ring buffer with identical read and write indices is ambiguous unless count or a reserved empty slot distinguishes full from empty. A binary tree's empty height convention affects formulas but should not change behavior.

\`\`\`text
Useful tests:
insert into empty -> remove last -> insert again
delete root with two children -> verify all surviving keys
many identical values -> expire only the correct window indices
hash collisions -> delete one key -> find every remaining key
\`\`\`

## Local changes can break global reachability

Saving a list's next pointer after overwriting it loses the suffix. Deleting an open-addressed hash entry by simply clearing its slot can terminate later probes too early; use tombstones or a proven repair algorithm. During BST deletion, move key and payload together. During LRU removal, update both neighboring links and the hash map in one logical operation.

## Complexity claims have assumptions

A linked-list insertion is constant time only with the insertion location already known. A hash table's expected constant-time behavior depends on hash quality and load management. A trie lookup is linear in key length, which is not the same as constant time in the number of stored keys. Reporting output also costs time: prefix search with ten thousand matches cannot return them all in O(prefix length).

## Memory and lifetime

Persistent roots retain shared subtrees until no reachable version needs them. A cache with correct eviction order can still leak if another collection holds evicted nodes. Clearing a container's logical size may not clear references in its backing storage; use the runtime's ownership and garbage-collection rules deliberately. Resizing reserves spare capacity, so compare live items with allocated capacity when investigating memory pressure.

## Concurrency is a separate contract

An individually safe map does not make a combined map-and-list cache safe. Another worker can observe a key whose node is being removed unless the combined mutation is synchronized. Similarly, a lock-free ring buffer requires careful publication and memory-order rules; ordinary index arithmetic is not a complete concurrent implementation.

## A defensible interview explanation

State the invariant, operation costs, and assumptions before giving code. Then walk through an awkward case, such as duplicate maxima or a successor with a right child. Finally explain why a simpler representation might be preferable at the expected scale. The goal is not to recite every container but to make the chosen one trustworthy under mutation, pressure, and unusual input.`,
      },
    ],
    roadmap: {
      title: "Implement and evaluate core containers",
      description:
        "Progress from storage invariants to workload-driven selection using small executable exercises.",
      estimatedHours: 24,
      steps: [
        {
          title: "Arrays and ownership",
          description:
            "Implement dynamic capacity growth and compare scan costs; explain amortized append and aliasing.",
          hours: 3,
        },
        {
          title: "Lists, stacks, and queues",
          description:
            "Reverse links, validate delimiters, and test a wrapping bounded queue against an array model.",
          hours: 4,
        },
        {
          title: "Hashing and caching",
          description:
            "Handle collisions and build a map-plus-list LRU cache with invariant checks after eviction.",
          hours: 4,
        },
        {
          title: "Trees, heaps, and prefixes",
          description:
            "Trace BST deletion, heapify a batch, and build a small prefix index with memory accounting.",
          hours: 5,
        },
        {
          title: "Graph and range storage",
          description:
            "Represent a sparse graph, implement union-find, and compare interval sums against a Fenwick tree.",
          hours: 4,
        },
        {
          title: "Selection review",
          description:
            "Benchmark two operation mixtures, document assumptions, and defend representation tradeoffs.",
          hours: 4,
        },
      ],
    },
    cheatSheet: {
      title: "Container selection and invariant checklist",
      content: `# Data structures quick reference

| Structure | Main cost | Best fit | Watch out |
| --- | --- | --- | --- |
| Dynamic array | O(1) index; amortized O(1) append | Scans and indexed reads | O(n) middle shifts; resize spikes |
| Linked list | O(1) relink at known node | Stable-node local edits | O(n) locate; pointer overhead |
| Stack / queue | O(1) common operations | Nested work / FIFO work | Empty and bounded-full behavior |
| Hash map | Expected O(1) point operations | Identity lookup | Collisions, load, mutable keys |
| Balanced BST | O(log n) operations | Sorted keys and ranges | Ordinary BST may degenerate |
| Binary heap | O(1) peek; O(log n) push/pop | Priority work and top k | Heap array is not sorted |
| Trie | O(L) key path | Prefix navigation | Child storage overhead |
| Fenwick tree | O(log n) update/prefix sum | Mutable additive totals | Index conversion; aggregate limits |
| Segment tree | O(log n) point/range operations | Associative ranges | Lazy updates need sound composition |

\`\`\`text
Sparse graph: adjacency lists, O(V + E) storage
Dense graph: matrix, O(V^2) storage, O(1) edge test
DSU: union by rank/size + compression; no arbitrary deletion
LRU: key -> list node; most recent at head; evict tail
Window max: deque of indices; expire front; prune dominated back
\`\`\`

Ask before choosing: which operation dominates, are results ordered, must keys be stable, and is the bound worst-case or amortized? Test empty state, duplicates, capacity boundaries, root deletion, and collision chains. Include output size in traversal cost and retained snapshots in memory cost. Concurrency requires a contract across the whole representation, not merely one thread-safe component.`,
    },
    quiz: {
      title: "Representation and mutation decisions",
      questions: [
        mc(
          "Which operation on an ordinary singly linked list is O(1) when its predecessor is already known?",
          [
            "Remove the following node",
            "Find a node by value",
            "Read the middle index",
            "Count all reachable nodes",
          ],
          0,
          "The predecessor supplies the link that must change, so removal needs a constant number of pointer updates rather than a search."
        ),
        mc(
          "What does amortized O(1) append guarantee for geometric array growth?",
          [
            "Every append copies at most one element",
            "Total work over n appends is O(n)",
            "Resizing never occurs",
            "Allocated memory equals size",
          ],
          1,
          "Geometric resizing bounds the sum of copying across the sequence; an individual append can still require linear work."
        ),
        mc(
          "What must equal keys satisfy in a hash map?",
          [
            "They occupy different buckets",
            "They have different identities",
            "They produce equal hashes",
            "They are mutable objects",
          ],
          2,
          "Equal hashes are required for equal keys so lookup reaches the same bucket; collisions between unequal keys remain possible."
        ),
        mc(
          "Which item is at the root of a min-heap retaining the largest k observations?",
          [
            "The largest observation ever",
            "The newest observation",
            "The median retained observation",
            "The smallest retained observation",
          ],
          3,
          "The smallest retained item is the replacement threshold; a larger arriving value can displace it without losing a better candidate."
        ),
        mc(
          "Which structure directly supports efficient prefix enumeration?",
          ["Trie", "Unordered set of whole words", "FIFO queue", "Disjoint-set forest"],
          0,
          "A trie navigates the prefix path and then explores its descendants, whereas whole-key hashing does not index prefix relationships."
        ),
        mc(
          "Which graph representation is usually most space-efficient for a sparse graph?",
          [
            "Full adjacency matrix",
            "Adjacency list",
            "All vertex permutations",
            "Dense matrix of path lengths",
          ],
          1,
          "Adjacency lists store actual edges using O(V+E) space rather than reserving O(V^2) cells for mostly absent edges."
        ),
        mc(
          "Why store indices in a sliding-maximum deque?",
          [
            "To sort the entire input",
            "To avoid comparing values",
            "To identify expired occurrences",
            "To increase the window width",
          ],
          2,
          "Indices record both age and value location, so duplicate values can be expired individually when they leave the window."
        ),
        mc(
          "What is a limitation of ordinary disjoint-set union?",
          [
            "It cannot merge components",
            "It requires sorted labels",
            "It needs quadratic storage",
            "It does not directly support arbitrary edge deletion",
          ],
          3,
          "DSU merges component identities but does not retain enough graph structure to split them when an arbitrary edge disappears."
        ),
      ],
    },
  },
  {
    slug: "algorithms",
    references: [
      {
        title: "DSA and algorithm overview",
        url: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/",
        provider: "GeeksforGeeks",
      },
      {
        title: "Algorithm interview guide",
        url: "https://www.interviewbit.com/algorithm-interview-questions/",
        provider: "InterviewBit",
      },
      {
        title: "Binary search (fetch returned HTTP 403)",
        url: "https://www.w3schools.com/dsa/dsa_algo_binarysearch.php",
        provider: "W3Schools",
      },
    ],
    questions: [
      q(
        "growth-model",
        "Asymptotic growth and input size",
        "How should you compare an O(n log n) algorithm with an O(n^2) algorithm?",
        "Asymptotic notation describes growth as input increases, not an exact runtime ranking for every n. Include constants, input representation, memory access, and preprocessing. A quadratic insertion sort can beat a more elaborate sort on a tiny nearly sorted array. For large unsorted batches, n log n scaling usually matters more. Define n carefully: a graph has both vertices and edges, not just one size.",
        "EASY",
        ["complexity", "analysis"]
      ),
      q(
        "search-boundary",
        "Binary search on a boundary",
        "How do you find the first value at least a target in a sorted array?",
        "Maintain a half-open interval [lo, hi) containing the possible boundary. If a[mid] is below the target, set lo to mid + 1; otherwise set hi to mid. Return lo, which may equal array length. This handles duplicates and missing values without special match cases. The interval strictly shrinks, giving O(log n) comparisons; sortedness and a consistent comparator are required.",
        "MEDIUM",
        ["binary-search", "invariants"]
      ),
      q(
        "answer-search",
        "Searching a feasible answer space",
        "How can binary search solve minimum processing-capacity problems?",
        "Define a monotone feasibility predicate: if capacity c finishes the workload within the deadline, larger capacities must also work. Search between a proven infeasible or minimal boundary and a proven feasible upper bound, using the correct inclusive convention. For integer-speed jobs, sum ceiling divisions and test the deadline. Without monotonicity, such as arbitrary discounts changing completion cost, binary search can skip the true optimum.",
        "HARD",
        ["binary-search", "optimization"]
      ),
      q(
        "sorting-stability",
        "Stable sorting and multi-key ordering",
        "When does sort stability affect a business result?",
        "A stable sort preserves original relative order among equal keys. If records were already ordered by submission time, a stable sort by priority retains submission order within each priority. An unstable sort may reorder ties unpredictably. Alternatively use an explicit composite comparator with a unique final key. Stability can cost auxiliary storage depending on the algorithm; it is not the same as always sorting in place.",
        "EASY",
        ["sorting", "stability"]
      ),
      q(
        "quicksort-risk",
        "Quicksort worst cases",
        "Why can quicksort be fast in practice yet quadratic in the worst case?",
        "Partitioning costs linear time per level. Balanced partitions give logarithmic depth, but repeated splits of zero and n-1 create linear depth and O(n^2) work. Randomized pivots reduce adversarial ordering risk; three-way partitioning helps duplicate-heavy data. Introsort switches strategies when depth grows too far. Recursive stack use is another concern, so recurse on the smaller side or use a managed stack.",
        "MEDIUM",
        ["sorting", "quicksort"]
      ),
      q(
        "merge-inversions",
        "Counting out-of-order pairs",
        "How can merge sort count inversions without checking every pair?",
        "During the merge of sorted halves, if the next right value is smaller than the next left value, it is smaller than every remaining left value. Add the number of remaining left elements and take the right element. Equal values are not inversions under the usual strict definition. This gives O(n log n) time with O(n) merge storage; a wide counter is needed because inversion count can be n(n-1)/2.",
        "MEDIUM",
        ["merge-sort", "counting"]
      ),
      q(
        "two-sum-pointers",
        "Two pointers on sorted input",
        "Why can two pointers find a target pair in a sorted array?",
        "Start at opposite ends. A sum below target cannot be corrected by decreasing the right value, so increase the left pointer; a sum above target requires decreasing the right pointer. Each move discards candidates justified by sorted order, yielding O(n) time. If input is unsorted, sorting costs O(n log n) and changes positions; a hash map can retain original indices with expected O(n) time and extra storage.",
        "EASY",
        ["two-pointers", "arrays"]
      ),
      q(
        "window-negative",
        "Sliding-window assumptions",
        "Why does shrinking while a sum exceeds a target fail with negative numbers?",
        "For nonnegative values, extending a window cannot decrease its sum and removing its first value cannot increase it. Negative values destroy these monotonic relationships, so a discarded start might later form a valid or better interval. For counting exact target sums with arbitrary signed values, track prefix-sum frequencies and look up prefix minus target. The correct structure follows the mathematical property, not the window pattern's popularity.",
        "MEDIUM",
        ["sliding-window", "prefix-sums"]
      ),
      q(
        "prefix-range",
        "Prefix sums and interval conventions",
        "How do prefix sums answer repeated static range-sum queries?",
        "Create p[0] = 0 and p[i+1] = p[i] + a[i]. Then the half-open range [l, r) sums to p[r] - p[l], including empty ranges naturally. Preprocessing is O(n) and each query O(1). A point update invalidates later prefixes, so use a Fenwick tree for many updates. Wider arithmetic may be required even if each individual element fits in a small integer type.",
        "EASY",
        ["prefix-sums", "ranges"]
      ),
      q(
        "greedy-proof",
        "Proving a greedy schedule",
        "Why is earliest finishing time a correct rule for maximizing nonoverlapping intervals?",
        "Choose the interval with the earliest finish among those compatible with the current selection. An optimal solution's first chosen interval can be exchanged for this one without blocking any later interval, because it finishes no later. Repeat the argument on the remaining suffix. Earliest start or shortest duration lacks this guarantee. Specify whether touching endpoints count as compatible and sort by finish time.",
        "MEDIUM",
        ["greedy", "proofs"]
      ),
      q(
        "dp-state",
        "Designing a dynamic-programming state",
        "What makes a DP state sufficient rather than just convenient?",
        "A state must retain all information that affects future choices while forgetting history that does not. In 0/1 knapsack, item position and remaining capacity distinguish available choices; capacity alone during a recursive formulation can accidentally reuse items. Define the state meaning, transition, base cases, and evaluation order before coding. Too much state wastes memory; too little merges histories with different valid futures.",
        "MEDIUM",
        ["dynamic-programming", "modeling"]
      ),
      q(
        "knapsack-order",
        "Loop direction in one-dimensional DP",
        "Why does 0/1 knapsack update capacities downward?",
        "Descending capacity ensures dp[c-weight] still belongs to the previous item stage when computing dp[c]. Ascending capacity can consume a value already updated for the current item and use that item repeatedly, which solves an unbounded variant instead. For weight 2 and capacity 4, a single item must not be counted twice. The optimized representation saves space only when the update order preserves the original recurrence.",
        "HARD",
        ["dynamic-programming", "knapsack"]
      ),
      q(
        "memo-tabulation",
        "Memoization versus tabulation",
        "How do you choose between recursive memoization and iterative tabulation?",
        "Memoization evaluates only reachable states and mirrors a recurrence, which is useful for sparse state spaces. Tabulation chooses an explicit dependency order and avoids recursion depth and call overhead. For a grid with most cells reachable, iterative rows are often simpler and allow rolling storage. Both require correct base cases and a way to distinguish an uncomputed entry from a valid zero result.",
        "MEDIUM",
        ["dynamic-programming", "recursion"]
      ),
      q(
        "bfs-shortest",
        "Shortest paths in unweighted graphs",
        "Why does BFS find the fewest-edge path?",
        "A FIFO queue explores vertices in nondecreasing distance from the source. When an unseen neighbor is first discovered, its distance is the current distance plus one; any shorter route would have come from an earlier layer. Mark on enqueue to avoid duplicate work and retain predecessors to reconstruct a path. The O(V+E) bound assumes adjacency lists. Different edge weights require a different frontier policy.",
        "EASY",
        ["graphs", "bfs"]
      ),
      q(
        "dijkstra-weights",
        "Dijkstra's nonnegative-weight requirement",
        "What fails if a Dijkstra implementation accepts negative edges?",
        "Finalizing the smallest tentative distance relies on later paths never decreasing it through a negative edge. With s->a of weight 2, s->b of weight 5, and b->a of weight -4, a can be finalized at 2 even though its true distance is 1. Use Bellman-Ford when negative edges are allowed and detect reachable negative cycles. In heap-based Dijkstra, skip stale entries and guard distance overflow.",
        "HARD",
        ["graphs", "shortest-paths"]
      ),
      q(
        "topological-cycles",
        "Topological ordering and cycle detection",
        "How does Kahn's algorithm reveal a dependency cycle?",
        "Compute indegrees, enqueue all zero-indegree vertices, and remove them while reducing outgoing neighbors' indegrees. A DAG eventually releases every vertex. If fewer than V vertices are processed, remaining dependencies contain a cycle. Multiple zero-indegree choices can produce different valid orders; use a priority queue only if deterministic tie-breaking is required. Include disconnected components rather than starting from a single source.",
        "MEDIUM",
        ["graphs", "topological-sort"]
      ),
      q(
        "backtracking-pruning",
        "Safe pruning in search",
        "When may a backtracking solver discard a partial assignment?",
        "Prune only when a proven condition shows no completion can satisfy constraints or beat the current best. In a placement puzzle, two already placed pieces attacking each other cannot be repaired by adding more pieces, so that branch is impossible. A heuristic score alone is not a proof of impossibility. Undo each mutation before trying the next branch, and separate exact pruning from optional search-order heuristics.",
        "MEDIUM",
        ["backtracking", "constraints"]
      ),
      q(
        "kmp-border",
        "Reusing work in string matching",
        "What information does KMP retain after a character mismatch?",
        "The prefix-function records the longest proper prefix that is also a suffix of a matched pattern prefix. On mismatch, this border identifies how much matched text can still serve as the start of a new match, avoiding re-reading earlier text. For pattern abab, the matched suffix ab can be reused. Construction and scanning take O(m+n); define code-unit versus Unicode-character semantics before claiming character positions.",
        "HARD",
        ["strings", "kmp"]
      ),
      q(
        "quickselect",
        "Selection without full sorting",
        "How does quickselect find an order statistic, and what are its risks?",
        "Partition around a pivot and continue only in the partition containing the desired rank. Unlike quicksort, it need not process both partitions. Randomized pivots give expected O(n) time but worst-case O(n^2); deterministic median-of-medians gives a linear worst-case bound with larger constants. For duplicate-heavy values, a three-way partition identifies an equal region directly. Document whether rank is zero-based and whether input is mutated.",
        "HARD",
        ["selection", "partitioning"]
      ),
      q(
        "algorithm-verification",
        "Testing optimized algorithms",
        "How can you test an algorithm whose expected answer is difficult to compute?",
        "Build a slow, obvious oracle for tiny inputs, such as enumerating all subsets for a small knapsack, and compare it with the optimized method across many generated cases. Add properties: sorting preserves the multiset, path cost equals the sum of reported edges, and a range query on an empty range is zero. This catches recurrence and boundary errors without claiming random tests replace a correctness proof.",
        "MEDIUM",
        ["testing", "correctness"]
      ),
    ],
    notes: [
      {
        key: "algorithm-foundations",
        title: "From specification to a correctness argument",
        excerpt:
          "Make assumptions explicit, define state, and separate correctness from efficiency.",
        content: `# Begin with the contract

Before naming an algorithm, define inputs, outputs, and invalid cases. A shortest-path request must say whether edges are weighted, whether weights can be negative, and what to return for unreachable vertices. A sorting request should identify the comparator, stability requirements, and whether mutation is allowed. These details often determine the algorithm more strongly than the size of the input.

## Establish a baseline

Write down a simple method whose correctness is easy to inspect. Enumerating every pair for a target sum takes quadratic time but is a useful oracle for small arrays. Enumerating every subset gives a reference answer for tiny knapsack instances. A baseline provides a comparison target while you optimize; it is not necessarily the production implementation.

## Use an invariant

An invariant describes what remains true before and after each iteration. For lower-bound binary search, the candidate boundary remains inside a half-open interval and all discarded positions have been ruled out. The midpoint decision removes a nonempty part of the interval, which also establishes termination.

\`\`\`text
lo = 0
hi = length
while lo < hi:
  mid = lo + floor((hi - lo) / 2)
  if values[mid] < target:
    lo = mid + 1
  else:
    hi = mid
return lo
\`\`\`

This formulation returns length when every value is below target. That is a valid boundary result, not an out-of-bounds element to read immediately.

## Recognize the proof style

Greedy algorithms usually need an exchange or dominance argument. Earliest-finish interval scheduling works because replacing an optimal first interval with one that finishes earlier leaves all later choices available. Dynamic programming needs a sufficient state and a recurrence whose subproblems cover the possibilities. Graph search needs an argument about frontier order: BFS layers for unit weights, minimum tentative distance for nonnegative weights.

## Analyze the resources

Count total work, not only nested loop syntax. Two pointers that each advance at most n times can share a loop and still perform linear work. A recursive search may have exponential branches even if every call is short. Include auxiliary arrays, recursion stacks, and result storage. Use both V and E when graph size depends on vertices and edges.

## Finish with assumptions and a counterexample

Every explanation should state what would invalidate the method. Negative numbers invalidate certain sum-window rules; negative edges invalidate ordinary Dijkstra finalization. A counterexample reveals the role of an assumption more clearly than a slogan. Then explain the fallback algorithm and its cost so the solution remains useful when requirements change.`,
      },
      {
        key: "algorithm-exercises",
        title: "Exercises that connect patterns to evidence",
        excerpt:
          "Implement search, scheduling, DP, and graph routines against small reference models.",
        content: `# A compact algorithm workshop

Use short inputs that can be checked manually, then automate comparisons against a baseline. Record the specification next to each routine, especially tie rules and interval boundaries. Keep random seeds reproducible so a failing input can be investigated rather than lost.

## Search and ordering

Implement lower bound for an array containing repeated values. Test targets below every item, between items, equal to repeated items, and above every item. Assert that all positions before the answer are below the target and every position from the answer onward is at least the target.

Next, stable-sort labeled jobs by priority after ordering them by submission time. Verify the relative order of tied priorities. Compare that with a composite comparator using priority, time, and unique ID. The latter makes deterministic ordering independent of input arrival order.

## Scheduling and dynamic programming

For interval scheduling, enumerate all compatible subsets of at most eight intervals. Compare the maximum count with earliest-finish greedy selection. Include touching endpoints and explicitly define compatibility as \`previous.finish <= next.start\` if touching is allowed.

For 0/1 knapsack, use three items with different weights and enumerate subsets. Then implement a one-dimensional DP with descending capacities. Deliberately try ascending capacities and observe the counterexample where one item is used twice. Explain why the storage optimization changes dependencies.

\`\`\`text
for each item (weight, value):
  for capacity from limit down to weight:
    best[capacity] =
      max(best[capacity], best[capacity - weight] + value)
\`\`\`

## Graph laboratory

Create a directed graph with two disconnected components. BFS should assign distances only to reachable vertices from its source. A topological sorter must include both components. Add one back edge to create a cycle and check that the processed-vertex count falls below the total.

For weighted paths, compare Dijkstra with a small Bellman-Ford implementation on nonnegative graphs. Add a negative edge to demonstrate why the nonnegative assumption matters; do not treat agreement on some negative-edge examples as proof of safety. Verify each returned predecessor chain terminates at the source and its summed weight matches the reported distance.

## Search optimization

Implement an exact small constraint solver. Count visited states with and without a proven pruning rule. Keep candidate ordering separate from pruning: trying promising choices first can help find a bound earlier, but it does not itself justify discarding alternatives.

## Completion criteria

A solution is ready when its oracle comparisons pass, boundary cases are covered, and the complexity explanation matches actual operations. Measure only after correctness. If an optimized method mutates input, clone it before passing the same data to the reference method. Otherwise the test can accidentally compare two routines on different problems.`,
      },
      {
        key: "algorithm-pitfalls",
        title: "Common proofs that silently stop applying",
        excerpt:
          "Spot broken monotonicity, insufficient state, overflow, and misleading benchmarks.",
        content: `# Patterns are conditional tools

Many algorithm bugs come from applying a familiar pattern after its assumptions have changed. A sum window that works on nonnegative numbers is not automatically valid on signed data. A minimum-priority frontier is not sufficient for shortest paths with negative edges. First ask which mathematical property allowed work to be discarded.

## Boundary and arithmetic errors

Half-open intervals reduce ambiguity, but mixing them with inclusive endpoints creates skipped values or infinite loops. Compute midpoints without adding two potentially large bounds in fixed-width arithmetic. Distances, prefix sums, and inversion counts may exceed the element type's range. In languages with limited exact integer precision, choose appropriate numeric representations for the required scale.

\`\`\`text
Review:
Can the empty input reach a valid base case?
Does each iteration strictly shrink the search region?
Are repeated values handled by the comparator and partition?
Can a sentinel value be mistaken for a real answer?
\`\`\`

## Dynamic-programming contamination

Rolling storage reuses memory across stages. Updating in the wrong direction can read values from the current stage when the recurrence requires the previous one. A zero-filled table also cannot distinguish impossible states from valid zero-valued solutions unless the state definition permits that initialization. For exact-weight problems, use an explicit unreachable marker and guard arithmetic involving it.

## Traversal and state mistakes

Mark BFS nodes when enqueueing, not only when removing them, to avoid repeated frontier entries. In heap-based Dijkstra, a node may have several queued distances; ignore stale entries. A topological traversal that starts at one vertex misses disconnected components. Backtracking must undo all state changes, including auxiliary counters and occupied-position sets.

## Misleading performance claims

Expected linear quickselect is not a worst-case guarantee. An output-sensitive algorithm must pay for every result it returns. Memoization saves repeated work only if keys fully identify states; caching by an incomplete key can be fast and wrong. A benchmark on already sorted tiny arrays does not establish the behavior on large duplicate-heavy or adversarial input.

## Preserve semantic details

Sorting may lose original indices. Unicode text may contain multiple code units per visible character. Graphs may contain parallel edges or self-loops. A target pair may require distinct positions even when values are equal. Carry these requirements into tests rather than hiding them in implementation assumptions.

## A final review sequence

Read the specification, construct one counterexample to each unsafe assumption, inspect the invariant, and compare with a small oracle. Then examine recursion depth, retained memory, and integer limits. This sequence makes optimization a controlled change to a known-correct method instead of a collection of memorized templates.`,
      },
    ],
    roadmap: {
      title: "Solve with proofs and executable checks",
      description:
        "Develop pattern recognition only after understanding invariants and input assumptions.",
      estimatedHours: 30,
      steps: [
        {
          title: "Contracts and analysis",
          description:
            "Define five problem contracts, write baseline solutions, and count time and auxiliary space.",
          hours: 3,
        },
        {
          title: "Search and sorting",
          description:
            "Implement lower bound, merge inversion counting, and partitioning with duplicate tests.",
          hours: 5,
        },
        {
          title: "Linear scan patterns",
          description:
            "Solve pair and range problems; contrast nonnegative windows with signed prefix-sum methods.",
          hours: 4,
        },
        {
          title: "Greedy and DP",
          description: "Prove interval scheduling and compare knapsack DP with subset enumeration.",
          hours: 7,
        },
        {
          title: "Graphs and strings",
          description:
            "Implement BFS, topological sorting, nonnegative Dijkstra, and a prefix-function matcher.",
          hours: 7,
        },
        {
          title: "Verification clinic",
          description:
            "Use small oracles, shrink failing cases, and document assumptions plus fallback methods.",
          hours: 4,
        },
      ],
    },
    cheatSheet: {
      title: "Algorithm patterns and their preconditions",
      content: `# Algorithms quick reference

| Pattern | Required property | Typical cost |
| --- | --- | --- |
| Binary search | Sorted values or monotone predicate | O(log n) predicate calls |
| Two pointers | Moves discard candidates safely | Often O(n) after sorting |
| Sum window | Usually nonnegative values | O(n) when both boundaries advance |
| Prefix sums | Static additive ranges | O(n) build, O(1) query |
| Greedy scheduling | Earliest-finish exchange proof | O(n log n) including sort |
| DP | Sufficient state and acyclic dependencies | States times transition cost |
| BFS | Unit-weight edges | O(V+E) with lists |
| Dijkstra | Nonnegative weights | O((V+E) log V) with a suitable heap |
| Topological sort | Directed acyclic dependencies | O(V+E); detect incomplete processing |
| KMP | Reusable prefix/suffix borders | O(text + pattern) |

\`\`\`text
Lower bound: first index with value >= target, or n
0/1 knapsack: capacities descend
Unbounded knapsack: capacities may ascend for item reuse
Quickselect: expected O(n), quadratic worst case
Merge inversions: add remaining-left count on strict right win
\`\`\`

State the invariant before code. For a greedy rule, show why an optimal solution can adopt the choice. For DP, define exactly what each cell means and how unreachable states are represented. For graphs, distinguish reachable vertices from all vertices and account for parallel edges if permitted. Validate empty inputs, duplicates, signed values, unreachable goals, overflow, and mutation. A slow small-input oracle is often the fastest way to find a wrong optimization.`,
    },
    quiz: {
      title: "Algorithm assumptions and correctness",
      questions: [
        mc(
          "What permits binary search over an answer space?",
          [
            "A monotone feasibility predicate",
            "A recursive implementation",
            "A constant-time predicate",
            "A sorted output array",
          ],
          0,
          "The predicate must divide the range into infeasible and feasible portions so each test can safely discard one side."
        ),
        mc(
          "Why do 0/1 knapsack capacities usually iterate downward?",
          [
            "To sort item weights",
            "To avoid reusing the current item",
            "To reduce the value of every item",
            "To enumerate permutations",
          ],
          1,
          "Descending updates read the previous item stage at lower capacities instead of a value already incorporating the current item."
        ),
        mc(
          "Which graph admits ordinary BFS as a shortest-path algorithm?",
          [
            "A graph with arbitrary negative weights",
            "Any graph with a priority queue",
            "A graph where every edge has unit weight",
            "Only a complete graph",
          ],
          2,
          "With unit weights, distance equals edge count and FIFO exploration visits increasing distance layers."
        ),
        mc(
          "What does stable sorting preserve?",
          [
            "Array memory addresses",
            "All input positions",
            "Distinct-key order only",
            "Relative order of equal-key records",
          ],
          3,
          "Stability concerns ties under the comparator; records with different keys still move to satisfy the requested ordering."
        ),
        mc(
          "Which input change invalidates many sum-window shrink rules?",
          [
            "Allowing negative values",
            "Using a longer array",
            "Repeating a positive value",
            "Using zero-based indices",
          ],
          0,
          "Negative values break the monotonic effect of extending or shrinking a sum window, so previously discarded starts may matter."
        ),
        mc(
          "What does an incomplete Kahn traversal indicate after all zero-indegree work is exhausted?",
          [
            "Every vertex is isolated",
            "The directed graph contains a cycle",
            "The graph is necessarily disconnected",
            "Edge weights are negative",
          ],
          1,
          "Vertices left unprocessed have dependencies that cannot be released, which implies a directed cycle in the remaining graph."
        ),
        mc(
          "Which is a valid small-input oracle for 0/1 knapsack?",
          [
            "Always take the most valuable item",
            "Sort by value-to-weight ratio",
            "Enumerate every subset and check capacity",
            "Allow unlimited copies of each item",
          ],
          2,
          "Subset enumeration considers every legal take-or-skip combination, providing an exact answer for small instances despite exponential cost."
        ),
        mc(
          "What is randomized quickselect's usual runtime guarantee?",
          [
            "Worst-case O(log n)",
            "Worst-case O(n)",
            "Expected O(n log n)",
            "Expected O(n), worst-case O(n^2)",
          ],
          3,
          "Random pivots give good average partition progress, but repeated extreme pivots can still leave nearly the entire array each time."
        ),
      ],
    },
  },
  {
    slug: "object-oriented-programming",
    references: [
      {
        title: "OOP concepts in Java",
        url: "https://www.geeksforgeeks.org/java/object-oriented-programming-oops-concept-in-java/",
        provider: "GeeksforGeeks",
      },
      {
        title: "OOP interview guide",
        url: "https://www.interviewbit.com/oops-interview-questions/",
        provider: "InterviewBit",
      },
      {
        title: "Java OOP (fetch returned HTTP 403)",
        url: "https://www.w3schools.com/java/java_oop.asp",
        provider: "W3Schools",
      },
    ],
    questions: [
      q(
        "class-object",
        "Class, object, and identity",
        "How does a class differ from an object, and why distinguish identity from value?",
        "A class defines a type's structure and behavior; an object is a particular runtime instance with state and identity. Two Money objects may have equal currency and amount while being different instances. Two account entities with similar fields may still represent different accounts because their IDs differ. Equality should follow domain meaning rather than automatically comparing references or every mutable field.",
        "EASY",
        ["classes", "identity"]
      ),
      q(
        "encapsulation-invariants",
        "Encapsulation beyond private fields",
        "Why are private fields with unrestricted setters not strong encapsulation?",
        "Encapsulation protects a representation and the rules governing valid transitions. A private balance with setBalance(anyNumber) still permits invalid states. A debit operation can validate a positive amount, enforce available funds, and update state atomically at the appropriate boundary. Returning a mutable internal collection also leaks control. Expose intentional behavior and snapshots rather than merely hiding field names.",
        "EASY",
        ["encapsulation", "invariants"]
      ),
      q(
        "abstraction-boundary",
        "Choosing an abstraction",
        "What should a payment abstraction promise to its clients?",
        "A useful abstraction exposes operations and their observable contract while hiding provider-specific mechanics. A PaymentGateway might accept an amount and idempotency key and return a typed outcome, rather than exposing one provider's HTTP payload. Define timeouts, retry safety, and failure categories as part of the contract. An abstraction that leaks provider details is harder to replace, while an overly broad interface forces irrelevant methods.",
        "MEDIUM",
        ["abstraction", "interfaces"]
      ),
      q(
        "overload-override",
        "Overloading versus overriding",
        "Compare overloading and overriding using a statically typed language.",
        "Overloading provides multiple methods with the same name but different parameter lists, with selection generally based on compile-time types. Overriding replaces an inherited instance method's implementation and supports runtime dispatch through a base reference. A Printer may overload print(String) and print(int), while a PdfPrinter overrides render(Document). Return type alone usually cannot distinguish overloads; exact rules depend on the language.",
        "EASY",
        ["polymorphism", "dispatch"]
      ),
      q(
        "runtime-dispatch",
        "Dynamic dispatch",
        "Why can a base-typed reference invoke subclass behavior?",
        "The reference's static type limits which operations the compiler accepts, while the runtime object's type selects an overridden virtual instance method. A Shape reference holding a Circle can invoke Circle.area without knowing its concrete class. Static methods and nonvirtual operations follow different dispatch rules. This separation enables extensible clients, but calling overridable methods during construction can expose incompletely initialized subclass state.",
        "MEDIUM",
        ["polymorphism", "inheritance"]
      ),
      q(
        "composition-preference",
        "Composition versus inheritance",
        "A report needs different export formats and delivery channels. How would you avoid a subclass explosion?",
        "Compose a Report with an Exporter and a DeliveryChannel instead of creating a subclass for every format-channel combination. Independent variation then needs a small set of collaborators rather than a Cartesian product of subclasses. Inheritance remains useful for a genuine substitutable type relationship with a stable shared contract. Composition adds delegation, but makes runtime configuration and isolated testing easier.",
        "MEDIUM",
        ["composition", "design"]
      ),
      q(
        "liskov-contract",
        "Behavioral substitutability",
        "Why is a subtype that throws for a supported base operation problematic?",
        "Clients rely on the base contract, including valid inputs and observable guarantees. A subtype must not strengthen preconditions or weaken promised results. If a WritableStore accepts save, a ReadOnlyStore subtype that always rejects save cannot transparently replace it. Separate readable and writable capabilities instead. Merely matching method signatures is insufficient because substitutability is behavioral, not just syntactic.",
        "HARD",
        ["solid", "liskov"]
      ),
      q(
        "interface-abstract",
        "Interface versus abstract class",
        "When would you use an interface rather than an abstract base class?",
        "An interface expresses a capability shared by otherwise unrelated implementations, such as Clock.now for a system clock and a test clock. An abstract class can share state and implementation among a coherent family but creates a tighter inheritance relationship. Some languages allow interface default methods, so the distinction is not simply 'code versus no code.' Prefer the smallest contract needed by clients and avoid shared mutable base state without a clear purpose.",
        "MEDIUM",
        ["interfaces", "abstract-classes"]
      ),
      q(
        "constructors-validity",
        "Construction and valid state",
        "How should object creation handle mandatory invariants?",
        "Require essential values at construction or through a validating factory so a successful creation yields a usable object. An EmailAddress factory can reject malformed input instead of creating an instance that fails later in unrelated methods. Builders help when many optional fields exist, but their final build must validate cross-field rules. Avoid publishing this before initialization completes or performing overridable callbacks in a constructor.",
        "MEDIUM",
        ["constructors", "validation"]
      ),
      q(
        "immutable-objects",
        "Deep versus shallow immutability",
        "Is an object immutable if all its fields are read-only references?",
        "Read-only references prevent reassignment but may still point to mutable arrays, maps, or child objects. Deep immutability requires preventing observable mutation through those reachable values, often using immutable collections or defensive copies. An immutable OrderSummary that exposes its internal mutable line array is not truly immutable. Copying costs memory and time, so choose ownership and snapshot boundaries intentionally.",
        "MEDIUM",
        ["immutability", "ownership"]
      ),
      q(
        "entity-value",
        "Entities and value objects",
        "How would you model a customer and a postal address differently?",
        "A customer is usually an entity identified across state changes by a stable ID. A postal address is often a value object whose equality follows its normalized fields and whose changes create a new value. Two customers sharing an address remain distinct; two equal addresses need not have separate domain identities. This distinction affects persistence keys, equality, mutation, and whether deduplication is semantically safe.",
        "MEDIUM",
        ["domain-modeling", "equality"]
      ),
      q(
        "single-responsibility",
        "Responsibility as a reason to change",
        "Why split invoice calculation, storage, and rendering?",
        "These behaviors change for different reasons: tax policy, database layout, and presentation requirements. Keeping them in separate collaborators reduces the chance that a formatting change affects calculation or persistence tests. Single responsibility does not mean every class has one method; it means related behavior serves a coherent concern. Over-splitting tiny operations can create navigation overhead without meaningful isolation.",
        "MEDIUM",
        ["solid", "cohesion"]
      ),
      q(
        "open-closed",
        "Extending a pricing policy",
        "How can new pricing rules be added without repeatedly editing a large conditional?",
        "Define a PricingPolicy contract and implement specific rules behind it, then select policies through composition or a registry at a controlled boundary. Existing calculation clients depend on the contract rather than enumerating every concrete policy. This supports extension without making all code permanently unchangeable. For two stable cases, a simple conditional may be clearer than a large plugin framework.",
        "MEDIUM",
        ["solid", "strategy"]
      ),
      q(
        "interface-segregation",
        "Client-specific capabilities",
        "Why might a single interface for every printer feature be harmful?",
        "A basic printer should not implement scan or fax methods that only fail. Split PrintCapability, ScanCapability, and FaxCapability so clients depend only on what they use. A multifunction device can implement several capabilities. This prevents unsupported operations from leaking into client code and improves test doubles. Do not split interfaces mechanically per method if a group of operations genuinely forms one coherent contract.",
        "MEDIUM",
        ["solid", "interfaces"]
      ),
      q(
        "dependency-inversion",
        "Dependency inversion and injection",
        "How does a service avoid depending directly on an external email vendor?",
        "Make the service depend on an EmailSender interface and supply a concrete vendor adapter at the composition root. Dependency inversion concerns the direction toward an abstraction; dependency injection is one technique for supplying the implementation. A test can inject a recording sender without network calls. Keep the abstraction owned by the application's needs, rather than reproducing every vendor-specific parameter.",
        "MEDIUM",
        ["solid", "dependency-injection"]
      ),
      q(
        "strategy-state",
        "Strategy versus State",
        "Both patterns delegate behavior. What distinguishes Strategy from State?",
        "Strategy represents an interchangeable algorithm, often selected by a client, such as a compression policy. State represents behavior that changes with an object's lifecycle, such as an order moving from pending to paid to shipped, and may govern legal transitions. Their mechanics can look similar, but their intent and ownership of changes differ. Use explicit transition rules rather than allowing arbitrary state replacement that bypasses invariants.",
        "HARD",
        ["patterns", "state", "strategy"]
      ),
      q(
        "observer-lifecycle",
        "Observer coupling and lifecycle",
        "What risks arise when publishing events to observers?",
        "Observers decouple a publisher from concrete consumers, but subscriptions retain references and delivery semantics can surprise clients. A slow synchronous observer may block publishing; an asynchronous observer may see events later or out of order. Define unsubscribe ownership, exception handling, and whether duplicates are possible. For an inventory event, consumers should not assume a callback is exactly-once durable delivery unless an infrastructure contract guarantees it.",
        "HARD",
        ["patterns", "events"]
      ),
      q(
        "factory-builder",
        "Factory versus Builder",
        "When does a builder offer more than a factory method?",
        "A factory centralizes creation and can choose a concrete implementation or validate a compact set of inputs. A builder supports staged configuration when many optional or interdependent fields would make constructors confusing. For a connection configuration, named builder methods clarify timeout and retry settings. The final build still validates the whole configuration; otherwise the builder only postpones invalid-state creation.",
        "MEDIUM",
        ["patterns", "construction"]
      ),
      q(
        "diamond-language",
        "Multiple inheritance and ambiguity",
        "How should you reason about two inherited implementations of the same operation?",
        "Multiple inheritance rules are language-specific. Java allows multiple interfaces but not multiple class inheritance, and conflicting default methods may require an explicit override. C++ can inherit multiple classes and may need qualification or virtual inheritance for shared-base scenarios. The design question is which contract and state are intended, not just how to silence ambiguity. Composition often expresses independent capabilities more clearly.",
        "HARD",
        ["inheritance", "language-semantics"]
      ),
      q(
        "testing-contracts",
        "Testing through a contract",
        "How do you ensure several repository implementations are substitutable?",
        "Run a shared contract suite against each implementation: missing-key behavior, ordering, duplicate handling, and failure semantics should agree with the interface specification. Unit-test service logic with a controlled fake, but also test the real adapter because a fake can accidentally model a different contract. Avoid assertions tied to private fields; test externally meaningful behavior while separately checking resource cleanup at boundaries.",
        "HARD",
        ["testing", "contracts"]
      ),
    ],
    notes: [
      {
        key: "oop-foundations",
        title: "Objects as owners of valid behavior",
        excerpt:
          "Connect identity, encapsulation, contracts, and substitutability to domain decisions.",
        content: `# Model responsibilities, not just nouns

Object-oriented design combines state with behavior under explicit contracts. A class is not automatically well designed because its fields are private. The important question is whether clients can force it into an invalid state or must use meaningful transitions. An account that accepts arbitrary balance replacement has weak protection even when the balance field is hidden.

## Identity and value

An entity persists conceptually through changes: a customer's name can change while its customer ID remains the same. A value object is defined by its content: an amount and currency can be compared as a value and replaced rather than edited. Use these meanings when designing equality and hash behavior. Hash keys should not depend on fields that change while the key is stored.

## Encapsulation and abstraction

Encapsulation owns the representation and preserves invariants. Abstraction exposes the operations clients need while hiding irrelevant details. A reservation should expose confirm or cancel with documented preconditions, not a collection of setters that lets callers jump between impossible combinations of flags.

\`\`\`text
Reservation contract:
  create: start in PENDING with a valid resource and time range
  confirm: permitted only from PENDING
  cancel: record a terminal cancellation with its reason
  snapshot: expose values without leaking mutable internals
\`\`\`

This contract can be implemented with classes, records plus functions, or other language constructs. The design quality comes from the boundary and guarantees, not from syntax alone.

## Polymorphism

A client using a PricingPolicy contract should not need to inspect each concrete class. Runtime dispatch selects behavior while the static contract determines available operations. Overloading is different: in many statically typed languages, the chosen parameter signature follows compile-time types. Be precise about the language when discussing virtual methods, static methods, and interface defaults.

## Substitutability and composition

Inheritance should preserve the base type's expectations. A subtype that accepts fewer valid inputs or rejects a promised operation breaks clients even if it compiles. Separate capabilities when some implementations cannot support an operation. Composition is often preferable when independent axes vary, such as output format and delivery channel.

## Boundaries for change

Calculation, persistence, and presentation usually respond to different reasons for change. Keep each concern cohesive and connect them through small contracts. A service can depend on a Clock or EmailSender chosen at startup, making tests deterministic without embedding vendor calls in domain logic.

Avoid turning every statement into a class. A stateless calculation may be a simple function. Add abstractions where they clarify a stable boundary, preserve invariants, or isolate a real variation. Explain the tradeoff: more interfaces can improve substitutability but also add indirection and maintenance work.`,
      },
      {
        key: "oop-design-lab",
        title: "Design a reservation workflow",
        excerpt:
          "Practice value objects, explicit transitions, adapters, and contract tests without external services.",
        content: `# A small reservation domain

Design an in-memory reservation workflow for meeting rooms. Each reservation has an identity, room ID, start and end instants, and lifecycle status. Treat a time range as a value object: start must precede end, and equality compares the two instants. A reservation is an entity because status changes do not create a different logical reservation.

## Step 1: creation and transitions

Require mandatory values at construction or a validating factory. Reject an empty room ID and a reversed time range. Expose confirm and cancel rather than a public status setter. Decide whether cancellation after confirmation is legal and how repeated cancellation behaves; these are domain choices that must be documented and tested.

\`\`\`text
PENDING -> CONFIRMED
PENDING -> CANCELLED
CONFIRMED -> CANCELLED  (if policy permits)
CANCELLED -> no further transition
\`\`\`

Do not assume this small object's methods solve concurrent double booking. Preventing overlap across reservations belongs at the repository or transaction boundary, where the complete set of competing reservations is visible.

## Step 2: isolate policy and infrastructure

Use a BookingPolicy for business eligibility and a ReservationRepository for storage. A NotificationSender accepts an application-level notification, not one vendor's raw payload. Inject a Clock if deadlines depend on the current time. The application service coordinates these collaborators; rendering a confirmation page belongs outside the domain.

## Step 3: preserve ownership

Return a snapshot or immutable view rather than a mutable list of internal attendees. Mutating a returned array should not silently alter the reservation. Decide whether to copy nested values or make them immutable. Demonstrate the difference between a read-only reference and a deeply immutable object in your chosen language.

## Step 4: exercise polymorphism

Implement a recording notification sender and a second sender that simulates a typed failure. The service should react through the shared outcome contract, without checking concrete class names. If a retry is allowed, specify an idempotency key so the sender boundary can avoid duplicate effects where supported.

## Step 5: tests that reveal design

Test successful construction, invalid ranges, forbidden transitions, and repeated operations. Run the repository contract suite against each in-memory variant: missing IDs, duplicate insertion, and snapshot ownership should have the same meaning. Test notification failures without real network calls.

## Step 6: review the abstractions

Add one new booking policy without rewriting the service's decision logic. Add a new delivery implementation without editing the reservation entity. If every change still touches many classes, inspect whether the interface exposes the wrong level of detail. Conversely, remove abstractions that exist only to wrap a single expression with no meaningful boundary. The finished exercise should show where state is protected, where effects occur, and which behavior can vary independently.`,
      },
      {
        key: "oop-pitfalls",
        title: "When class structure hides a weak contract",
        excerpt:
          "Avoid leaked mutation, brittle inheritance, oversized interfaces, and test-double drift.",
        content: `# Review behavior before hierarchy

A tall inheritance tree can look organized while making small changes dangerous. Shared mutable base state and protected fields let subclasses depend on implementation details that were never part of a public contract. Prefer a stable capability boundary and composition when behavior varies independently.

## Construction hazards

An overridable method called by a base constructor may dispatch to subclass behavior before subclass fields are initialized. Publishing the new object to a registry during construction creates a similar escape. Establish essential state before exposing the instance, and avoid effectful callbacks from constructors. Factories can perform setup explicitly and return only fully valid objects.

## Encapsulation leaks

Private collections are not protected if a getter returns the mutable collection itself. A shallow copy protects the collection container but not mutable elements. Use immutable values, deep copies where justified, or carefully scoped views. For money and dates, choose representations that preserve exact domain semantics rather than convenient but ambiguous primitives.

\`\`\`text
Weak boundary: setStatus(anyStatus), setStart(anyTime), getMutableItems()
Stronger boundary: reschedule(validRange), cancel(reason), itemsSnapshot()
\`\`\`

The stronger names do not guarantee correctness by themselves; their implementations and documented preconditions must enforce the rules.

## Misapplied principles

Single responsibility is not a one-method limit. Open-closed design does not forbid maintenance or bug fixes. Dependency injection does not require a container framework; constructor parameters are often enough. Interface segregation does not demand a separate interface for every line of code. These ideas guide boundaries where actual changes occur.

## Inheritance traps

A subtype that throws for normal base operations is usually modeling the wrong capability. A mutable Rectangle/Square hierarchy can violate setters' expected independence, even though the mathematical relationship sounds natural. Model immutable dimensions or separate shape interfaces rather than forcing a behavioral relationship from a vocabulary relationship.

## Effects, errors, and observers

A notification callback may fail or take time. Define whether publisher success includes observer success, whether delivery is synchronous, and who removes subscriptions. Long-lived event publishers can retain short-lived observers and cause leaks. An event object should carry immutable facts rather than a mutable entity that changes before consumers inspect it.

## Testing without fictional guarantees

A fake repository may be more permissive than the real one about ordering, duplicates, or transactional behavior. Shared contract tests reduce that drift but do not replace adapter integration tests. Assert public outcomes and failure categories, not incidental method-call order unless ordering is itself part of the contract.

Finish by asking whether a new implementation could satisfy every valid client expectation. If not, clarify the contract or split the capability before adding another subclass.`,
      },
    ],
    roadmap: {
      title: "Design and test behavioral contracts",
      description:
        "Build a small domain with valid state, interchangeable collaborators, and explicit effects.",
      estimatedHours: 22,
      steps: [
        {
          title: "Identity and value",
          description:
            "Model entities and immutable value objects; test equality and ownership decisions.",
          hours: 3,
        },
        {
          title: "Invariants and creation",
          description:
            "Implement validated creation and lifecycle operations instead of unrestricted setters.",
          hours: 4,
        },
        {
          title: "Dispatch and capabilities",
          description:
            "Trace overload and override behavior; split unsupported operations into coherent interfaces.",
          hours: 3,
        },
        {
          title: "Composition and dependencies",
          description:
            "Inject policy, clock, repository, and notification adapters into a reservation service.",
          hours: 4,
        },
        {
          title: "Pattern exercises",
          description:
            "Compare Strategy with State and Factory with Builder using concrete domain changes.",
          hours: 4,
        },
        {
          title: "Contract review",
          description:
            "Run shared behavioral tests and examine inheritance, mutation leaks, and error semantics.",
          hours: 4,
        },
      ],
    },
    cheatSheet: {
      title: "OOP contracts and design principles",
      content: `# Object-oriented design quick reference

| Concept | Working meaning | Example |
| --- | --- | --- |
| Encapsulation | Own representation and preserve invariants | debit validates available funds |
| Abstraction | Expose relevant behavior, hide mechanics | PaymentGateway hides vendor payload |
| Polymorphism | Use a contract across implementations | Clock supplied by system or test |
| Entity | Identity persists through changes | Customer with stable ID |
| Value object | Equality follows content | Amount plus currency |
| Composition | Collaborators vary independently | Exporter plus DeliveryChannel |

SOLID review:
- SRP: coherent responsibility and reason to change, not one method.
- OCP: isolate expected variation behind a contract, not permanent immutability of code.
- LSP: preserve valid inputs and promised behavior in every subtype.
- ISP: clients should not depend on unsupported capabilities.
- DIP: high-level policy depends on application-relevant abstractions.

\`\`\`text
Overload: choose among parameter signatures, often at compile time
Override: runtime object selects inherited virtual behavior
Strategy: interchangeable algorithm
State: lifecycle-specific behavior and legal transitions
Factory: centralize valid creation or implementation choice
Builder: staged configuration, validated at final build
\`\`\`

Check for leaked mutable collections, unstable hash keys, constructor callbacks, and shared mutable base fields. Define observer delivery and unsubscribe ownership. Inject external effects at a composition root; do not fake exactly-once guarantees. Prefer functions for simple stateless work and add interfaces where a real contract or variation exists.`,
    },
    quiz: {
      title: "Behavioral design choices",
      questions: [
        mc(
          "Which operation best encapsulates a bank account invariant?",
          [
            "debit a validated positive amount",
            "set the balance to any number",
            "return a mutable balance history",
            "expose the balance field publicly",
          ],
          0,
          "An intentional debit operation can enforce the account's rules; hiding a field while allowing unrestricted replacement does not."
        ),
        mc(
          "Which equality rule usually fits a value object?",
          [
            "Always compare memory addresses",
            "Compare its meaningful content",
            "Compare its creation timestamp only",
            "Treat every instance as unique",
          ],
          1,
          "Value objects represent values rather than lifecycle identity, so equivalent normalized fields should normally compare equal."
        ),
        mc(
          "Which mechanism selects an overridden virtual method through a base reference?",
          [
            "Constructor overloading",
            "Static field lookup",
            "Runtime dispatch",
            "Source-file ordering",
          ],
          2,
          "The reference exposes the base contract, while the runtime object's concrete type supplies the overridden implementation."
        ),
        mc(
          "Which design avoids subclasses for every export-format and delivery-channel combination?",
          [
            "A deeper inheritance tree",
            "A global status variable",
            "One class per combination",
            "Composition of exporter and channel",
          ],
          3,
          "Composition allows the two independent axes to vary separately rather than requiring their Cartesian product as subclasses."
        ),
        mc(
          "What violates behavioral substitutability?",
          [
            "Rejecting inputs that the base contract promises to accept",
            "Using a faster internal algorithm",
            "Adding private helper methods",
            "Changing internal storage without changing behavior",
          ],
          0,
          "A client valid under the base contract must remain valid for a subtype; stronger preconditions break that expectation."
        ),
        mc(
          "What is a builder's final responsibility?",
          [
            "Skip validation after fluent calls",
            "Validate the completed configuration",
            "Guarantee a singleton instance",
            "Choose all runtime strategies",
          ],
          1,
          "Staged configuration can still create invalid combinations, so final construction must validate cross-field rules."
        ),
        mc(
          "Why inject a Clock into time-dependent service logic?",
          [
            "To remove all domain validation",
            "To guarantee faster execution",
            "To make time controllable in tests",
            "To avoid storing timestamps",
          ],
          2,
          "A supplied clock allows deterministic boundary tests without depending on wall-clock timing or sleeping."
        ),
        mc(
          "What can make an object with read-only fields still mutable?",
          [
            "Using private methods",
            "Returning scalar values",
            "Having a constructor",
            "Exposing a mutable referenced collection",
          ],
          3,
          "Read-only references cannot be reassigned, but the collection they reference may still change through an exposed alias."
        ),
      ],
    },
  },
  {
    slug: "operating-systems",
    references: [
      {
        title: "Operating system tutorial",
        url: "https://www.geeksforgeeks.org/operating-systems/operating-systems/",
        provider: "GeeksforGeeks",
      },
      {
        title: "Operating system interview guide",
        url: "https://www.interviewbit.com/operating-system-interview-questions/",
        provider: "InterviewBit",
      },
    ],
    questions: [
      q(
        "process-thread",
        "Processes versus threads",
        "Why might a service use several threads inside one process instead of several processes?",
        "Threads share the process address space and resources while retaining their own stacks and execution state. Sharing data is convenient and usually cheaper than cross-process communication, but one memory corruption or crash can affect the whole process. Processes provide stronger address-space isolation at higher coordination cost. For untrusted plugins, process separation may be preferable even if startup and IPC overhead increase.",
        "EASY",
        ["processes", "threads"]
      ),
      q(
        "user-kernel",
        "User and kernel mode",
        "Why do applications use system calls instead of manipulating devices directly?",
        "User mode restricts privileged operations so an application cannot arbitrarily change memory mappings or control hardware. A system call enters the kernel through a controlled interface, which validates arguments and permissions before performing the operation. Reading a file may involve descriptor checks and device access. Crossing the boundary has overhead, but the protection prevents one ordinary program from taking over the machine.",
        "EASY",
        ["kernel", "system-calls"]
      ),
      q(
        "context-switch",
        "Context switches and mode switches",
        "Is every system call a process context switch?",
        "A system call switches privilege mode but may return to the same running thread without scheduling another one. A context switch saves execution state and restores another thread or process, potentially affecting caches and address-translation state. A blocking read may cause both transitions, while a quick metadata call may cause only a mode switch. Conflating them leads to inaccurate performance explanations.",
        "MEDIUM",
        ["scheduling", "system-calls"]
      ),
      q(
        "scheduling-quantum",
        "Round-robin quantum tradeoffs",
        "How does a scheduler's time quantum affect responsiveness and overhead?",
        "A short quantum gives runnable tasks more frequent turns, improving responsiveness, but increases context-switch overhead and can disrupt cache locality. A long quantum reduces switching yet may make interactive tasks wait behind CPU-heavy work. Real schedulers also account for priorities and blocked tasks. For a classroom round-robin trace, include arrival times and switch cost instead of comparing only CPU burst lengths.",
        "MEDIUM",
        ["scheduling", "latency"]
      ),
      q(
        "starvation-aging",
        "Starvation versus fairness",
        "How can priority scheduling starve work, and what does aging do?",
        "If high-priority work continually arrives, a low-priority runnable task may wait indefinitely even though the system keeps making progress. Aging raises the effective priority of waiting tasks so they eventually compete. This is distinct from deadlock, where a set of tasks cannot progress because of dependency cycles. Fairness policies trade strict priority preference for bounded or improved waiting behavior.",
        "MEDIUM",
        ["scheduling", "fairness"]
      ),
      q(
        "race-condition",
        "Race conditions in shared updates",
        "Why is incrementing a shared counter unsafe without coordination?",
        "An increment often involves reading, adding, and writing. Two threads can both read 10 and each write 11, losing one increment. A mutex can protect a larger invariant; an atomic increment can protect this single operation with the runtime's defined memory semantics. Volatile alone generally does not make compound updates atomic. For a count tied to a queue insertion, synchronize the combined state, not just the count.",
        "EASY",
        ["concurrency", "races"]
      ),
      q(
        "mutex-semaphore",
        "Mutexes and semaphores",
        "When would you use a counting semaphore instead of a mutex?",
        "A mutex provides exclusive ownership of a critical section and is normally released by its owner. A counting semaphore represents available permits and can allow several concurrent users or signal between tasks, depending on its API. A pool of five connections naturally maps to five permits. A semaphore is not a substitute for protecting arbitrary shared state unless its permit discipline enforces the required mutual exclusion.",
        "MEDIUM",
        ["synchronization", "semaphores"]
      ),
      q(
        "condition-wait",
        "Condition variables and predicate loops",
        "Why should condition-variable waits recheck a predicate in a loop?",
        "Waiting atomically releases the associated mutex and reacquires it before returning. A wakeup does not guarantee the condition remains true: another consumer may take the item first, or the API may permit spurious wakeups. Use while queue is empty: wait, then consume under the same mutex. The predicate is durable shared state; notification is only a hint to check it again.",
        "MEDIUM",
        ["synchronization", "condition-variables"]
      ),
      q(
        "deadlock-conditions",
        "Deadlock conditions",
        "What conditions make a resource deadlock possible?",
        "The classic conditions are mutual exclusion, hold-and-wait, no forced preemption of held resources, and circular wait. Two workers taking locks A then B and B then A can satisfy all four. Imposing a global acquisition order breaks circular wait. A timeout can help recovery but does not prove the design deadlock-free; cleanup must release partially acquired resources and avoid repeated synchronized retries.",
        "MEDIUM",
        ["deadlocks", "locks"]
      ),
      q(
        "livelock",
        "Livelock and coordinated retries",
        "How is livelock different from deadlock?",
        "In deadlock, tasks wait without progress; in livelock, they keep executing reactions that prevent useful completion. Two workers repeatedly releasing locks to be polite and retrying in step can livelock. Randomized backoff or a deterministic acquisition order can break the symmetry. Monitor completed work as well as CPU activity, because a busy process may still be making no application-level progress.",
        "MEDIUM",
        ["concurrency", "liveness"]
      ),
      q(
        "priority-inversion",
        "Priority inversion",
        "Why can a high-priority task be delayed by a medium-priority one indirectly?",
        "A low-priority task may hold a lock needed by the high-priority task. A medium-priority CPU-bound task then preempts the lock holder, preventing it from releasing the lock. Priority inheritance temporarily raises the holder's priority so it can finish the critical section. It reduces this form of inversion but does not solve all deadlocks or long critical sections; keep blocking work outside locks where possible.",
        "HARD",
        ["scheduling", "locks"]
      ),
      q(
        "virtual-memory",
        "Virtual address spaces",
        "What does virtual memory provide beyond using disk as extra memory?",
        "Virtual memory maps each process's virtual addresses to physical frames and enforces protection and isolation. It enables sparse allocation, shared mappings, and demand loading; disk-backed paging is only one aspect. Two processes can use the same virtual address for different physical data. Translation and page faults have costs, so a large virtual allocation does not imply all pages are physically resident or immediately cheap to access.",
        "EASY",
        ["memory", "virtual-memory"]
      ),
      q(
        "page-fault",
        "Page-fault handling",
        "Does every page fault require disk I/O?",
        "A page fault means the current access cannot be completed under the existing mapping or permission state. The kernel may allocate a zero-filled page, establish a mapping to already resident data, handle copy-on-write, or reject an invalid access. Only some faults require reading storage. Minor and major fault counters help distinguish cases, though exact definitions vary by OS; treating all faults as disk reads misdiagnoses memory pressure.",
        "MEDIUM",
        ["memory", "paging"]
      ),
      q(
        "tlb",
        "Translation lookaside buffers",
        "Why does a TLB matter even when page tables are already in memory?",
        "The TLB caches recent virtual-to-physical translations so memory accesses can avoid repeated page-table walks. A miss may need several dependent memory reads before the actual data access. Large scattered working sets can therefore pay translation overhead as well as cache misses. Larger pages reduce translation entries for some workloads but can waste memory and complicate allocation; they are not an automatic speedup.",
        "MEDIUM",
        ["memory", "tlb"]
      ),
      q(
        "fragmentation",
        "Internal and external fragmentation",
        "How do fixed-size paging and variable-size allocation waste memory differently?",
        "Internal fragmentation is unused space inside an allocated unit, such as the unused tail of a page. External fragmentation is free memory split into gaps that cannot satisfy a large contiguous request despite sufficient total space. Paging avoids external fragmentation for ordinary virtual-page placement into frames but still has internal waste. Kernel contiguous allocations and user-space heaps can have additional fragmentation behaviors.",
        "MEDIUM",
        ["memory", "allocation"]
      ),
      q(
        "thrashing",
        "Working sets and thrashing",
        "Why can adding runnable processes reduce total throughput under memory pressure?",
        "If active working sets exceed available physical memory, pages are repeatedly evicted and faulted back in. The machine spends more time moving pages than doing useful computation, which is thrashing. Reducing concurrency, improving locality, or adding memory can help. Raising the number of workers in response to low CPU utilization can worsen the situation when CPU idleness comes from paging waits rather than lack of work.",
        "HARD",
        ["memory", "performance"]
      ),
      q(
        "copy-on-write",
        "Copy-on-write sharing",
        "How can a child process initially share memory safely after a fork-like operation?",
        "Parent and child can map the same physical pages as read-only or copy-on-write. A write fault creates a private copy for the writer and updates its mapping, while unchanged pages remain shared. This avoids eagerly copying an entire address space. A child that writes most pages loses much of the benefit, and inherited locks in a multithreaded parent require special care because only the calling thread is duplicated on POSIX fork.",
        "HARD",
        ["processes", "memory"]
      ),
      q(
        "ipc-choice",
        "Choosing an IPC mechanism",
        "Compare shared memory with message-based interprocess communication.",
        "Shared memory avoids copying large payloads but requires explicit synchronization, ownership, and data-layout agreements. Pipes or sockets provide message or byte-stream transfer with clearer isolation, at the cost of copying and serialization. A shared frame buffer may suit high-throughput media processing; a socket protocol may be easier for independent services. Shared memory does not make concurrent writes safe or provide automatic message boundaries.",
        "MEDIUM",
        ["ipc", "processes"]
      ),
      q(
        "file-descriptors",
        "Descriptors and open-file state",
        "What is the difference between a file descriptor and the file itself?",
        "A descriptor is a process-local handle referring to an open-file description and underlying file object. Duplicated descriptors may share an offset and status state, depending on the operation. Closing one handle does not necessarily close every reference. This explains why leaked handles retain resources and why two independent opens can have independent offsets. Paths name directory entries, whereas descriptors can remain usable after a path is renamed.",
        "MEDIUM",
        ["files", "resources"]
      ),
      q(
        "durability-fsync",
        "Buffered writes and durability",
        "Why does a successful write not necessarily mean data survives a power loss?",
        "A write may copy bytes into a kernel buffer before storage has persisted them. Durability requires the appropriate synchronization operation and filesystem or device guarantees; metadata and directory changes may need separate handling. A safe replacement pattern can write a temporary file in the target directory, sync it, rename it, and sync the directory where supported. Exact guarantees vary, so distinguish visibility, atomic replacement, and crash durability.",
        "HARD",
        ["filesystems", "durability"]
      ),
    ],
    notes: [
      {
        key: "os-foundations",
        title: "Execution, protection, and resource ownership",
        excerpt:
          "Understand the OS as a mediator for CPU time, address spaces, and persistent resources.",
        content: `# Three questions for every OS mechanism

Ask who owns the resource, how access is protected, and what happens when a task blocks or fails. The operating system multiplexes processors, isolates address spaces, and mediates access to devices and files. Applications see convenient abstractions such as threads, virtual addresses, and descriptors rather than raw hardware operations.

## Processes and threads

A process provides an address-space and resource boundary. Threads within it share most memory and handles but have individual stacks and execution state. This makes cooperation cheap but weakens fault isolation. A server can use threads for trusted request handling and separate processes for untrusted extensions. Neither model eliminates the need to manage shared resources and shutdown.

## Privilege and scheduling

A system call enters the kernel through a controlled interface. It may return immediately to the same thread or block and allow another task to run. A privilege-mode transition is therefore not automatically a process context switch. Schedulers choose among runnable tasks; blocked tasks are not simply waiting in the CPU queue.

\`\`\`text
Runnable -> running -> runnable       (preemption)
Running -> blocked -> runnable       (I/O or synchronization)
Running -> terminated                (completion or failure)
\`\`\`

These states help distinguish CPU saturation from waiting on storage, locks, or network input.

## Address translation

Virtual addresses are translated through page tables, with a TLB caching recent mappings. Protection bits determine allowed access. A fault can allocate a demand-zero page, establish a mapping, perform copy-on-write, load from storage, or terminate an invalid access. Large virtual size and large resident size are different observations.

## Coordination and liveness

A mutex protects a critical section; a semaphore controls permits or signals according to its API; a condition variable supports waiting for a shared predicate. Correctness requires both safety and liveness: no corrupted state, but also useful progress. Deadlock, starvation, and livelock are different failures and need different evidence.

## File handles and persistence

A descriptor is a handle, not a pathname. Open-file references can outlive renames or the closure of another duplicate handle. Buffered writes make data visible before guaranteeing crash survival. Filesystem APIs and hardware determine which synchronization steps establish durability.

## Translate concepts into observations

For a slow service, inspect runnable work, blocked time, page faults, memory residency, and handle counts rather than immediately adding workers. More concurrency can increase lock contention or exceed the memory working set. Explain each observation in terms of the abstraction it measures and the resource bottleneck it might reveal.`,
      },
      {
        key: "os-practical-lab",
        title: "Concurrency and memory exercises",
        excerpt:
          "Trace scheduling, repair a shared counter, and reason about working sets without privileged operations.",
        content: `# A safe user-space laboratory

Use a disposable local process and small inputs. The goal is to understand interleavings and resource behavior, not to modify kernel settings or stress a shared machine. Prefer short bounded runs and cleanly close every handle created by the exercise.

## Exercise 1: schedule on paper

Create three tasks with arrival times and CPU bursts. Simulate round-robin with two different time quanta and a small explicit switch cost. Compute completion time, turnaround time, and waiting time. Explain why a smaller quantum improves turn frequency but can reduce useful CPU time when switches become frequent.

## Exercise 2: demonstrate lost updates

Write two workers that update a shared counter using separate read and write steps. A deterministic barrier-based interleaving is more reliable than hoping a race appears. Make both workers read the same value, then let both write their incremented value. Repair the routine with a mutex or the language's atomic increment operation.

\`\`\`text
Worker A reads 10
Worker B reads 10
Worker A writes 11
Worker B writes 11
Expected completed increments: 2
Observed counter increase: 1
\`\`\`

If the counter also tracks a queue, test the combined invariant under a single coordination scheme. An atomic count alone cannot ensure an item was inserted consistently.

## Exercise 3: producer and consumer

Implement a bounded queue with a mutex and separate not-empty and not-full predicates. Wait in loops, and test shutdown while one worker is blocked. Decide whether shutdown drains pending work or rejects it. Every exit path must release locks and signal waiters that need to observe termination.

## Exercise 4: lock ordering

Model two resource transfers requiring two locks. Show the deadlock interleaving when lock order differs, then enforce an order based on stable resource IDs. Use a bounded simulation or a timeout in a test harness rather than leaving deadlocked workers running. A timeout is evidence of a possible liveness failure, not a correctness proof.

## Exercise 5: locality

Allocate a moderate array and compare sequential traversal with a shuffled index order. Keep the data size safe for the environment and report repeated timings rather than a single number. Explain that cache and TLB locality can differ; the experiment does not isolate one component unless additional instrumentation supports that conclusion.

## Exercise 6: file lifetime

Open a small exercise file, duplicate its handle if the platform API supports it, and examine whether offsets are shared. Contrast this with two separate opens. Close all handles in guaranteed cleanup paths. Discuss crash durability from API documentation rather than claiming that one successful write experiment proves persistence under power failure.`,
      },
      {
        key: "os-pitfalls",
        title: "Diagnosing resource and synchronization failures",
        excerpt: "Separate busy from productive, virtual from resident, and visible from durable.",
        content: `# Do not diagnose from one metric

High CPU can mean useful computation, spinning, or livelock. Low CPU can mean insufficient work, lock contention, storage waits, or paging pressure. Observe completed requests and wait states together. Adding threads without identifying the bottleneck may increase contention or memory demand.

## Synchronization misconceptions

A variable marked volatile is not generally an atomic read-modify-write operation. A thread-safe container does not make a sequence of operations on several containers atomic. A condition-variable notification is not stored permission to proceed; the protected predicate is the source of truth.

\`\`\`text
lock(queueMutex)
while queue is empty and not shuttingDown:
  wait(notEmpty, queueMutex)
if queue is empty and shuttingDown:
  exit after unlocking
consume one item
unlock(queueMutex)
\`\`\`

Handle errors and shutdown as carefully as the normal path. A worker that exits while holding a lock can block all future work.

## Deadlock, starvation, and livelock

Deadlock requires a dependency trap; starvation allows others to progress while one task waits indefinitely; livelock keeps tasks active without useful completion. Global lock order addresses circular wait. Aging addresses some priority starvation. Randomized backoff can break synchronized retry patterns, but retries must remain bounded and observable.

## Memory accounting traps

Virtual allocation is not the same as resident physical memory. A first touch may fault even though allocation succeeded earlier. A page fault is not always storage I/O. Copy-on-write sharing saves memory until writers dirty pages. Retained caches and queued work can increase the working set until the system repeatedly evicts useful pages.

Larger pages can reduce TLB pressure but increase internal waste. A benchmark must reflect access patterns and memory footprint, not just allocation size. Avoid interpreting every cache miss as a page fault; these mechanisms operate at different levels.

## Resource lifetime

Handles, mappings, and subscriptions need cleanup on exceptions and cancellations. Duplicating a handle may keep the underlying resource alive after the original is closed. Process termination reclaims many resources but is not a substitute for a service's controlled lifecycle. In POSIX multithreaded fork scenarios, inherited lock state can be unsafe in the child; follow the platform's post-fork restrictions.

## Persistence assumptions

Successful buffering does not establish crash durability. Atomic rename, flushed file contents, and durable directory metadata are separate concerns whose guarantees vary by filesystem and OS. Never generalize a local experiment into a universal persistence promise.

Conclude an investigation with a causal statement supported by multiple observations: for example, rising major faults and declining completion rate after increasing workers suggest a working-set problem. State uncertainty and the next discriminating measurement rather than treating a metric as a verdict.`,
      },
    ],
    roadmap: {
      title: "Reason about execution and resource pressure",
      description: "Use bounded user-space experiments and explicit interleaving traces.",
      estimatedHours: 26,
      steps: [
        {
          title: "Execution model",
          description:
            "Trace process, thread, mode-switch, and blocked-state differences using simple call scenarios.",
          hours: 3,
        },
        {
          title: "Scheduling",
          description: "Simulate time quanta, arrival times, switch overhead, and priority aging.",
          hours: 4,
        },
        {
          title: "Synchronization",
          description:
            "Demonstrate a lost update and build a bounded producer-consumer queue with clean shutdown.",
          hours: 6,
        },
        {
          title: "Liveness",
          description:
            "Analyze lock-order deadlocks, starvation, livelock, and priority inversion.",
          hours: 4,
        },
        {
          title: "Memory behavior",
          description:
            "Study page translation, copy-on-write, faults, and locality with moderate allocations.",
          hours: 5,
        },
        {
          title: "Resources and durability",
          description:
            "Review descriptor lifetimes and distinguish buffered visibility from documented persistence guarantees.",
          hours: 4,
        },
      ],
    },
    cheatSheet: {
      title: "OS mechanisms and diagnostic distinctions",
      content: `# Operating systems quick reference

| Distinction | Key idea |
| --- | --- |
| Process / thread | Address-space isolation / shared address space with separate execution state |
| Mode / context switch | Privilege transition / scheduled execution-state replacement |
| Mutex / semaphore | Exclusive ownership / available permits or signaling |
| Condition variable | Wait for a predicate while atomically releasing a mutex |
| Deadlock / starvation / livelock | Trapped dependencies / indefinite unfair waiting / active nonprogress |
| Virtual / resident memory | Address-space mappings / currently resident physical pages |
| Cache miss / TLB miss / page fault | Data cache / translation cache / mapping or permission handling |

\`\`\`text
Deadlock conditions:
  mutual exclusion
  hold and wait
  no forced resource preemption
  circular wait
Useful prevention: one global lock acquisition order
\`\`\`

Round-robin's short quantum improves turn frequency but raises switching overhead. Priority inheritance helps a low-priority lock holder finish when a higher-priority task waits. Working sets larger than memory can cause thrashing; more workers may make it worse.

Demand-zero and copy-on-write faults need not read storage. Fixed-size pages can waste space internally, while variable contiguous allocations can fragment externally. A TLB caches translations, not file contents.

Close handles and unmap memory on every exit path. A duplicated descriptor can share open-file state and keep a resource alive. A successful write can mean buffered visibility rather than power-loss durability; synchronization and metadata guarantees are platform-specific. Always pair utilization metrics with useful completion rate.`,
    },
    quiz: {
      title: "Execution and synchronization reasoning",
      questions: [
        mc(
          "What do threads in the same process normally share?",
          [
            "The address space",
            "One execution stack",
            "One program counter",
            "A single scheduling state",
          ],
          0,
          "Threads share process memory and many resources, but each maintains its own stack, registers, and execution state."
        ),
        mc(
          "Which event necessarily involves a privilege-mode transition but not always another scheduled task?",
          [
            "Appending to a local array",
            "Making a system call",
            "Comparing two integers",
            "Returning from a user function",
          ],
          1,
          "A system call enters kernel mode and may return to the same thread without the scheduler selecting another task."
        ),
        mc(
          "Why recheck a condition predicate after waking?",
          [
            "Notifications always arrive twice",
            "Mutexes are never reacquired",
            "The predicate may no longer hold",
            "The queue must be sorted",
          ],
          2,
          "Another worker may consume the available item before this waiter proceeds, and some APIs allow spurious wakeups."
        ),
        mc(
          "Which policy breaks circular wait for multi-lock operations?",
          [
            "Always retry immediately",
            "Use more threads",
            "Increase queue capacity",
            "Acquire locks in one global order",
          ],
          3,
          "A consistent ordering prevents a cycle of tasks each holding a higher-order lock while waiting for a lower-order one."
        ),
        mc(
          "What does a TLB cache?",
          [
            "Virtual-to-physical translations",
            "Entire disk files",
            "Thread stack snapshots",
            "Network routing decisions",
          ],
          0,
          "The TLB stores recent address translations and permissions, reducing repeated page-table walks for memory accesses."
        ),
        mc(
          "Which page fault can occur without reading storage?",
          [
            "Every missing executable page",
            "A demand-zero page allocation",
            "Every swapped-out page load",
            "Every remote-file read",
          ],
          1,
          "A demand-zero fault can allocate and initialize a physical page without fetching prior contents from disk."
        ),
        mc(
          "What best describes thrashing?",
          [
            "A CPU never receiving interrupts",
            "A queue with no producers",
            "Repeated paging that displaces useful computation",
            "A filesystem containing many directories",
          ],
          2,
          "When working sets exceed physical memory, repeated eviction and reload can dominate execution and reduce useful throughput."
        ),
        mc(
          "What does a successful buffered write alone usually not guarantee?",
          [
            "Bytes were accepted by the OS",
            "A file descriptor was used",
            "The caller provided data",
            "Survival of an immediate power loss",
          ],
          3,
          "Buffered success may precede persistent storage; durability requires the platform's synchronization and metadata guarantees."
        ),
      ],
    },
  },
  {
    slug: "computer-networks",
    references: [
      {
        title: "Computer network tutorial",
        url: "https://www.geeksforgeeks.org/computer-networks/computer-network-tutorials/",
        provider: "GeeksforGeeks",
      },
      {
        title: "Networking interview guide",
        url: "https://www.interviewbit.com/networking-interview-questions/",
        provider: "InterviewBit",
      },
    ],
    questions: [
      q(
        "layering",
        "Layering and encapsulation",
        "How does a web request cross networking layers?",
        "Application bytes are carried by a transport protocol, then IP packets, then link-layer frames on each local hop. Each layer adds metadata for its job, such as ports, IP addresses, or local hardware addresses. Routers generally replace link framing while forwarding the IP packet. Layering simplifies interoperability and diagnosis, but real protocols can combine responsibilities, so the OSI model is a reasoning tool rather than an exact implementation map.",
        "EASY",
        ["layers", "encapsulation"]
      ),
      q(
        "switch-router",
        "Switches and routers",
        "Why is a router needed to reach another IP subnet?",
        "A layer-2 switch forwards frames within a link domain using learned MAC information. A router forwards IP packets between networks using a routing table and next-hop decisions. A host sends off-subnet traffic toward its default gateway rather than resolving the remote host's MAC directly. Some devices combine both roles, but the distinction explains why a working local link does not prove an inter-subnet route exists.",
        "EASY",
        ["routing", "ethernet"]
      ),
      q(
        "subnetting",
        "Reading a CIDR prefix",
        "How many conventional host addresses are in an IPv4 /27 subnet?",
        "A /27 leaves five host bits, giving 32 total addresses. In an ordinary broadcast subnet, the network and broadcast addresses are reserved, leaving 30 usable host addresses. For 192.0.2.64/27, the range is .64 through .95 and conventional hosts are .65 through .94. Special cases such as /31 point-to-point links follow different rules, so do not blindly subtract two for every prefix.",
        "MEDIUM",
        ["ip", "subnetting"]
      ),
      q(
        "arp-neighbor",
        "ARP and local next hops",
        "What address does a host resolve when sending IPv4 traffic to a remote network?",
        "It resolves the MAC address of the local next hop, usually the default gateway, not the remote destination host. ARP operates on the local IPv4 link; the IP destination remains the remote host while the frame destination is the gateway. IPv6 uses Neighbor Discovery rather than ARP. Cached neighbor entries can become stale, and successful resolution proves only local reachability, not end-to-end delivery.",
        "MEDIUM",
        ["arp", "routing"]
      ),
      q(
        "dns-resolution",
        "DNS lookup and caching",
        "Why can a DNS change appear at different times for different clients?",
        "Recursive resolvers and clients cache answers according to TTLs, and authoritative changes do not instantly invalidate every cache. Negative answers can also be cached. A browser may reuse a connection without resolving again, adding another layer of delay. Lowering TTL ahead of a planned change can reduce later cache lifetime but cannot erase older cached answers. Check authoritative and recursive responses separately.",
        "MEDIUM",
        ["dns", "caching"]
      ),
      q(
        "dhcp",
        "DHCP configuration",
        "What does DHCP provide besides an IPv4 address?",
        "DHCP can provide a subnet mask, default gateway, DNS servers, and lease timing. The common discovery-offer-request-acknowledgment exchange lets a client obtain configuration before normal unicast connectivity is established. A lease must be renewed and is not a permanent identity. Static assignments may suit infrastructure, while dynamic leases simplify client administration; rogue or misconfigured servers can give valid-looking but incorrect network settings.",
        "EASY",
        ["dhcp", "configuration"]
      ),
      q(
        "tcp-udp",
        "TCP versus UDP",
        "Why might a real-time application prefer UDP while a file transfer prefers TCP?",
        "TCP provides a reliable ordered byte stream with retransmission and flow control, making complete file delivery straightforward. UDP sends independent datagrams without built-in delivery or ordering guarantees, allowing a real-time application to discard late data rather than wait for retransmission. UDP is not inherently faster in every workload; the application may still need congestion control, reliability, and encryption, as protocols built over UDP often provide.",
        "EASY",
        ["tcp", "udp"]
      ),
      q(
        "tcp-handshake",
        "TCP connection establishment",
        "What is the purpose of the TCP three-way handshake?",
        "SYN, SYN-ACK, and ACK exchange initial sequence numbers and demonstrate bidirectional communication before normal data transfer. The third message confirms that the initiator received the responder's sequence number. This is transport establishment, not user authentication or encryption. A successful handshake can still be followed by application failure, so diagnose connection setup separately from TLS and request processing.",
        "MEDIUM",
        ["tcp", "connections"]
      ),
      q(
        "tcp-stream-framing",
        "Byte streams need message framing",
        "Why can one TCP send require several receives, or several sends appear in one receive?",
        "TCP preserves byte order, not application message boundaries. Segmentation, buffering, and timing can split or combine the bytes observed by a receiver. Define framing with a length prefix, delimiter with escaping, or a protocol-specific grammar. A length-prefixed receiver must loop until the full header and payload arrive and reject oversized lengths. Assuming one receive equals one request creates truncation and parsing bugs.",
        "MEDIUM",
        ["tcp", "protocols"]
      ),
      q(
        "flow-congestion",
        "Flow control versus congestion control",
        "Why does TCP have both a receive window and a congestion window?",
        "The receive window limits data according to the receiver's buffering capacity. The congestion window limits data according to the sender's estimate of network capacity and loss or congestion signals. Effective outstanding data is constrained by both. A fast receiver does not imply the path can safely carry unlimited traffic. Distinguishing the two helps diagnose whether throughput is limited by endpoint buffering or network congestion.",
        "HARD",
        ["tcp", "performance"]
      ),
      q(
        "latency-bandwidth",
        "Latency and bandwidth-delay product",
        "Why can a high-bandwidth path still transfer slowly over a long round trip?",
        "Throughput depends on enough data being in flight to fill the path. The bandwidth-delay product is bandwidth times round-trip time; at 100 Mbit/s and 0.1 seconds, about 10 Mbit or 1.25 MB must be outstanding to sustain that rate. Small windows, slow-start behavior, loss, or application request sequencing can limit throughput. More bandwidth alone does not reduce the round-trip time of a sequential dependency.",
        "HARD",
        ["performance", "latency"]
      ),
      q(
        "mtu",
        "MTU and packet-size failures",
        "Why might small requests work while large transfers stall?",
        "A path may have a smaller MTU than an endpoint expects. If packets cannot be forwarded at that size and necessary error signaling is blocked, path-MTU discovery can fail and create a black hole. Tunnels also consume header space. Adjusting transport segment size can mitigate some cases, but first verify path and protocol behavior. IPv4 and IPv6 fragmentation rules differ; routers do not fragment IPv6 packets.",
        "HARD",
        ["ip", "mtu"]
      ),
      q(
        "nat",
        "NAT and connection state",
        "How can many private hosts share one public IPv4 address?",
        "Port-address translation maps private source addresses and ports to public address-port combinations and tracks return traffic. This conserves public addresses but introduces state, timeout behavior, and difficulty accepting unsolicited inbound connections. A port-forwarding rule creates an explicit inbound mapping. NAT is not equivalent to a security policy: filtering and authorization still require deliberate controls.",
        "MEDIUM",
        ["nat", "ports"]
      ),
      q(
        "tls",
        "TLS authentication and encryption",
        "What should a client validate before trusting an HTTPS connection?",
        "The client should validate the certificate chain against trusted authorities, check validity and intended usage, and match the requested hostname. TLS then protects traffic integrity and confidentiality under its negotiated protocol. Encryption without authenticating the peer can protect a conversation with an attacker rather than the intended server. TLS does not prove the application's content is safe or replace application-level authorization.",
        "MEDIUM",
        ["tls", "security"]
      ),
      q(
        "http-versions",
        "HTTP/1.1, HTTP/2, and HTTP/3",
        "How do modern HTTP versions change request multiplexing and head-of-line behavior?",
        "HTTP/1.1 commonly uses multiple connections to overlap requests. HTTP/2 multiplexes streams over one TCP connection, but lost TCP bytes can delay all streams until recovery. HTTP/3 uses QUIC over UDP with independent stream delivery, reducing cross-stream transport head-of-line blocking. Loss still affects congestion and individual streams; HTTP/3 does not eliminate all latency or ordering constraints.",
        "HARD",
        ["http", "quic"]
      ),
      q(
        "http-idempotency",
        "Retrying requests safely",
        "Why is retrying a timed-out payment request different from retrying a GET?",
        "A timeout does not tell the client whether the server committed the operation before the response was lost. GET is intended to be safe and idempotent under HTTP semantics, while a payment POST may create another charge if repeated. Use an application idempotency key with durable deduplication and defined outcome retention. Method names alone cannot make a misimplemented endpoint safe to retry.",
        "MEDIUM",
        ["http", "retries"]
      ),
      q(
        "proxy-load-balancer",
        "Proxies and load balancers",
        "Compare a layer-4 load balancer with a layer-7 reverse proxy.",
        "A layer-4 balancer routes transport connections using addresses, ports, and connection state without necessarily parsing HTTP. A layer-7 proxy can route by host or path, terminate TLS, and enforce application-aware policies. That flexibility adds processing and changes where client identity and encryption terminate. Forwarded client headers must be trusted only from known proxies, not accepted blindly from arbitrary requests.",
        "MEDIUM",
        ["proxies", "load-balancing"]
      ),
      q(
        "cdn-cache",
        "HTTP caching and variation",
        "Why can a shared cache return the wrong user's content if keys are incomplete?",
        "A cache key must capture all request dimensions that affect the representation, and personalized responses need appropriate cache restrictions. Vary can identify relevant header variation, while Cache-Control governs storage and reuse. Caching authenticated account pages as public can leak data even if the URL is identical for all users. Validators such as ETag support revalidation but do not by themselves make private content safe for shared storage.",
        "HARD",
        ["http", "caching"]
      ),
      q(
        "routing-prefix",
        "Longest-prefix routing",
        "How does a router choose between overlapping routes?",
        "It normally selects the most specific matching destination prefix before considering metrics among comparable routes. A route for 10.1.0.0/16 therefore overrides a matching 10.0.0.0/8 route for destinations in that narrower range. The default route is the least specific fallback. Confusing lowest numeric gateway with longest prefix can produce wrong explanations; routing policy and table selection may add platform-specific stages.",
        "MEDIUM",
        ["routing", "cidr"]
      ),
      q(
        "network-diagnosis",
        "A layered failure investigation",
        "How would you separate DNS, transport, TLS, and application failures?",
        "Check name resolution, chosen destination, local route, connection establishment, certificate validation, and then response status and timing. A ping failure alone is inconclusive because ICMP may be filtered while TCP works. A fast connection with a slow first response suggests a different issue from a failed handshake. Use bounded requests to endpoints you control and record timings rather than scanning unrelated systems.",
        "MEDIUM",
        ["diagnostics", "layers"]
      ),
    ],
    notes: [
      {
        key: "network-foundations",
        title: "Follow one request end to end",
        excerpt:
          "Connect local frames, IP routing, transport state, TLS, and application messages.",
        content: `# One request, several contracts

Imagine a client fetching an HTTPS resource by hostname. It may first consult local or recursive DNS caches, select an IP address, find a route, establish transport, authenticate the peer with TLS, and exchange application messages. Existing caches and connections can skip some steps. Diagnose each stage separately rather than calling every failure a network timeout.

## Local and remote addressing

IP identifies the end-to-end destination, while link addressing identifies the next local hop. For an off-subnet IPv4 destination, the host usually resolves its gateway's MAC with ARP. The remote server's MAC is not carried across every router. IPv6 uses Neighbor Discovery and has different address and fragmentation rules.

\`\`\`text
Application request
  -> transport bytes or datagrams
  -> IP packet with destination address
  -> local frame addressed to next hop
  -> router replaces local framing and forwards packet
\`\`\`

CIDR prefixes define network membership and route specificity. A conventional /27 IPv4 subnet has 32 addresses and usually 30 host addresses, while /31 point-to-point links are a special case. Learn the rule and its scope together.

## Transport responsibilities

TCP provides reliable ordered bytes, not messages. A receiver may need several reads for one application message or see bytes from several messages in one read. UDP preserves datagram boundaries but does not provide TCP's delivery guarantees. Applications over UDP still need to respect congestion and define any required reliability.

TCP's receive window protects the receiver, while its congestion window responds to the path. Latency, loss, and the amount of data in flight all affect throughput. A sequential request dependency pays round trips even on a high-bandwidth link.

## Trust and application semantics

TLS authenticates a peer through certificate validation and protects traffic. It does not authorize a user to access an account. HTTP methods, status codes, caching headers, and message framing define a separate application contract. A retry after a timeout can repeat an already committed operation unless the application has a durable idempotency mechanism.

## Middleboxes and caching

NAT translates address-port mappings and keeps state; proxies can terminate connections and inspect application requests; CDNs reuse responses near users. These mechanisms can improve scale but change failure modes and trust boundaries. Personalized data must not enter a shared cache under an incomplete key.

At each stage ask what is known: DNS success identifies an address, a TCP handshake establishes transport, TLS validates the intended peer, and an application success confirms the requested operation. None automatically proves the next stage succeeded.`,
      },
      {
        key: "network-exercises",
        title: "Bounded networking exercises",
        excerpt:
          "Practice subnet math, framing, cache reasoning, and layered diagnosis on controlled examples.",
        content: `# Build a network reasoning notebook

Use documented examples and endpoints you own or are explicitly permitted to query. Do not scan networks or generate large traffic bursts. Small traces and bounded requests are sufficient to understand most interview concepts.

## Exercise 1: subnet and route decisions

For 192.0.2.64/27, write the network address, broadcast address, and conventional host range. Then compare a destination against a /24 route, a /27 route, and a default route. Select the longest matching prefix first. Add a destination outside the /27 to show why the broader route is still necessary.

## Exercise 2: local next-hop reasoning

Draw a client, its gateway, two routers, and a server. Label each packet's IP destination and each hop's frame destination. Explain why the client's ARP request asks for the gateway rather than the remote server. Repeat conceptually for IPv6 using Neighbor Discovery, without treating it as an identical packet format.

## Exercise 3: a framed stream

Define a tiny protocol with a four-byte length header followed by payload bytes. Feed the parser the same message split after every possible byte position, then feed two messages in one chunk. It should produce identical logical messages. Reject a length above a fixed safety limit before allocating that amount of memory.

\`\`\`text
buffer incoming bytes
while a complete header is available:
  read declared length
  reject length above limit
  if payload is incomplete: wait for more bytes
  otherwise emit exactly one message and continue
\`\`\`

This models TCP's byte-stream behavior without requiring a real network connection.

## Exercise 4: latency accounting

Assume a 100 ms round trip and a 100 Mbit/s link. Compute the bandwidth-delay product, then compare a long bulk transfer with five sequential small requests. Explain why increasing bandwidth does not remove the five round-trip dependencies. Add a cache hit or reused connection and state which setup work disappears.

## Exercise 5: retry and cache tables

Create a table for a safe GET, an idempotent replacement operation, and a payment creation. For each, write what a timeout leaves unknown and what makes retry safe. Then list cache dimensions for a public localized page and a private account page. The private response should not become public merely because its URL looks stable.

## Exercise 6: diagnosis

For a controlled HTTPS endpoint, separate resolution, connect, TLS, and response timing using available client tooling. Record one bounded request at a time. If ICMP is blocked, do not infer all transport is blocked. Finish with a hypothesis supported by stage-specific observations, and state what further measurement would distinguish a server delay from a path delay.`,
      },
      {
        key: "network-pitfalls",
        title: "Protocol assumptions that cause production failures",
        excerpt: "Review framing, retransmission, trust boundaries, cache keys, and path limits.",
        content: `# Successful connectivity is not successful semantics

A transport connection can work while the certificate is wrong, the HTTP response is an error, or the server has already performed an operation whose reply was lost. Keep connection success, peer authentication, authorization, and business success separate.

## Stream and size errors

One send does not equal one receive on TCP. Parsers must handle partial headers, partial payloads, and multiple messages in a chunk. Bound declared lengths before allocating buffers. Delimiter protocols need escaping or a grammar that makes the delimiter unambiguous. Datagram applications must consider truncation and packet-size limits rather than assuming every payload fits the path.

\`\`\`text
Transport review:
  Are message boundaries explicit?
  Is incomplete input retained safely?
  Is maximum message size enforced?
  Is shutdown distinguishable from temporary lack of data?
\`\`\`

## Retries can duplicate effects

A timeout leaves the outcome uncertain. Blind retries of a creation operation can charge twice or enqueue duplicate work. Use bounded backoff and application-level idempotency keys with documented retention and conflict handling. A client-generated key is insufficient unless the server consistently stores and checks it with the effect.

## Trust boundary errors

Do not disable hostname or certificate validation to make TLS errors disappear. A reverse proxy may supply client-address headers, but direct clients can forge the same headers unless the application trusts only a known proxy path. NAT hides address structure but does not replace access control or authenticated identity.

## Caches and DNS

DNS caches persist until their lifetimes expire and may retain negative answers. Browsers can reuse connections after a record changes. Shared HTTP caches need correct keys and storage directives; personalized responses require careful restrictions. ETag supports validation of a representation, not permission to share it with another user.

## Performance misconceptions

High bandwidth does not imply low latency. A small receive window or congestion window can leave a large path underfilled. HTTP/2 multiplexing still shares TCP's ordered recovery, while HTTP/3 reduces cross-stream transport blocking without eliminating congestion effects. Packet loss and MTU discovery failures can make large transfers behave differently from small requests.

## Diagnostic overreach

Ping tests ICMP reachability under current policy, not every application protocol. A failed traceroute hop can reflect missing probe responses rather than a broken forwarding path. Use authorized, bounded tests and correlate multiple observations. Avoid drawing conclusions about packet loss from a single application timeout.

The strongest explanation follows the request through the layers, states where evidence stops, and distinguishes protocol guarantees from application policies. That method remains useful when implementation details or HTTP versions change.`,
      },
    ],
    roadmap: {
      title: "Trace and diagnose end-to-end communication",
      description: "Combine address math, protocol contracts, and safe controlled experiments.",
      estimatedHours: 25,
      steps: [
        {
          title: "Layers and local delivery",
          description: "Draw encapsulation and next-hop addressing across a routed path.",
          hours: 3,
        },
        {
          title: "Addressing and naming",
          description:
            "Practice CIDR ranges, longest-prefix selection, DHCP configuration, and DNS cache timelines.",
          hours: 4,
        },
        {
          title: "Transport framing",
          description: "Build a bounded length-prefixed parser and compare TCP and UDP guarantees.",
          hours: 5,
        },
        {
          title: "Throughput and path limits",
          description:
            "Calculate bandwidth-delay products and analyze loss, windows, and MTU failures.",
          hours: 4,
        },
        {
          title: "HTTP and trust",
          description:
            "Review TLS validation, HTTP versions, cache variation, and idempotent retries.",
          hours: 5,
        },
        {
          title: "Layered diagnosis",
          description:
            "Collect controlled stage timings and defend hypotheses without overinterpreting ICMP tests.",
          hours: 4,
        },
      ],
    },
    cheatSheet: {
      title: "Network contracts and troubleshooting map",
      content: `# Computer networks quick reference

| Mechanism | Guarantee or role | Not guaranteed |
| --- | --- | --- |
| DNS | Resolve names with cacheable records | Immediate propagation of changes |
| ARP | Resolve IPv4 local next-hop link address | Remote end-to-end delivery |
| TCP | Reliable ordered byte stream | Application message boundaries |
| UDP | Independent datagrams | Delivery, ordering, or congestion policy |
| TLS | Authenticated encrypted channel when validated | User authorization or safe content |
| NAT | Stateful address/port translation | A complete security policy |
| HTTP cache | Reuse eligible representations | Safe sharing without correct keys/directives |

\`\`\`text
IPv4 /27: 32 addresses, conventionally 30 hosts
Routing: longest matching prefix, then relevant policy/metrics
BDP: bandwidth * RTT
100 Mbit/s * 0.1 s = 10 Mbit = 1.25 MB
TCP: receive window protects endpoint; congestion window protects path
\`\`\`

HTTP/2 multiplexes over TCP and still shares transport head-of-line recovery. HTTP/3 uses QUIC streams over UDP to reduce cross-stream blocking. IPv6 routers do not fragment packets; path size and signaling still matter.

Diagnosis order: name resolution, selected address, route, transport connection, TLS validation, application status, response timing. ICMP failure alone does not prove TCP failure. A timed-out state-changing request has an uncertain outcome; use durable idempotency and bounded retries. For shared caches, distinguish public variation from personalized content and do not trust client-supplied proxy headers without a controlled proxy boundary.`,
    },
    quiz: {
      title: "Network guarantees and failure modes",
      questions: [
        mc(
          "For an off-subnet IPv4 destination, whose MAC does a host normally resolve?",
          [
            "Its local gateway's",
            "The remote server's",
            "The authoritative DNS server's",
            "Every router's",
          ],
          0,
          "The local frame goes to the next hop while the IP destination remains remote; ARP does not resolve across arbitrary routed networks."
        ),
        mc(
          "How many conventional usable host addresses does an IPv4 /27 have?",
          ["32", "30", "27", "62"],
          1,
          "Five host bits provide 32 addresses; ordinary broadcast subnets reserve network and broadcast addresses, leaving 30."
        ),
        mc(
          "What must an application add when using a TCP stream for discrete messages?",
          ["MAC routing", "DNS recursion", "Message framing", "A new IP subnet"],
          2,
          "TCP preserves ordered bytes but may split or combine application sends, so the receiver needs explicit message boundaries."
        ),
        mc(
          "Which TCP mechanism responds primarily to network congestion?",
          [
            "The DNS TTL",
            "The receive window",
            "The application delimiter",
            "The congestion window",
          ],
          3,
          "The congestion window controls outstanding data according to path conditions, whereas the receive window reflects receiver capacity."
        ),
        mc(
          "What is the bandwidth-delay product at 100 Mbit/s and 100 ms RTT?",
          ["10 Mbit", "100 Mbit", "1 Mbit", "10 Gbit"],
          0,
          "Multiplying 100 million bits per second by 0.1 second gives 10 million bits, approximately 1.25 MB in flight."
        ),
        mc(
          "What should certificate validation include?",
          [
            "Only whether traffic is encrypted",
            "Matching the requested hostname",
            "The client's local MAC address",
            "Whether ping succeeds",
          ],
          1,
          "Hostname matching binds the authenticated certificate identity to the intended server; encryption alone does not establish that identity."
        ),
        mc(
          "Why can a timed-out payment POST be unsafe to retry blindly?",
          [
            "TCP always loses POST data",
            "DNS cannot cache payment domains",
            "The server may already have committed the charge",
            "TLS prohibits repeated messages",
          ],
          2,
          "The response may be lost after the effect commits, so durable server-side idempotency is needed to avoid repeating the charge."
        ),
        mc(
          "What does HTTP/3 reduce compared with HTTP/2 over TCP?",
          [
            "All congestion effects",
            "All application ordering needs",
            "Every handshake delay",
            "Cross-stream transport head-of-line blocking",
          ],
          3,
          "QUIC streams can recover independently, although loss still affects congestion and the stream whose data is missing."
        ),
      ],
    },
  },
  {
    slug: "dbms",
    references: [
      {
        title: "Database management system tutorial",
        url: "https://www.geeksforgeeks.org/dbms/dbms/",
        provider: "GeeksforGeeks",
      },
      {
        title: "DBMS interview guide",
        url: "https://www.interviewbit.com/dbms-interview-questions/",
        provider: "InterviewBit",
      },
      {
        title: "DBMS foundations and relational modeling",
        url: "https://www.tpointtech.com/dbms-tutorial",
        provider: "Tpoint Tech (JavaTpoint)",
      },
    ],
    questions: [
      q(
        "dbms-file",
        "DBMS versus ordinary files",
        "What does a DBMS add beyond storing records in files?",
        "A DBMS coordinates querying, integrity constraints, concurrent access, recovery, and permissions under a shared data model. A file-based catalog can work for a single writer, but coordinating updates and crash recovery across many writers becomes application work. A DBMS adds operational complexity and resource cost, so it is not mandatory for every small configuration file. Its value grows when multiple clients need consistent shared state.",
        "EASY",
        ["architecture", "storage"]
      ),
      q(
        "schema-instance",
        "Schema and instance",
        "How do a schema and a database instance differ?",
        "The schema defines the structure and constraints, such as relation names, attribute types, keys, and relationships. The instance is the actual data at a particular time. An enrollment schema can remain unchanged while students enroll and withdraw. Schema changes require controlled migration because applications depend on the structure; ordinary data changes should still satisfy the existing schema's constraints.",
        "EASY",
        ["modeling", "schema"]
      ),
      q(
        "keys",
        "Candidate, primary, and foreign keys",
        "How do different key types express identity and relationships?",
        "A candidate key is a minimal attribute set that uniquely identifies a row under the model's rules. One candidate is selected as the primary key; other candidates can remain unique constraints. A foreign key references an eligible key in another or the same relation to enforce relationship validity. A generated ID does not remove the need to enforce a business uniqueness rule, such as one enrollment per student and course.",
        "EASY",
        ["keys", "integrity"]
      ),
      q(
        "er-cardinality",
        "Modeling many-to-many relationships",
        "How should students and courses be represented when both sides can have many matches?",
        "Use an associative relation such as Enrollment(studentId, courseId, enrolledAt). A composite unique or primary constraint on the two IDs prevents duplicate enrollment if that is the rule. Each foreign key enforces valid references. If repeated course attempts are meaningful, include an attempt identifier or term in the business key instead. Storing comma-separated course IDs hides relationships and makes integrity and querying harder.",
        "MEDIUM",
        ["er-model", "relationships"]
      ),
      q(
        "functional-dependency",
        "Functional dependencies",
        "What does X -> Y mean, and why is a sample dataset insufficient to prove it?",
        "X -> Y means every valid relation instance must have the same Y values for rows agreeing on X. It is a domain constraint, not merely a coincidence in current rows. A few employees may currently have distinct names, but name need not determine employee ID. Dependencies guide keys and normalization, so infer them from business rules and confirm with stakeholders rather than treating observed uniqueness as a permanent guarantee.",
        "MEDIUM",
        ["normalization", "dependencies"]
      ),
      q(
        "normalization-3nf",
        "Update anomalies and 3NF",
        "Why separate department details from employee rows?",
        "Repeating department name and phone on each employee creates update anomalies: changing one department requires consistent edits to many rows, and deleting its last employee can lose department information. If employeeId determines departmentId and departmentId determines department details, those details have a transitive dependency. A separate Department relation removes that repetition; joins add query work but preserve a single authoritative fact.",
        "MEDIUM",
        ["normalization", "3nf"]
      ),
      q(
        "bcnf-tradeoff",
        "BCNF and dependency preservation",
        "Why can stronger normalization make constraint enforcement less local?",
        "BCNF requires every nontrivial functional dependency's determinant to be a superkey. A lossless decomposition can remove a BCNF violation yet separate attributes needed to enforce an original dependency, making that check require a join. A dependency-preserving 3NF design may be a practical compromise. Evaluate losslessness, preserved constraints, and write workload separately rather than assuming more decomposition is always operationally better.",
        "HARD",
        ["normalization", "bcnf"]
      ),
      q(
        "lossless-join",
        "Lossless decomposition",
        "What does it mean to split a relation without losing information?",
        "A decomposition is lossless when joining its projections reconstructs exactly the original valid relation, without spurious combinations. For a binary decomposition, a common sufficient-and-necessary dependency criterion is that the shared attributes determine all attributes of one component under the dependency closure. Splitting arbitrary columns because they look related can create false pairings. Losslessness is separate from preserving every constraint locally.",
        "HARD",
        ["relational-model", "decomposition"]
      ),
      q(
        "acid",
        "ACID responsibilities",
        "How do ACID properties apply to transferring funds between two accounts?",
        "Atomicity makes the debit and credit commit together or neither; consistency means declared rules remain satisfied; isolation controls interference from concurrent transfers; durability preserves acknowledged commits under the configured guarantees. The DBMS cannot invent missing business rules, so application logic and constraints must define them. A transaction helps, but weak isolation or an incorrect read-modify-write sequence can still violate an intended invariant.",
        "EASY",
        ["transactions", "acid"]
      ),
      q(
        "isolation-anomalies",
        "Read anomalies",
        "Distinguish dirty reads, nonrepeatable reads, and phantoms.",
        "A dirty read observes another transaction's uncommitted change. A nonrepeatable read sees a previously read row changed by a committed transaction. A phantom changes the set of rows matching a predicate, such as another reservation appearing in a time range. Isolation names and exact implementations vary by engine. Choose a level by the invariant required, not by assuming every database implements the same name identically.",
        "MEDIUM",
        ["transactions", "isolation"]
      ),
      q(
        "write-skew",
        "Snapshot isolation and write skew",
        "How can two transactions on different rows jointly violate an invariant?",
        "Under snapshot isolation, two doctors can each see both doctors on call and independently set their own row off call. Because they write different rows, direct write-write conflict detection may not reject either, leaving nobody on call. This is write skew. Serializable execution, explicit locking of the shared decision set, or a redesigned enforceable constraint can prevent it. Snapshot consistency alone is not full serializability.",
        "HARD",
        ["mvcc", "isolation"]
      ),
      q(
        "two-phase-locking",
        "Two-phase locking",
        "How does two-phase locking support serializable schedules?",
        "In the growing phase a transaction acquires locks; after releasing a lock, the shrinking phase permits no new acquisitions. Under the usual locking model this yields conflict serializability. Strict variants retain write locks until commit or abort to avoid exposing uncommitted changes. Locking can cause deadlocks and reduce concurrency, especially for broad predicate access, so lock scope and transaction duration matter.",
        "HARD",
        ["locking", "serializability"]
      ),
      q(
        "mvcc",
        "Multiversion concurrency control",
        "Why can MVCC let readers avoid blocking writers?",
        "MVCC retains multiple row versions and selects visible versions according to a transaction's snapshot and isolation rules. A reader can inspect an older committed version while a writer creates a new one. This reduces certain conflicts but does not eliminate all locks or write conflicts. Long-lived snapshots can prevent cleanup of obsolete versions, increasing storage and maintenance pressure; visibility is engine-specific.",
        "MEDIUM",
        ["mvcc", "concurrency"]
      ),
      q(
        "wal",
        "Write-ahead logging",
        "Why must log records reach durable storage before corresponding data pages?",
        "Write-ahead logging preserves enough ordered information to recover if data pages are only partly written at a crash. The log describing a change must be durable before its page is persisted; commit acknowledgment follows the configured durable-commit protocol. Recovery can redo committed work and handle incomplete work according to the engine design. Logs add write cost, but enable buffering data pages without sacrificing recoverability.",
        "HARD",
        ["recovery", "wal"]
      ),
      q(
        "checkpoint",
        "Checkpoints and recovery time",
        "What does a checkpoint change about crash recovery?",
        "A checkpoint records a recovery reference point and coordinates relevant page or log state so recovery need not start from the beginning of all history. It does not necessarily stop all writes or make a backup by itself; modern engines may use fuzzy checkpoints. Frequent checkpoints can reduce recovery work while increasing write pressure. Tune them with workload and recovery objectives rather than treating them as free cleanup.",
        "MEDIUM",
        ["recovery", "checkpoints"]
      ),
      q(
        "index-btree",
        "Why B+ trees suit database indexes",
        "Why use a high-fanout B+ tree rather than an ordinary binary tree on storage?",
        "High fanout reduces tree height and therefore the number of page reads needed for a lookup. Ordered leaf entries and leaf linkage support efficient range scans, while internal pages guide navigation. A binary tree's small fanout can require many more storage-page visits. Indexes improve selected reads but consume space and add maintenance on inserts, updates, and deletes; wide keys reduce fanout.",
        "MEDIUM",
        ["indexes", "storage"]
      ),
      q(
        "query-optimizer",
        "Cost-based query planning",
        "Why can the same query use different plans after data grows?",
        "The optimizer estimates cardinalities and operation costs using statistics, available indexes, and engine rules. A nested-loop plan may be cheap for a few matching rows but expensive for many, where a hash or merge join can win. Stale statistics or correlated columns can distort estimates. Inspect estimated versus actual rows and resource use rather than forcing an index merely because one exists.",
        "MEDIUM",
        ["optimization", "statistics"]
      ),
      q(
        "replication",
        "Replication and stale reads",
        "Why can reading from a replica immediately after a write return old data?",
        "With asynchronous replication, the primary can acknowledge a commit before the replica applies it. A later read routed to that replica may therefore miss the change. Read-your-writes can require primary routing, a replication-position wait, or a suitable consistency mechanism. Synchronous replication improves some guarantees but can add latency and affect availability; the exact acknowledgment policy must be specified.",
        "MEDIUM",
        ["replication", "consistency"]
      ),
      q(
        "partitioning-sharding",
        "Partitioning versus sharding",
        "How do partitioning and sharding affect scaling and access patterns?",
        "Partitioning divides a logical dataset into pieces, potentially within one database; sharding distributes pieces across independently managed nodes or databases. A tenant key can localize most tenant queries, but a large tenant may create skew and cross-tenant reports may need scatter-gather. Splitting storage does not automatically solve global uniqueness or multi-shard transactions. Choose keys from access patterns and growth distribution.",
        "HARD",
        ["scaling", "sharding"]
      ),
      q(
        "backup-restore",
        "Backups and recovery objectives",
        "Why is replication not a complete backup strategy?",
        "Replication can quickly propagate accidental deletes or corruption, so it may faithfully preserve the wrong state. Backups and retained logs support restoration to an earlier point, subject to recovery-point and recovery-time objectives. Test restoration and verify consistency, not only successful backup creation. A usable recovery plan includes access to keys, configuration, and compatible tooling as well as the data artifacts.",
        "MEDIUM",
        ["backup", "operations"]
      ),
    ],
    notes: [
      {
        key: "dbms-foundations",
        title: "Model facts and preserve them under change",
        excerpt: "Connect relational design, keys, normalization, transactions, and recovery.",
        content: `# A database is a shared set of claims

Start by stating what each row means. An Enrollment row might assert that one student is enrolled in one course during one term. Its keys and constraints should encode that meaning. A generated ID is convenient for references but does not prevent two rows from asserting the same forbidden duplicate enrollment.

## Model relationships and dependencies

One-to-many relationships usually place a foreign key on the many side. Many-to-many relationships need an associative relation with any relationship-specific attributes. Functional dependencies express domain rules: if departmentId determines departmentPhone, repeating the phone in employee rows creates avoidable inconsistency.

\`\`\`text
Student(studentId, name)
Course(courseId, title)
Enrollment(studentId, courseId, term, enrolledAt)
Unique business fact: (studentId, courseId, term)
\`\`\`

If repeated attempts in the same term are legal, revise the fact and key rather than forcing data into the earlier model.

## Normalize for authoritative facts

Normalization reduces insertion, update, and deletion anomalies by separating facts according to dependencies. Third normal form often preserves dependencies conveniently. BCNF imposes a stronger determinant condition but can require checks across decomposed relations. Evaluate lossless reconstruction and dependency preservation separately. Denormalization may help a read workload, but it creates synchronization obligations that must be owned explicitly.

## Transactions are not magic

Atomicity coordinates a unit of work, durability governs survival of acknowledged commits, and isolation governs concurrent observations. Consistency depends on declared constraints and correct business logic. A transaction that reads a balance and later writes an absolute replacement can still lose a concurrent update under an unsuitable pattern.

Snapshot isolation can prevent some anomalies while allowing write skew. A cross-row rule such as at least one doctor on call needs serializable behavior or a carefully coordinated shared decision boundary. Specify the invariant first, then select the concurrency mechanism.

## Storage and recovery

Indexes trade extra write work and space for selected access paths. High-fanout trees reduce page visits and support ordered scans. The optimizer chooses plans from estimated cardinalities and costs, which can change as data grows. Write-ahead logging and checkpoints support crash recovery while allowing buffered data pages.

## Operational guarantees

Replication, backups, and partitioning solve different problems. A replica can lag; a replicated deletion is still a deletion; a shard key can create hotspots. Tie architecture to read consistency, recovery objectives, and workload locality. A sound design explains not only how facts are stored but how they remain true during concurrency, failures, and growth.`,
      },
      {
        key: "dbms-modeling-lab",
        title: "Design and analyze a course-registration database",
        excerpt:
          "Practice schema reasoning and transaction traces without accessing a live database.",
        content: `# A paper-first database laboratory

Design a course-registration model using diagrams, example relations, and transaction traces. The exercises can be completed without connecting to a database. Focus on business facts and guarantees before SQL syntax or a particular engine.

## Exercise 1: define facts and keys

List students, courses, offerings, and enrollments. A course describes a subject; an offering is a particular scheduled instance with capacity. Enrollment references the offering, not just the course, if a student can take the subject in different terms. Identify candidate keys and distinguish them from convenient generated IDs.

Write the rule that prevents duplicate active enrollment. If soft deletion or status history exists, decide whether historical rows share the same uniqueness rule. Do not assume a generic unique constraint automatically matches a lifecycle-dependent business rule.

## Exercise 2: dependencies and decomposition

Start with a wide enrollment relation repeating student email, course title, instructor contact, and offering capacity. State which IDs determine each attribute. Split authoritative facts into separate relations and describe how a join reconstructs the original view. Check that the join cannot create false student-offering combinations.

\`\`\`text
Student ID -> student profile
Course ID -> course description
Offering ID -> course ID, term, capacity
(Student ID, Offering ID) -> enrollment fact
\`\`\`

These are assumed business dependencies; a tiny sample dataset alone does not establish them.

## Exercise 3: a capacity race

Suppose an offering has one seat left. Two transactions each read the same remaining capacity and each insert an enrollment. Trace why a snapshot of the count may let both proceed. Propose a coordinated conditional capacity update, a locking protocol, or serializable execution with retries. Explain where the database checks the shared decision and how an aborted attempt releases its reservation.

## Exercise 4: recovery timeline

Draw a log record, commit record, dirty data page, durable log boundary, and crash. Ask which committed changes must be recoverable even if their pages were not written. Then consider an uncommitted page that reached storage and explain why recovery needs more than simply replaying every observed write.

## Exercise 5: access paths

List frequent reads: enrollments by student, roster by offering, and offerings by term. Propose indexes that match those predicates and orderings. Record the added cost for enrollment writes. Explain why an index on every column is not a free improvement.

## Exercise 6: operations review

Define how stale a roster read may be, the maximum acceptable data loss, and the target restoration time. Compare a lagging replica with a point-in-time backup. Finish with a restoration rehearsal plan and a statement of what must be verified after recovery. The design is complete only when its correctness story includes concurrency and failure, not merely a neat ER diagram.`,
      },
      {
        key: "dbms-pitfalls",
        title: "Consistency gaps from schema to operations",
        excerpt:
          "Review inferred keys, isolation assumptions, index costs, and untested recovery plans.",
        content: `# Many failures are missing contracts

An apparently valid schema can permit duplicates, concurrent overbooking, or stale reads because the intended rules were never assigned to an enforcement boundary. Write each invariant and identify whether a key, foreign key, check, transaction protocol, or application workflow enforces it.

## Modeling traps

Observed uniqueness is not a candidate-key proof. Names, emails, and external codes can change or be reused unless the domain forbids it. Comma-separated identifiers bypass relational integrity and complicate queries. A generated primary key does not enforce business uniqueness. Many-to-many relationships often carry their own facts, such as enrollment time or role, which belong in the association.

## Normalization shortcuts

Decomposing columns without dependencies can create spurious tuples when projections are joined. A lossless split may still fail to preserve constraints locally. Conversely, denormalizing repeated facts creates a repair and synchronization burden. Document the authoritative source and update path rather than hoping all copies stay aligned.

\`\`\`text
Schema review:
  What fact does one row assert?
  Which duplicates are forbidden?
  Can references become invalid?
  Can deleting the last child erase an independent fact?
\`\`\`

## Isolation mistakes

Repeatable snapshots do not necessarily prevent write skew. Locking one row does not protect a predicate spanning rows unless the protocol covers competing changes. Serializable systems may abort transactions, so applications need bounded retries that repeat the entire transaction safely. Do not repeat external side effects inside a retry without idempotency or an outbox-style boundary.

## Storage and optimizer mistakes

Every additional index increases write maintenance and consumes space. A wide composite key reduces page fanout. An index can be available but not selected because the optimizer expects a scan to be cheaper. Stale or misleading statistics can cause poor plans; compare estimated and actual cardinalities before forcing a strategy.

Long-lived transactions can retain old MVCC versions and interfere with cleanup. Large transactions also increase lock duration, recovery work, and retry cost. Break work into safe batches only when the business invariant permits partial progress.

## Operational overconfidence

Replication is not a time machine and can propagate accidental damage. A backup that has never been restored is an untested assumption. Checkpointing supports recovery but is not itself a complete backup. Asynchronous replica reads can miss a just-committed change; route critical reads or use a defined synchronization guarantee.

Sharding adds cross-shard uniqueness, transaction, and reporting challenges. Choose a distribution key with actual workload and skew in mind. Conclude with an explicit map from invariants to mechanisms and from failures to recovery actions. That map is more valuable than claiming a database is simply ACID or highly available.`,
      },
    ],
    roadmap: {
      title: "Design for integrity, concurrency, and recovery",
      description:
        "Build a conceptual database design and validate its behavior with transaction and failure traces.",
      estimatedHours: 28,
      steps: [
        {
          title: "Facts and relationships",
          description:
            "Define entities, cardinalities, candidate keys, and enrollment business uniqueness.",
          hours: 4,
        },
        {
          title: "Dependencies and normalization",
          description:
            "Decompose a wide relation and evaluate losslessness, 3NF, BCNF, and preserved constraints.",
          hours: 5,
        },
        {
          title: "Transactions and anomalies",
          description:
            "Trace lost updates, phantoms, and write skew; assign invariant enforcement boundaries.",
          hours: 6,
        },
        {
          title: "Concurrency and recovery",
          description:
            "Compare locking with MVCC and reason about WAL and checkpoint crash timelines.",
          hours: 5,
        },
        {
          title: "Access paths and growth",
          description:
            "Choose indexes, review plan estimates, and evaluate replication lag and shard skew.",
          hours: 4,
        },
        {
          title: "Recovery review",
          description:
            "Define recovery objectives and a restore rehearsal; distinguish backup from replication.",
          hours: 4,
        },
      ],
    },
    cheatSheet: {
      title: "DBMS integrity and recovery checklist",
      content: `# DBMS quick reference

| Topic | Core rule |
| --- | --- |
| Candidate key | Minimal set uniquely identifying a fact under domain rules |
| Foreign key | Referenced fact must exist according to relationship policy |
| Functional dependency | Equal determinant values imply equal dependent values in all valid instances |
| 3NF / BCNF | Reduce dependency anomalies; assess preservation separately |
| Lossless decomposition | Joining projections reconstructs exactly the original relation |
| MVCC | Read versions under visibility rules; cleanup needs old snapshots to end |
| B+ tree | High fanout reduces page visits; leaves support ordered scans |
| WAL | Relevant log information durable before changed pages persist |

\`\`\`text
ACID:
  atomicity: one unit commits or aborts
  consistency: declared invariants remain true
  isolation: concurrency obeys the chosen guarantees
  durability: acknowledged commits survive defined failures
\`\`\`

Dirty read: uncommitted data observed. Nonrepeatable read: a row changes between reads. Phantom: predicate result membership changes. Write skew: separate writes violate a shared invariant under snapshot observations. Serializable execution may require safe whole-transaction retries.

Replication improves distribution or availability but may lag and can replicate damage. Backup plus retained logs can support point-in-time recovery; test restoration against RPO and RTO. Partitioning need not imply multiple machines; sharding introduces distributed boundaries. Indexes cost writes and space. Compare plan estimates with actual cardinalities and define where every business invariant is enforced.`,
    },
    quiz: {
      title: "Database integrity and concurrency",
      questions: [
        mc(
          "What best establishes a functional dependency?",
          [
            "A rule that holds in every valid domain instance",
            "One small table with unique-looking values",
            "The current physical row order",
            "The presence of any index",
          ],
          0,
          "Dependencies are semantic constraints on valid data, not coincidences inferred from a few currently stored rows."
        ),
        mc(
          "How should a student-to-course many-to-many relationship usually be modeled?",
          [
            "A comma-separated course field",
            "An associative enrollment relation",
            "One course column per possible course",
            "A duplicated student row for every attribute",
          ],
          1,
          "An association records each relationship explicitly and can enforce reference validity, uniqueness, and relationship-specific attributes."
        ),
        mc(
          "What does lossless decomposition prevent?",
          [
            "All join computation",
            "Every possible duplicate input",
            "Spurious tuples during reconstruction",
            "All need for foreign keys",
          ],
          2,
          "A lossless join reconstructs exactly the original valid relation rather than inventing combinations that were never facts."
        ),
        mc(
          "Which anomaly can snapshot isolation still permit?",
          [
            "Every dirty read",
            "Arbitrary torn writes",
            "Loss of all committed logs",
            "Write skew across different rows",
          ],
          3,
          "Concurrent transactions can read one snapshot and update disjoint rows, jointly violating a cross-row invariant without a direct write conflict."
        ),
        mc(
          "What is a central benefit of high B+ tree fanout?",
          [
            "Fewer storage-page levels per lookup",
            "No index maintenance on writes",
            "Automatic business validation",
            "Elimination of all range scans",
          ],
          0,
          "More child references per internal page reduce tree height, lowering the number of dependent page visits for navigation."
        ),
        mc(
          "Which order is required by write-ahead logging?",
          [
            "Persist changed pages before any log",
            "Persist relevant log before changed pages",
            "Delete logs before acknowledging commits",
            "Back up every page before every read",
          ],
          1,
          "Recovery needs durable change information before a corresponding data page can reach storage in a potentially partial state."
        ),
        mc(
          "Why may a replica miss a just-committed write?",
          [
            "Primary keys are always random",
            "Normalization removes the row",
            "Asynchronous replication has not applied it yet",
            "Indexes forbid replica reads",
          ],
          2,
          "A primary may acknowledge a commit before a replica catches up, so routing a later read there can violate read-your-writes expectations."
        ),
        mc(
          "Why is replication not sufficient as a backup?",
          [
            "It cannot copy data",
            "It always blocks reads",
            "It requires no storage",
            "It can propagate accidental deletion",
          ],
          3,
          "A replica can mirror damaged state quickly, while independent retained backups and logs can provide an earlier recovery point."
        ),
      ],
    },
  },
  {
    slug: "sql-databases",
    references: [
      {
        title: "SQL tutorial (fetch returned HTTP 403)",
        url: "https://www.w3schools.com/sql/",
        provider: "W3Schools",
      },
      {
        title: "SQL interview guide",
        url: "https://www.interviewbit.com/sql-interview-questions/",
        provider: "InterviewBit",
      },
      {
        title: "SQL language tutorial",
        url: "https://www.geeksforgeeks.org/sql/sql-tutorial/",
        provider: "GeeksforGeeks",
      },
      {
        title: "Relational foundations for SQL",
        url: "https://www.tpointtech.com/dbms-tutorial",
        provider: "Tpoint Tech (JavaTpoint)",
      },
    ],
    questions: [
      q(
        "logical-order",
        "Logical query processing",
        "Why can a SELECT alias often be used in ORDER BY but not WHERE?",
        "Logical processing forms rows through FROM and joins, filters them with WHERE, groups and filters groups, then computes selected expressions and orders the result. WHERE therefore usually cannot refer to an alias created by SELECT, while ORDER BY can. This is a reasoning model, not a claim about the physical execution plan. Dialects have exceptions; use a subquery or CTE when a computed value needs a clear reusable name.",
        "EASY",
        ["queries", "logical-order"]
      ),
      q(
        "null-three-valued",
        "NULL and three-valued logic",
        "Why does comparing a nullable column with NULL using equals fail to find missing values?",
        "NULL represents missing or unknown information, and ordinary comparisons involving it yield UNKNOWN rather than TRUE. WHERE keeps only TRUE rows, so column = NULL does not match missing values; use IS NULL. UNKNOWN also affects NOT and compound conditions. For example, NOT(score > 50) does not include a null score automatically. Decide explicitly whether missing scores should be excluded or handled with a separate condition.",
        "EASY",
        ["null", "predicates"]
      ),
      q(
        "outer-join-filter",
        "Preserving rows in a LEFT JOIN",
        "How can a WHERE filter accidentally turn a LEFT JOIN into an inner-like result?",
        "A LEFT JOIN produces null-extended right-side columns when no match exists. A WHERE condition such as payment.status = 'PAID' rejects those rows because the comparison is UNKNOWN. Put the matching condition in ON if all left rows must remain while only paid right rows attach. This changes meaning, not just optimization. Test a customer with no payments and one with only unpaid payments.",
        "MEDIUM",
        ["joins", "null"]
      ),
      q(
        "join-multiplication",
        "Join cardinality and double counting",
        "Why can joining orders to both items and payments inflate totals?",
        "If an order has three items and two payments, a direct join can create six combinations, repeating each item's amount twice and each payment three times. Aggregate each child relation to one row per order before joining when independent totals are desired. DISTINCT is not a general repair because equal legitimate amounts can be collapsed. Predict the row count from relationship cardinality before computing sums.",
        "MEDIUM",
        ["joins", "aggregation"]
      ),
      q(
        "group-having",
        "WHERE versus HAVING",
        "How do you find customers with at least three paid orders in a period?",
        "Filter individual orders by status and date in WHERE, group by customer, then use HAVING COUNT(*) >= 3. WHERE cannot generally filter an aggregate that has not been formed, and HAVING is not a reason to postpone row filters unnecessarily. If a join can duplicate order rows, first establish one row per order or use the appropriate distinct identity count. State whether customers with zero qualifying orders should appear.",
        "EASY",
        ["aggregation", "grouping"]
      ),
      q(
        "count-null",
        "COUNT variants",
        "How do COUNT(*), COUNT(column), and COUNT(DISTINCT column) differ?",
        "COUNT(*) counts result rows, COUNT(column) counts rows where that expression is non-null, and COUNT(DISTINCT column) counts distinct non-null values in common SQL behavior. After a LEFT JOIN, COUNT(*) can count a preserved parent with no child as one row; COUNT(child.id) yields zero if the child ID is non-null only for actual matches. Choose the expression based on the fact you intend to count.",
        "EASY",
        ["aggregation", "null"]
      ),
      q(
        "exists-not-in",
        "NULL-safe anti-joins",
        "Why can NOT IN return no rows when its subquery includes NULL?",
        "NOT IN combines inequality checks, and an unknown comparison against a null can make the overall predicate UNKNOWN even for a value not otherwise present. A correlated NOT EXISTS tests whether a matching row exists without this null-poisoning behavior. Define how null outer keys should behave and test them explicitly. Filtering nulls from the subquery can also help, but it must match the intended semantics.",
        "MEDIUM",
        ["subqueries", "null"]
      ),
      q(
        "window-group",
        "Window functions versus grouping",
        "How do you attach each employee's department average without collapsing employee rows?",
        "Use AVG(salary) OVER (PARTITION BY department_id), which computes an aggregate across the partition while preserving each input row. GROUP BY department_id returns one row per department instead. Window functions generally operate after row filtering and grouping, so a WHERE filter changes the population averaged. For ordered running calculations, specify the frame and tie behavior rather than relying on a dialect's default.",
        "MEDIUM",
        ["window-functions", "aggregation"]
      ),
      q(
        "ranking-ties",
        "ROW_NUMBER, RANK, and DENSE_RANK",
        "Which ranking function should be used for the top three distinct salary levels?",
        "DENSE_RANK assigns consecutive ranks to distinct salary values, so filtering `rank <= 3` includes everyone in the highest three levels. RANK leaves gaps after ties, and ROW_NUMBER assigns one number per row, requiring a deterministic tie-breaker when row selection matters. Use a subquery or CTE to filter the computed rank in portable SQL. Decide whether the requirement means three employees or three salary levels.",
        "MEDIUM",
        ["window-functions", "ranking"]
      ),
      q(
        "window-frame",
        "Running totals with ties",
        "Why specify ROWS for a per-row running total?",
        "An ordered window's default frame in some databases includes all peers with equal ordering values, so several rows can receive the same jumped total. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW accumulates by row position. Add a unique tie-breaker to ORDER BY so that position is deterministic. RANGE can be correct for peer-group semantics, but it answers a different question.",
        "HARD",
        ["window-functions", "frames"]
      ),
      q(
        "union-all",
        "UNION versus UNION ALL",
        "When is UNION ALL both more correct and cheaper than UNION?",
        "UNION ALL concatenates result bags and preserves duplicates; UNION removes duplicate selected rows, usually requiring extra sorting or hashing. If monthly event partitions are disjoint by design or repeated events are meaningful, UNION ALL avoids accidental data loss and deduplication cost. Compatible column types and positions are still required. Apply an outer ORDER BY if global ordering matters, because branch order does not guarantee result order.",
        "EASY",
        ["set-operations", "duplicates"]
      ),
      q(
        "cte-semantics",
        "CTEs and execution",
        "Does a common table expression guarantee a temporary materialized result?",
        "A CTE gives a named query expression and improves structure, but materialization and optimization depend on the database and version. It may be inlined or act as a materialization boundary under particular rules or directives. A CTE that improves readability is not automatically faster than a subquery. Inspect the plan for repeated work, cardinalities, and predicate pushdown rather than assuming its name implies storage.",
        "MEDIUM",
        ["cte", "optimization"]
      ),
      q(
        "recursive-cte",
        "Traversing hierarchies with recursive SQL",
        "What prevents a recursive organization-chart query from looping forever?",
        "A recursive CTE combines an anchor with a recursive term that expands previously found rows. It needs a termination condition and, when cycles are possible, a visited-path or cycle-detection strategy supported by the dialect. A depth limit bounds work but can silently truncate valid deep hierarchies, so document it. Index the parent reference and decide whether duplicates represent multiple paths or should be removed.",
        "HARD",
        ["recursive-cte", "hierarchies"]
      ),
      q(
        "sargability",
        "Sargable predicates",
        "Why can wrapping an indexed timestamp in a function hurt a date filter?",
        "A predicate such as DATE(created_at) = a date may prevent an ordinary index on created_at from being used as a direct range lookup, depending on the engine. Compare created_at against a start instant and the next day's start instead. This also avoids fragile end-of-day precision assumptions. Expression indexes can support the transformed predicate, but timezone semantics and added index maintenance still matter.",
        "MEDIUM",
        ["indexes", "predicates"]
      ),
      q(
        "composite-index",
        "Composite index ordering",
        "How would you index queries filtering tenant and status then ordering by creation time?",
        "A candidate B-tree index is (tenant_id, status, created_at, id), with equality filters leading and deterministic ordering columns following. Its usefulness depends on actual predicates, selectivity, sort direction, and engine capabilities. An unrelated query filtering only status may not benefit equally because leading-key access matters. Included payload columns can reduce table reads but widen storage and increase write cost.",
        "HARD",
        ["indexes", "query-plans"]
      ),
      q(
        "keyset-pagination",
        "Keyset versus offset pagination",
        "How can a feed paginate efficiently and deterministically as rows change?",
        "Order by a stable composite key such as created_at descending and id descending. After the last seen pair, query rows lexicographically below that pair and limit the page size. This avoids scanning a growing offset and reduces shifting-page problems, but does not provide arbitrary page-number jumps or a fixed snapshot by itself. Encode both cursor fields and keep the comparator identical to the ORDER BY.",
        "HARD",
        ["pagination", "indexes"]
      ),
      q(
        "parameters",
        "Parameterized queries",
        "Why do bound parameters prevent SQL values from changing query structure?",
        "The driver sends the SQL structure separately from parameter values, so a quote or SQL-looking text inside a value remains data. This prevents value-based injection when used correctly and can support plan reuse. Parameters generally cannot stand in for arbitrary identifiers or sort directions; choose those from an allowlist. Validation remains necessary for length, business rules, and authorization even when injection is prevented.",
        "MEDIUM",
        ["security", "parameters"]
      ),
      q(
        "atomic-update",
        "Atomic conditional updates",
        "How can SQL prevent selling inventory that is no longer available?",
        "Use a conditional update such as reducing stock only where stock >= requested quantity, then check the affected-row count within the intended transaction. This avoids a detached read-then-write race for that row. Validate that quantity is positive, and coordinate the order record and stock change atomically. Multi-item orders also need a consistent lock or update order and safe retries to avoid partial allocation or deadlocks.",
        "HARD",
        ["transactions", "concurrency"]
      ),
      q(
        "ddl-dml",
        "DELETE, TRUNCATE, and DROP",
        "How do row deletion, table truncation, and dropping a table differ?",
        "DELETE removes rows and can use a predicate. TRUNCATE removes all rows through a bulk operation with engine-specific locking, trigger, identity, and transactional behavior. DROP removes the table definition and associated objects according to dependency rules. Never assume TRUNCATE is universally nontransactional or has identical cascade behavior across products. For destructive maintenance, inspect the dialect and recovery plan before selecting the faster command.",
        "MEDIUM",
        ["ddl", "dml"]
      ),
      q(
        "plan-review",
        "Reading query-plan evidence",
        "What should you inspect when a query uses an index but remains slow?",
        "Look at actual rows versus estimates, repeated loop counts, sort spills, buffer or page reads, and time spent fetching table rows. An index scan returning most of a table can cost more than a sequential scan, and a nested loop can multiply expensive lookups. Explain the specific bottleneck before adding another index. Use representative parameters and avoid executing writes merely to inspect a plan in an unsafe environment.",
        "HARD",
        ["query-plans", "performance"]
      ),
    ],
    notes: [
      {
        key: "sql-foundations",
        title: "Rows, bags, NULL, and logical processing",
        excerpt: "Understand what a query means before deciding how it should execute.",
        content: `# SQL describes a result, not a loop

Start with the grain: what does one result row represent? A customer, an order, or an order-item combination are different facts. Joins can change grain and multiply rows. Aggregating without understanding this change is a common source of plausible but incorrect totals.

## Logical processing

Think of FROM and joins forming rows, WHERE filtering them, GROUP BY forming groups, HAVING filtering groups, SELECT computing output expressions, and ORDER BY arranging the final result. This model explains many alias and aggregate restrictions, but the optimizer may physically execute a different plan while preserving meaning.

\`\`\`sql
SELECT customer_id, COUNT(*) AS paid_orders
FROM orders
WHERE status = 'PAID'
GROUP BY customer_id
HAVING COUNT(*) >= 3
ORDER BY paid_orders DESC, customer_id;
\`\`\`

The final customer ID breaks ties deterministically. Without an ORDER BY, result order is not a contract.

## Bags and duplicates

SQL results usually preserve duplicates unless an operation explicitly removes them. UNION ALL concatenates rows; UNION deduplicates the selected values. A join of three items and two payments can yield six rows for one order. Preaggregate each independent child set when calculating independent totals. DISTINCT is not a universal repair because equal legitimate amounts may still be separate facts.

## NULL and predicates

Ordinary comparisons involving NULL produce UNKNOWN. WHERE retains TRUE, so use IS NULL for missing values and decide how missing values participate in business logic. COUNT(*) counts rows; COUNT(expression) counts non-null expressions. After a LEFT JOIN, COUNT(child.id) can distinguish zero children from the preserved parent row.

A right-side predicate in WHERE can remove null-extended rows from a LEFT JOIN. Put it in ON when the intent is to preserve every left row while attaching only qualifying right rows. Test both absent children and present-but-nonqualifying children.

## Grouping and windows

Grouping changes grain to one row per group. Window functions retain rows while computing partition-level or ordered values. Ranking requires a tie policy, and running totals require a frame policy. ROWS with a unique ordering key gives a deterministic per-row accumulation; peer-aware RANGE semantics can intentionally produce a different result.

## Portability and types

SQL dialects differ in date operations, boolean representation, recursive syntax, and transactional DDL. Mark dialect-specific examples rather than promising universal syntax. Choose exact decimal types for exact monetary arithmetic and clear timezone conventions for instants. Query correctness begins with these semantic choices, not with an index hint.`,
      },
      {
        key: "sql-query-lab",
        title: "Analyze a reporting and inventory workload",
        excerpt:
          "Use original sample queries to expose join grain, ranking, pagination, and update races.",
        content: `# A query laboratory without live data

Work from a small fictional schema: customers, orders, order_items, payments, and inventory. Use paper tables or a query parser for reasoning; none of these examples needs to run against an existing database. State the SQL dialect before executing anything in a separate learning environment.

## Exercise 1: predict cardinality

Give one order three items and two payments. Enumerate the six joined combinations. Show why summing item amounts directly after joining payments doubles the item total. Rewrite the report with an item subtotal relation and a payment subtotal relation, each grouped by order ID, then join those one-row-per-order results.

## Exercise 2: preserve zero activity

List every customer with a count of paid orders, including zero. Put paid status in the join condition and count a non-null order ID. Compare the result with placing status in WHERE, especially for a customer with only unpaid orders. Explain why COUNT(*) is wrong for the no-match case.

\`\`\`sql
SELECT c.id, COUNT(o.id) AS paid_orders
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id AND o.status = 'PAID'
GROUP BY c.id;
\`\`\`

## Exercise 3: ranking and running totals

Use salaries with ties. Compare ROW_NUMBER, RANK, and DENSE_RANK and decide which answers top three employees versus top three salary levels. For order totals over time, specify ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW and add order ID after timestamp to make tied times deterministic.

## Exercise 4: date predicates and cursors

Describe a day using a half-open timestamp range from its start to the next day's start, with an explicit timezone conversion policy. Avoid an invented final fractional second. For a descending feed, write a cursor condition on created_at and id matching the ordering. Compare its work with a large OFFSET and note that concurrent changes still require a defined consistency policy.

## Exercise 5: safe inventory transition

Model an inventory update that subtracts a positive quantity only where enough stock remains. A zero affected-row count means no allocation occurred, not a successful purchase. Coordinate the order and inventory changes in one transaction boundary. For multiple products, choose a consistent acquisition order and describe how an aborted transaction is retried without duplicating external effects.

## Exercise 6: plan reasoning

Propose an index for tenant, status, and descending creation order. Record which query shapes it helps and which it may not. Predict rows before viewing a plan, then compare estimates and actual counts when using an authorized sandbox later. The exercise is complete when every query has a stated grain, missing-value policy, ordering rule, and concurrency assumption.`,
      },
      {
        key: "sql-pitfalls",
        title: "SQL that looks correct but changes the question",
        excerpt:
          "Catch NULL poisoning, duplicate suppression, unstable pages, and dialect assumptions.",
        content: `# Review semantics before performance

Fast wrong results are especially dangerous because totals and counts can look reasonable. For each query, state what one row represents and why each join preserves or changes that grain. Test missing children, duplicate values, and tied sort keys rather than only tidy sample data.

## NULL poisoning and outer joins

NOT IN with a nullable subquery can reject nonmatching values through UNKNOWN. Prefer a correctly correlated NOT EXISTS when expressing absence, and define null outer-key behavior. A LEFT JOIN followed by a right-side WHERE predicate can discard the rows you intended to preserve. COUNT(*) after an outer join counts the preserved parent row even without a child.

\`\`\`sql
SELECT c.id
FROM customers AS c
WHERE NOT EXISTS (
  SELECT 1
  FROM orders AS o
  WHERE o.customer_id = c.id
);
\`\`\`

This asks whether a matching order exists; it does not compare the customer against an unknown value from an unrelated row.

## Duplicates and ties

DISTINCT removes selected-value duplicates, not necessarily duplicate business entities. Two legitimate payments with the same amount must not be collapsed merely to repair join multiplication. ROW_NUMBER needs a unique tie-breaker when selecting fixed rows. DENSE_RANK counts value levels instead, which may return more rows than the numeric rank cutoff.

## Time and pagination

End-of-day literals depend on timestamp precision and timezone rules. Half-open ranges avoid precision guesswork but still require a correct definition of the day's timezone. Offset pages can shift under inserts and deletes and become expensive at large offsets. Keyset cursors need all ordering fields and a stable comparison; they do not automatically freeze the dataset.

## Plans and indexes

An available index does not guarantee its use or its superiority. Function-wrapped columns may need expression indexes or predicate rewrites. A composite index's leading columns and actual query filters matter. Wider covering indexes reduce some table reads but increase storage and write maintenance. Compare row estimates, loop counts, spills, and page reads rather than celebrating the word index in a plan.

## Mutations and portability

Read-then-write inventory checks can race; use coordinated conditional updates and inspect affected rows. Bind values instead of concatenating them into SQL. Identifiers and sort directions require allowlisted construction, since parameter binding is not a universal syntax substitution mechanism.

TRUNCATE, transactional DDL, CTE materialization, and recursive cycle handling vary by engine. Verify the target version's behavior and never infer destructive-operation safety from another database's rules. A production query review should cover semantics, authorization, concurrency, and execution cost in that order.`,
      },
    ],
    roadmap: {
      title: "Write semantically correct and efficient SQL",
      description:
        "Reason from row grain and NULL behavior through plans and safe transaction patterns.",
      estimatedHours: 27,
      steps: [
        {
          title: "Query semantics",
          description:
            "Practice logical processing, types, NULL predicates, and deterministic ordering.",
          hours: 4,
        },
        {
          title: "Joins and aggregation",
          description:
            "Predict join cardinalities and build zero-preserving reports with correct count expressions.",
          hours: 5,
        },
        {
          title: "Windows and subqueries",
          description:
            "Compare rank functions, explicit frames, NOT EXISTS, and readable CTE composition.",
          hours: 5,
        },
        {
          title: "Access paths and pages",
          description: "Design sargable time ranges, composite indexes, and stable keyset cursors.",
          hours: 5,
        },
        {
          title: "Safe mutations",
          description:
            "Model conditional inventory updates, bound parameters, and transactional effect boundaries.",
          hours: 4,
        },
        {
          title: "Plan and dialect review",
          description:
            "Inspect cardinality evidence and document target-engine differences without destructive execution.",
          hours: 4,
        },
      ],
    },
    cheatSheet: {
      title: "SQL semantics and access-path checklist",
      content: `# SQL quick reference

Logical model: FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY. Physical execution may differ.

| Need | Pattern | Caveat |
| --- | --- | --- |
| Missing values | IS NULL / IS NOT NULL | Equality with NULL is UNKNOWN |
| Preserve all parents | LEFT JOIN with child filter in ON | Right-side WHERE may discard no-match rows |
| Count actual children | COUNT(child.id) | COUNT(*) includes preserved parent rows |
| Absence | Correlated NOT EXISTS | Define null outer keys |
| Independent child totals | Aggregate each child before joining | DISTINCT is not a general repair |
| Top value levels | DENSE_RANK in a subquery | Can return more than k rows |
| Per-row running total | Explicit ROWS frame and unique order | Default peer frames may differ |
| Concatenate bags | UNION ALL | UNION removes duplicate selected rows |

\`\`\`sql
SELECT id, created_at
FROM orders
WHERE created_at >= :start_instant
  AND created_at < :next_start_instant
ORDER BY created_at, id;
\`\`\`

Placeholder spelling depends on the driver. Bind values; allowlist dynamic identifiers and directions. Prefer half-open time ranges with explicit timezone meaning. Composite B-tree indexes often place equality filters before ordering columns, but validate actual plans.

For updates, coordinate the invariant and inspect affected rows. Keyset pagination must match the full ordering tuple. CTE materialization and transactional DDL are engine-specific. Inspect actual versus estimated rows, loop multiplication, spills, and reads before adding indexes. Every query needs a grain, duplicate policy, NULL policy, and deterministic ordering when order matters.`,
    },
    quiz: {
      title: "SQL correctness and query behavior",
      questions: [
        mc(
          "Which predicate finds missing values in a nullable column?",
          ["column IS NULL", "column = NULL", "column <> NULL", "column = UNKNOWN"],
          0,
          "Ordinary comparisons with NULL yield UNKNOWN; IS NULL is the dedicated predicate for testing missing values."
        ),
        mc(
          "Where should a paid-order filter go to preserve customers with no paid orders in a LEFT JOIN?",
          [
            "Only in ORDER BY",
            "In the join's ON condition",
            "Only in a SELECT alias",
            "In WHERE without a null case",
          ],
          1,
          "Filtering matches in ON lets the left customer survive as a null-extended row when no paid order is available."
        ),
        mc(
          "What counts actual matching children after a LEFT JOIN if child IDs are non-null?",
          ["COUNT(*)", "COUNT(parent.id)", "COUNT(child.id)", "SUM(1)"],
          2,
          "COUNT(expression) ignores nulls, so the null-extended no-child row contributes zero when counting child.id."
        ),
        mc(
          "Which rank function returns the top three distinct salary levels without rank gaps?",
          ["ROW_NUMBER", "RANK", "NTILE", "DENSE_RANK"],
          3,
          "DENSE_RANK assigns consecutive numbers to distinct values and gives ties the same rank, matching a value-level cutoff."
        ),
        mc(
          "Why preaggregate items and payments before joining them to orders?",
          [
            "To avoid multiplying independent child rows",
            "To eliminate all foreign keys",
            "To force alphabetical ordering",
            "To remove legitimate equal amounts",
          ],
          0,
          "One subtotal row per order on each side prevents the item-by-payment Cartesian multiplication within each order."
        ),
        mc(
          "Which operation preserves duplicates while concatenating compatible results?",
          ["UNION", "UNION ALL", "INTERSECT", "SELECT DISTINCT"],
          1,
          "UNION ALL keeps every row from both branches, avoiding the duplicate-removal semantics and extra work of UNION."
        ),
        mc(
          "What makes a keyset cursor deterministic for a timestamp-ordered feed?",
          [
            "Only the page size",
            "Only a row count",
            "Timestamp plus a unique tie-breaker matching ORDER BY",
            "A random offset",
          ],
          2,
          "The cursor must contain the full ordering tuple so rows sharing a timestamp are compared consistently across pages."
        ),
        mc(
          "What should follow a conditional stock-decrement update?",
          [
            "Assume the sale succeeded",
            "Run an unrelated count query",
            "Remove the stock predicate",
            "Check the affected-row count",
          ],
          3,
          "A conditional update can legitimately affect zero rows when stock is insufficient; the application must distinguish that from allocation success."
        ),
      ],
    },
  },
];
