import type { TopicContent } from "./types";

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

function quiz(
  question: string,
  options: [string, string, string, string],
  correctIndex: number,
  explanation: string
): QuizQuestion {
  return { question, options, correctIndex, explanation };
}

export const webContent: TopicContent[] = [
  {
    slug: "javascript",
    references: [
      {
        title: "JavaScript learning guide",
        url: "https://www.w3schools.com/js/",
        provider: "W3Schools",
      },
      {
        title: "JavaScript tutorial",
        url: "https://www.geeksforgeeks.org/javascript/javascript-tutorial/",
        provider: "GeeksforGeeks",
      },
      {
        title: "JavaScript interview topics",
        url: "https://www.interviewbit.com/javascript-interview-questions/",
        provider: "InterviewBit",
      },
    ],
    questions: [
      q(
        "js-scope",
        "Bindings and the temporal dead zone",
        "Why does reading a let binding before its declaration fail even though the block has already been entered?",
        "The block creates the binding before executing its statements, but initialization occurs at the declaration. Until then the binding is in the temporal dead zone, so reading it throws a ReferenceError rather than returning undefined. Prefer small scopes and declare values near their first use; replacing let with var merely hides the ordering bug and introduces function-wide scope.",
        "EASY",
        ["scope", "bindings"]
      ),
      q(
        "js-equality",
        "Choosing an equality relation",
        "How would you compare ordinary IDs, detect NaN, and distinguish negative zero?",
        "Use strict equality for ordinary IDs after validating their type; it avoids the conversions performed by loose equality. Number.isNaN tests the numeric NaN value without coercing strings. Object.is considers NaN equal to itself and distinguishes negative zero from zero. A comparison policy should follow the domain: treating the string '7' as ID 7 can accidentally merge unrelated records.",
        "EASY",
        ["equality", "coercion"]
      ),
      q(
        "js-closure",
        "Closures retain bindings",
        "Two callbacks share a counter from an outer function. What state do they actually share?",
        "A closure retains access to lexical bindings, not a frozen copy of each value. Both callbacks observe changes to the same counter binding while separate calls to the factory create separate environments. This supports private state and subscriptions, but a long-lived callback can also retain a large object graph. Unsubscribe and clear unnecessary references when the owning feature is disposed.",
        "MEDIUM",
        ["closures", "memory"]
      ),
      q(
        "js-this",
        "Call-site receivers",
        "Why can passing service.run directly to a timer break a method that uses this?",
        "For a normal function, this depends on how the function is called, not where it was defined. Extracting service.run removes its service receiver; the timer's invocation need not restore it. Pass a wrapper that calls service.run(), or bind the method once. Arrow functions capture lexical this, so using an arrow as an object method is not a universal replacement for receiver-based methods.",
        "MEDIUM",
        ["functions", "this"]
      ),
      q(
        "js-prototypes",
        "Prototype lookup and ownership",
        "How can an object expose a property that is absent from Object.keys(object)?",
        "Property lookup walks the prototype chain after checking own properties. Object.keys returns only enumerable own string keys, so an inherited method or a non-enumerable own property may still be accessible. Use Object.hasOwn when interpreting untrusted records, and avoid assuming that every accessible property belongs to the record. A Map is often clearer for arbitrary user-controlled keys.",
        "MEDIUM",
        ["objects", "prototypes"]
      ),
      q(
        "js-copy",
        "The limits of a shallow copy",
        "Why does copying a settings object with spread not isolate edits to its nested address?",
        "Spread copies the outer object's enumerable own properties into a new object, but nested object values remain shared references. Changing copy.address.city therefore changes the shared address. Clone only the paths that change for predictable immutable updates. structuredClone can handle many built-in data types, but not functions; serializing through JSON also loses values and should not be treated as a universal clone.",
        "EASY",
        ["immutability", "references"]
      ),
      q(
        "js-loop",
        "Tasks, microtasks, and starvation",
        "What runs first after synchronous code: a resolved promise callback or a zero-delay timer?",
        "After the current stack finishes, the host drains the microtask queue before moving to the next timer task, so an already queued promise reaction usually runs before the zero-delay timer. Zero delay is not an exact execution time. A chain that continually adds microtasks can starve rendering and timers; split expensive work into bounded chunks or move CPU-heavy computation to a worker.",
        "MEDIUM",
        ["event-loop", "promises"]
      ),
      q(
        "js-promises",
        "Fail-fast is not cancellation",
        "If Promise.all rejects when one upload fails, what happens to the other uploads?",
        "Promise.all rejects its aggregate result when an input rejects, but it does not cancel operations already started. The remaining uploads may still finish and consume resources. Use AbortController where supported to request cancellation, and design compensating cleanup if partial success matters. Promise.allSettled is better when every outcome must be reported, while bounded concurrency limits resource pressure.",
        "MEDIUM",
        ["promises", "concurrency"]
      ),
      q(
        "js-await",
        "Sequential versus parallel awaits",
        "How would you load an independent profile and catalog without introducing an avoidable waterfall?",
        "Start both operations before awaiting their results, then await Promise.all if both are required. Awaiting the profile before starting the catalog adds their latencies even though no dependency exists. Parallelism is not always better: a downstream service may impose rate limits, and thousands of concurrent requests can exhaust sockets. Use a concurrency limit and preserve sequencing when later work needs earlier output.",
        "MEDIUM",
        ["async", "performance"]
      ),
      q(
        "js-errors",
        "Errors across asynchronous boundaries",
        "Why does a try block around setTimeout not catch an exception thrown later inside its callback?",
        "The try block has completed before the timer callback runs on a later task, so it cannot catch that callback's exception. Catch within the callback or represent the asynchronous operation as a promise and await it within try/catch. Return or await promises so rejection paths remain connected. Classify expected operational failures separately from programming defects instead of swallowing both with a fallback.",
        "MEDIUM",
        ["errors", "async"]
      ),
      q(
        "js-abort",
        "Cancellation and stale results",
        "How should a typeahead prevent old search responses from replacing newer results?",
        "Abort the previous request when a new query starts and also compare a request sequence or query key before committing results. Cancellation is cooperative and may arrive after an operation finishes, so the identity check protects correctness independently. Distinguish aborts from user-visible failures and handle loading state for the active request only; otherwise an older finally block can hide a newer request's spinner.",
        "HARD",
        ["fetch", "race-conditions"]
      ),
      q(
        "js-debounce",
        "Debounce versus throttle",
        "Which policy fits search requests and which fits periodic pointer-position reporting?",
        "Debounce waits for a quiet interval and fits a search field where intermediate text need not trigger a request. Throttle allows work at a bounded cadence and fits telemetry during continuous pointer movement. Decide whether leading or trailing execution is required, and cancel outstanding timers when disposing a view. Neither policy replaces server rate limiting, and excessive debounce can make interactive feedback feel delayed.",
        "MEDIUM",
        ["timers", "events"]
      ),
      q(
        "js-delegation",
        "Event delegation boundaries",
        "How can a list handle clicks for items added after its event listener was registered?",
        "Attach one listener to a stable ancestor and inspect the event's target to locate the relevant item with closest. Confirm that the candidate belongs to that ancestor before acting. Bubbling makes this work for later descendants, but not every event bubbles and shadow DOM can retarget events. Use currentTarget for the registered listener's node and avoid blindly assuming target is the button itself.",
        "MEDIUM",
        ["dom", "events"]
      ),
      q(
        "js-arrays",
        "Iteration and mutation",
        "What makes map different from forEach, and why can async callbacks be misleading?",
        "map produces a new array from each callback's return value; forEach is for side effects and returns undefined. An async map callback returns promises, so await Promise.all on the resulting array when parallel completion is needed. forEach does not await callbacks. Use for...of with await for deliberate sequencing, and avoid mutating the input while iterating unless the iteration semantics are explicitly understood.",
        "EASY",
        ["arrays", "async"]
      ),
      q(
        "js-collections",
        "Map and WeakMap decisions",
        "When would a WeakMap be useful for DOM-node metadata instead of a Map?",
        "A WeakMap can associate metadata with object keys without keeping those keys alive solely because they are in the collection. It suits DOM-node metadata that should disappear when nodes become unreachable. WeakMap is not enumerable and does not expose a size, so it cannot support a reporting dashboard over all entries. Use Map when iteration, primitive keys, or an explicit lifecycle is required.",
        "MEDIUM",
        ["collections", "memory"]
      ),
      q(
        "js-modules",
        "ES module live bindings",
        "Does importing an exported variable capture the value that existed when the module loaded?",
        "An ES module import observes a live binding from the exporting module rather than taking a one-time copy. The importer cannot reassign that binding, although an exported object can still be mutated if its API permits it. Keep modules cohesive and avoid cyclic initialization dependencies: reading an uninitialized export in a cycle can fail. Explicit state-management functions make mutations easier to audit.",
        "MEDIUM",
        ["modules", "state"]
      ),
      q(
        "js-generators",
        "Lazy iteration",
        "Why might a generator be better than building an array of every item in a large sequence?",
        "A generator yields items on demand and retains its execution state between calls, so a consumer can stop early without constructing the entire sequence. This saves memory but moves computation to consumption time and makes the iterator single-use unless a new generator is created. Use an async generator for asynchronous sources and ensure resource cleanup in a finally block when consumers terminate iteration early.",
        "MEDIUM",
        ["iterators", "generators"]
      ),
      q(
        "js-numbers",
        "Money and binary floating point",
        "Why is direct equality on a sum of decimal prices unreliable?",
        "JavaScript Number uses binary floating point, so many decimal fractions have no exact representation and arithmetic can accumulate rounding error. Represent a bounded currency amount in integer minor units or use a decimal library with explicit rounding rules. Validate safe-integer bounds when scaling. BigInt provides integer arithmetic but cannot be mixed directly with Number and needs an explicit serialization policy.",
        "MEDIUM",
        ["numbers", "precision"]
      ),
      q(
        "js-serialization",
        "JSON is a data contract",
        "What should be checked before sending an arbitrary application object through JSON?",
        "Define the wire schema rather than serializing the entire object. JSON omits undefined object fields, converts Dates through their serialization behavior, rejects ordinary BigInt values, and cannot represent cycles. Parse responses into unknown data and validate required fields before use. A deliberate DTO also prevents internal credentials or implementation details from being exposed accidentally during object serialization.",
        "MEDIUM",
        ["json", "validation"]
      ),
      q(
        "js-xss",
        "Text versus executable markup",
        "How should a comments feature render a user's plain-text message safely?",
        "Insert the message through a text-producing API rather than treating it as markup. HTML interpretation can turn untrusted text into executable behavior through browser parsing. If rich text is genuinely required, use a maintained sanitizer with a restricted policy and still validate links. Content Security Policy adds defense in depth but does not replace escaping, safe DOM APIs, or careful handling of dangerous URL schemes.",
        "HARD",
        ["security", "dom"]
      ),
    ],
    notes: [
      {
        key: "js-foundations",
        title: "JavaScript foundations: values, bindings, and execution",
        excerpt: "Build a predictive mental model before memorizing syntax or framework APIs.",
        content: `# Values, bindings, and execution

JavaScript becomes easier to debug when you separate a value from the binding that names it. A primitive assignment copies a value. An object assignment copies a reference to the same object. A constant binding prevents reassignment of that binding; it does not freeze the object's contents. Draw two arrows to the same object when explaining a mutation bug, rather than calling everything a copy.

## Scope and functions

Use block-scoped declarations for new code. A block binding exists before initialization, but reading it too early throws. Function declarations and function expressions have different initialization behavior, so moving a call upward is not a harmless stylistic edit. Closures retain access to outer bindings. Each invocation of a factory gets its own environment, while callbacks created in one invocation can intentionally share state.

\`\`\`javascript
function createCounter(start = 0) {
  let value = start;
  return {
    increment() { value += 1; return value; },
    read() { return value; }
  };
}
const counter = createCounter(4);
counter.increment();
counter.read(); // 5
\`\`\`

The example exposes behavior without exposing the binding. It is not a persistence mechanism: restarting the process loses the value. A normal function's receiver depends on the call site. Arrow functions capture the surrounding receiver, which is useful for callbacks but unsuitable when a method needs a dynamic receiver.

## Objects and comparison

Lookups can reach inherited properties. Enumeration APIs have specific rules about ownership, enumerability, and symbols. Treat network data as records, not as arbitrary objects with trusted methods. Prefer strict equality for identifiers after normalizing their types at a boundary. Use Number.isNaN for NaN and choose Object.is only when its special zero semantics are relevant.

## Execution order

Synchronous statements run until the stack clears. Promise reactions enter the microtask queue; timers enter later tasks. A promise does not move expensive synchronous computation onto another thread. Repeated microtasks can delay rendering, so measure responsiveness as well as total completion time.

Practice by predicting a short program's output before running it. Include one closure, one shared object, and one timer. Explain every result in terms of bindings and scheduling. That explanation is a stronger interview answer than reciting that JavaScript is single-threaded, because browsers and runtimes also provide host facilities outside the JavaScript execution stack.`,
      },
      {
        key: "js-application",
        title: "Applying JavaScript to reliable asynchronous interfaces",
        excerpt: "Design request lifecycles, concurrency limits, and visible state as one system.",
        content: `# Reliable asynchronous interfaces

A search interface is a small distributed system. The user can change intent while a request is in flight, requests can finish out of order, and a successful response can contain invalid data. Start with explicit states: idle, loading, success, empty, and failure. Decide which request owns the visible state before choosing a fetch helper.

## Prevent stale commits

Maintain a monotonically increasing request version. Capture it when starting work and compare it before updating results. Abort the previous request to save resources, but do not use abort as the only correctness mechanism. A request may finish before the abort is observed, and not every downstream operation supports cancellation.

\`\`\`javascript
let version = 0;
async function search(query, signal) {
  const current = ++version;
  const response = await fetch(
    "/api/search?q=" + encodeURIComponent(query),
    { signal }
  );
  if (!response.ok) throw new Error("Search unavailable");
  const result = await response.json();
  if (current !== version) return null;
  return result;
}
\`\`\`

The caller still owns input validation, response validation, cancellation, and rendering. Returning null here means superseded work, not an empty result set. Keep those meanings separate so the interface does not show a misleading empty-state message.

## Choose concurrency deliberately

Start independent requests together when their combined result is required. Promise.all is fail-fast but does not cancel its inputs. Use allSettled for a dashboard that can show partial results. For a large batch, bound the number of active operations rather than creating thousands of promises at once. Preserve sequence for operations such as uploading a file and then publishing its returned identifier.

## Work with events and collections

Delegate list interactions to a stable ancestor when rows are created dynamically. Validate the closest matching target's containment. Debounce text queries when only the final input matters; throttle continuous measurements when periodic progress matters. Dispose listeners and timers when the view is removed.

Represent lookup-heavy data with Map when arbitrary keys and iteration are needed. Use immutable updates when old and new state must be compared, copying the specific nested paths that changed. Test rapid input changes, rejected responses, empty data, and disposal during a request. A reliable interface is defined by these transitions, not just by the successful screenshot.`,
      },
      {
        key: "js-pitfalls",
        title: "JavaScript pitfalls: invisible contracts and resource ownership",
        excerpt: "Review coercion, shallow copies, cleanup, serialization, and unsafe rendering.",
        content: `# Pitfalls at language and host boundaries

Most production JavaScript failures involve a hidden contract: a value was assumed to be a number, a callback was assumed to retain its receiver, or a promise was assumed to cancel other work. Make those assumptions explicit in code review. A correct happy path is not enough when values originate from forms, network responses, storage, or third-party integrations.

## Coercion and numeric precision

Validate and normalize input before arithmetic. An empty string can become zero during numeric conversion, so presence and numeric validity are separate checks. Binary floating point is not exact decimal arithmetic. Store bounded monetary values in integer minor units and specify rounding at conversion boundaries; check the safe-integer range before aggregating large totals.

## Copies and lifetime

Object spread is shallow. If a nested array is shared, pushing into it can change both the old and new state. Copy the changed path or choose an explicit cloning strategy for supported data types. Closures and event listeners can retain objects after the view appears to disappear. Ownership should include a disposal operation that removes listeners, cancels timers, and releases subscriptions.

\`\`\`javascript
function listen(target, handler) {
  target.addEventListener("change", handler);
  return () => target.removeEventListener("change", handler);
}
\`\`\`

Use the returned function exactly when the owning feature ends. A WeakMap can avoid retaining its object keys, but it does not automatically dispose external resources such as sockets or timer callbacks.

## Asynchronous error paths

An outer try block cannot catch an exception in a timer that runs later. Await or return a promise so its rejection remains connected to the caller, and catch inside detached callbacks. Do not replace every failure with an empty array: that hides outages as valid business results. Distinguish abort, invalid input, remote failure, and programmer errors.

## Serialization and rendering

JSON is not a general object-cloning format. Dates, undefined values, BigInt, and cycles require intentional handling. Create a wire representation with only permitted fields and validate it on receipt. Render untrusted plain text as text. Rich markup needs sanitization, and links need a scheme policy even when the label is escaped.

Finish a review with concrete adversarial tests: a stale search response, a copied object with a nested mutation, a huge numeric amount, an unexpected response field, and disposal before completion. Each test should prove one invariant instead of asserting an incidental implementation detail.`,
      },
    ],
    roadmap: {
      title: "JavaScript from execution model to production behavior",
      description:
        "Build a small search-and-results application while explaining each language and lifecycle decision.",
      estimatedHours: 30,
      steps: [
        {
          title: "Model values and scope",
          description:
            "Trace primitives, shared references, block bindings, and equality with small runnable examples.",
          hours: 4,
        },
        {
          title: "Compose functions and modules",
          description:
            "Implement closure-based state, explicit receivers, and cohesive ES modules without initialization cycles.",
          hours: 4,
        },
        {
          title: "Transform and index data",
          description:
            "Compare array transformations, Map lookups, shallow updates, and a validated JSON contract.",
          hours: 4,
        },
        {
          title: "Control asynchronous work",
          description:
            "Build parallel and sequential request flows, bounded concurrency, cancellation, and stale-result protection.",
          hours: 6,
        },
        {
          title: "Integrate browser behavior",
          description:
            "Add delegated events, debounced search, safe text rendering, and resource cleanup.",
          hours: 5,
        },
        {
          title: "Prove resilience",
          description:
            "Test races, numeric boundaries, rejected operations, and memory ownership; document tradeoffs.",
          hours: 7,
        },
      ],
    },
    cheatSheet: {
      title: "JavaScript decision sheet",
      content: `# JavaScript quick decisions

| Need | Choose | Watch for |
| --- | --- | --- |
| Ordinary identifier comparison | Strict equality after normalization | Strings and numbers are different domains |
| Numeric NaN detection | Number.isNaN(value) | Global isNaN performs coercion |
| Distinguish negative zero | Object.is | Strict equality treats both zeros alike |
| Arbitrary key lookup | Map | Object keys are strings or symbols |
| Object-associated ephemeral metadata | WeakMap | No enumeration or size |
| Independent required results | Promise.all | Rejection does not cancel inputs |
| Partial batch results | Promise.allSettled | Inspect every status |
| Sequential dependent operations | for...of with await | Do not use async forEach |
| Quiet-period action | Debounce | Specify trailing behavior and cleanup |
| Bounded periodic action | Throttle | Continuous input still needs feedback |

## Review checklist

- const fixes a binding, not the contents of an object.
- Spread is shallow; copy the changed nested path.
- Closures retain bindings and can retain large graphs.
- Normal-function this follows invocation; bind detached methods deliberately.
- Promise callbacks run as microtasks; a timer is not an exact deadline.
- Abort requests and independently reject stale results.
- Check response.ok before accepting a fetch response as success.
- Validate parsed JSON instead of trusting its apparent shape.
- Use text APIs for user messages and sanitize intentional rich content.
- Store bounded money as integer minor units with an explicit rounding policy.
- Release subscriptions, listeners, and timers when their owner ends.

\`\`\`javascript
const [profile, catalog] = await Promise.all([
  loadProfile(),
  loadCatalog()
]);
\`\`\`

This pattern fits independent operations whose joint success is required. Add a concurrency limit for large batches and define how partial writes are cleaned up.`,
    },
    quiz: {
      title: "JavaScript behavior and design quiz",
      questions: [
        quiz(
          "A nested object is copied using outer spread. What remains shared?",
          [
            "Only primitive fields",
            "The nested object reference",
            "No fields at all",
            "The outer object's identity",
          ],
          1,
          "Spread creates a new outer object but copies the nested reference. Isolating nested edits requires copying that path or using a suitable deeper clone."
        ),
        quiz(
          "What does Promise.all do when one input rejects?",
          [
            "Cancels all network requests",
            "Waits to fulfill with only successes",
            "Rejects the aggregate without automatically cancelling inputs",
            "Converts all failures to undefined",
          ],
          2,
          "The aggregate rejects early, but the operations already started keep running unless their own cancellation mechanism is invoked."
        ),
        quiz(
          "Which comparison is appropriate for detecting the numeric NaN value without coercion?",
          ["Number.isNaN(value)", "value === NaN", "value == NaN", "Boolean(value)"],
          0,
          "Number.isNaN checks for the actual numeric NaN value. NaN is not strictly equal to itself, and truthiness does not identify its type."
        ),
        quiz(
          "What does a closure retain?",
          [
            "A snapshot of every outer value",
            "A copy of the call stack forever",
            "Only global variables",
            "Access to lexical bindings",
          ],
          3,
          "A closure keeps access to its lexical environment. Shared callbacks can observe later changes to a binding in that environment."
        ),
        quiz(
          "Which choice avoids an independent-request waterfall?",
          [
            "Await each request before starting the next",
            "Start both requests and await Promise.all",
            "Wrap both calls in synchronous try only",
            "Run an async forEach and ignore its return",
          ],
          1,
          "Starting the operations first permits overlap. Awaiting each before starting the next adds avoidable latency when neither depends on the other."
        ),
        quiz(
          "Why pair AbortController with a request version check?",
          [
            "Aborts always reorder responses",
            "Versions eliminate every server failure",
            "Cancellation can race with completion",
            "Fetch ignores abort signals by specification",
          ],
          2,
          "Cancellation is cooperative and can arrive too late. Comparing the active version prevents a superseded result from overwriting current state."
        ),
        quiz(
          "Which collection suits metadata tied to otherwise disposable object keys?",
          [
            "WeakMap",
            "Array of strong object references",
            "Set of serialized keys",
            "A globally retained plain object",
          ],
          0,
          "WeakMap does not keep an object key alive solely through the association. It trades away enumeration and size for weak-key lifetime behavior."
        ),
        quiz(
          "How should a plain-text user comment be inserted into the DOM?",
          [
            "As unrestricted markup",
            "Through a string-built script",
            "As an unsanitized template",
            "Through a text-producing API",
          ],
          3,
          "Text APIs keep the comment from being interpreted as markup. Rich content requires a separate sanitization and URL-validation policy."
        ),
      ],
    },
  },
  {
    slug: "typescript",
    references: [
      {
        title: "TypeScript learning guide",
        url: "https://www.w3schools.com/typescript/",
        provider: "W3Schools",
      },
      {
        title: "TypeScript tutorial",
        url: "https://www.geeksforgeeks.org/typescript/typescript-tutorial/",
        provider: "GeeksforGeeks",
      },
      {
        title: "TypeScript interview topics",
        url: "https://www.interviewbit.com/typescript-interview-questions/",
        provider: "InterviewBit",
      },
    ],
    questions: [
      q(
        "ts-erasure",
        "Types are not runtime validators",
        "An API response is asserted as Product. Which guarantees does that assertion provide?",
        "An assertion changes the compiler's interpretation but performs no runtime check. The response can still omit fields or contain wrong values. Receive external data as unknown, validate its structure, and return a typed result only after validation succeeds. This boundary costs some parsing work but prevents a misleading compile-time guarantee from propagating through business logic.",
        "EASY",
        ["runtime", "validation"]
      ),
      q(
        "ts-unknown",
        "Unknown versus any",
        "Why should an untrusted message begin as unknown rather than any?",
        "unknown requires narrowing before property access or calls, keeping uncertainty visible to the compiler. any disables those checks and can contaminate downstream inference. For example, first verify that a message is a non-null object and then validate the required fields. Use a schema for complex contracts; a type annotation alone cannot establish that the sender followed the contract.",
        "EASY",
        ["unknown", "boundaries"]
      ),
      q(
        "ts-narrowing",
        "Control-flow narrowing",
        "How can a function safely accept either a string or a number without assertions?",
        "Use a runtime discriminator such as typeof inside a branch. The compiler narrows the union in each reachable branch, allowing string operations only when the value is a string. Test null separately for object unions because typeof null is object. Prefer evidence-based narrowing over assertions, since assertions can conceal new union members or invalid external values.",
        "EASY",
        ["unions", "narrowing"]
      ),
      q(
        "ts-discriminants",
        "Modeling valid states",
        "Why is a tagged result union safer than optional data and error fields?",
        "A discriminated union can encode success with required data and failure with a required error, using a shared literal tag. Narrowing on that tag makes impossible combinations unrepresentable in ordinary typed code. Optional fields permit both or neither to exist. The union improves callers' handling, but runtime validation is still necessary when the result crosses a network boundary.",
        "MEDIUM",
        ["unions", "modeling"]
      ),
      q(
        "ts-never",
        "Exhaustive handling",
        "How can a compiler check that every payment status is handled in a switch?",
        "After handling all members of a discriminated union, assign the remaining value to never or pass it to a never-accepting helper. Adding a new member then produces an error at that check. This is useful for workflow transitions, but a default branch that silently returns a fallback defeats the check and can hide a newly introduced business state.",
        "MEDIUM",
        ["never", "exhaustiveness"]
      ),
      q(
        "ts-generics",
        "Preserving a relationship",
        "What does a generic identity function express that a union-returning function cannot?",
        "A generic identity function ties the output type to the input type for each call. A string-or-number input with a string-or-number output loses that precise relationship and forces callers to narrow again. Introduce generics when types are related, not merely to replace a concrete name. Excessive unconstrained parameters make APIs harder to understand without adding useful guarantees.",
        "MEDIUM",
        ["generics", "inference"]
      ),
      q(
        "ts-constraints",
        "Constraining useful operations",
        "How can a generic helper read an item's id while preserving its extra fields?",
        "Constrain the parameter to a shape containing id, such as `T extends { id: string }`, and return `T` when the full item should be preserved. The constraint permits reading id while inference retains the caller's additional fields. Do not cast a newly created base object to `T`: callers may supply a subtype with required fields that the helper cannot construct.",
        "MEDIUM",
        ["generics", "constraints"]
      ),
      q(
        "ts-keyof",
        "Safe property access",
        "How should a generic get helper relate an object's key to its returned value?",
        "Use K extends keyof T and return T[K]. The key constraint prevents names absent from T, while indexed access selects the corresponding value type. A return type of T[keyof T] unnecessarily widens every result to all property types. If keys arrive as strings from outside the program, validate them first; keyof is a compile-time description, not an allowlist enforced at runtime.",
        "MEDIUM",
        ["keyof", "indexed-access"]
      ),
      q(
        "ts-mapped",
        "Mapped types for policy",
        "When is a mapped type preferable to duplicating a configuration interface?",
        "A mapped type transforms each key of an existing type, for example making every field readonly or wrapping each value in a validation result. This keeps changes synchronized with the source model. Do not automatically expose every database field through a mapped API type: public contracts often need a deliberate Pick or independent DTO to prevent internal fields from leaking.",
        "MEDIUM",
        ["mapped-types", "api"]
      ),
      q(
        "ts-conditional",
        "Conditional distribution",
        "Why does a conditional type sometimes evaluate separately for each member of a union?",
        "A conditional with a naked type parameter on the checked side distributes over union members. This supports filtering or extracting variants, but can produce surprising unions when the intended test concerns the entire type. Wrapping both sides in tuples suppresses distribution. Write small type-level examples before introducing a complex conditional into a public API.",
        "HARD",
        ["conditional-types", "unions"]
      ),
      q(
        "ts-interface",
        "Interface and type decisions",
        "How would you choose between an interface and a type alias for a library contract?",
        "An interface naturally describes object shapes and supports declaration merging, which can be useful for intentional extension points. A type alias can express unions, tuples, and other compositions directly. Neither choice changes runtime behavior. Prefer a type alias for closed discriminated states and an interface for an intentionally extensible object contract, documenting whether consumer augmentation is supported.",
        "EASY",
        ["interfaces", "types"]
      ),
      q(
        "ts-structural",
        "Structural compatibility",
        "Why can an object with extra fields satisfy a smaller interface in one assignment but fail as a fresh literal?",
        "TypeScript primarily compares structure, so a variable with all required fields can be assigned to a smaller shape. Fresh object literals also receive excess-property checks that catch likely misspellings. This is not exact-object validation. If unknown fields must be rejected at a boundary, configure runtime validation accordingly rather than relying on how the object was written in source.",
        "MEDIUM",
        ["structural-typing", "objects"]
      ),
      q(
        "ts-satisfies",
        "Checking without unnecessary widening",
        "Why use satisfies on a route configuration instead of annotating the whole variable?",
        "satisfies checks that an expression is compatible with a target type while preserving the expression's inferred type rather than replacing it wholesale with that target. Pair it with as const when literal and readonly inference is desired. This gives validation and useful key information, but it remains compile-time only and does not validate a configuration loaded from JSON.",
        "MEDIUM",
        ["satisfies", "inference"]
      ),
      q(
        "ts-readonly",
        "Readonly is not deep freezing",
        "Does Readonly<Settings> prevent a nested array from changing at runtime?",
        "Readonly marks the top-level properties as non-assignable through that typed view; it does not recursively make nested arrays readonly or freeze the runtime object. Model nested readonly structures when that is the intended API, and use runtime freezing only with a deliberate depth policy. Shared mutable aliases can still modify the same object even if one view is readonly.",
        "MEDIUM",
        ["readonly", "immutability"]
      ),
      q(
        "ts-optional",
        "Absent versus explicitly undefined",
        "Why can an omitted optional property differ from a property present with undefined?",
        "At runtime, key existence checks distinguish omission from a present key whose value is undefined. With exactOptionalPropertyTypes enabled, an optional declaration does not automatically permit assigning undefined unless that is included in its value type. This matters for patch operations where omission means leave unchanged. Reading an optional property still requires accounting for undefined.",
        "MEDIUM",
        ["optional-properties", "configuration"]
      ),
      q(
        "ts-indexing",
        "Unchecked indexed access",
        "Why can array indexing need an undefined check even when the element type is string?",
        "An index may be out of range, so the runtime result can be undefined. With noUncheckedIndexedAccess, TypeScript reflects that risk for unchecked indexed reads. Narrow the result or prove a stronger contract through a tuple or validated non-empty collection. A length check does not always provide all desired narrowing, so avoid using a non-null assertion as a substitute for evidence.",
        "MEDIUM",
        ["arrays", "strictness"]
      ),
      q(
        "ts-overloads",
        "Overloads versus unions",
        "When do function overloads communicate more than a single union signature?",
        "Overloads are useful when distinct input shapes imply distinct result types, such as text input returning text and a buffer returning a buffer. The implementation must safely handle the combined cases, and callers see the overload signatures rather than the broad implementation signature. Prefer a simple union parameter when the return type does not vary, reducing maintenance and inference surprises.",
        "MEDIUM",
        ["functions", "overloads"]
      ),
      q(
        "ts-brand",
        "Nominal intent in a structural system",
        "How can types discourage mixing a UserId and an OrderId when both are strings?",
        "Use distinct branded intersection types and expose validated constructors for each ID domain. Branding adds compile-time separation but no runtime tag unless the design explicitly creates one. Keep casts inside trusted constructors after validating the format. Brands improve API clarity, yet a malicious caller or unchecked assertion can bypass them, so authorization must never depend on the brand alone.",
        "HARD",
        ["branding", "domain-modeling"]
      ),
      q(
        "ts-variance",
        "Function parameter safety",
        "Why should a general animal handler not be replaced by a handler accepting only dogs?",
        "The caller of a general animal handler may pass a cat, which a dog-only function cannot safely process. Under strictFunctionTypes, function-valued property parameters are checked contravariantly in relevant cases; method declarations retain a bivariance exception. Prefer explicit callback property types for safety and avoid treating all syntactically similar callable shapes as having identical checking rules.",
        "HARD",
        ["variance", "callbacks"]
      ),
      q(
        "ts-type-import",
        "Type-only module boundaries",
        "Why use import type for a dependency referenced only in annotations?",
        "A type-only import communicates that the dependency is erased and should not create a runtime module dependency. This is particularly important with verbatimModuleSyntax and when separating server-only code from browser bundles. It does not make a runtime value import safe or remove a real side effect dependency. Review emitted behavior and package boundaries rather than relying on naming conventions.",
        "MEDIUM",
        ["modules", "build"]
      ),
    ],
    notes: [
      {
        key: "ts-foundations",
        title: "TypeScript foundations: evidence, inference, and relationships",
        excerpt:
          "Treat the compiler as a checker of program relationships, not a validator of incoming data.",
        content: `# Evidence before assertions

TypeScript checks relationships between values described by types. Most of those descriptions disappear when the program runs. A successful compilation does not prove that an HTTP response, environment variable, or stored document has the expected shape. Place runtime validation at those boundaries and keep uncertainty visible as unknown until the checks succeed.

## Inference and narrowing

Let inference describe local values when it is precise enough. Add annotations at public interfaces so callers see a deliberate contract rather than an accidental implementation detail. Narrow a union with real evidence: typeof, a literal discriminator, property checks, or a validated predicate. Remember that typeof null is object and that a truthiness check may wrongly discard an empty string or zero.

\`\`\`typescript
type Result<T> =
  | { kind: "success"; data: T }
  | { kind: "failure"; message: string };

function describe(result: Result<number>): string {
  if (result.kind === "success") {
    return "Count: " + result.data;
  }
  return result.message;
}
\`\`\`

The tag connects valid fields to valid states. Optional data and error properties would permit ambiguous combinations and force defensive checks throughout every consumer.

## Generic relationships

A generic parameter is valuable when it connects an input to an output or one parameter to another. A property reader should accept K extends keyof T and return T[K], preserving the chosen property's type. A helper constrained to an object with an id can inspect that id without forgetting extra fields. It cannot safely fabricate an arbitrary T merely by constructing the constraint's base shape.

## Structural typing

Compatibility is generally based on required structure. Fresh literals receive additional excess-property checks, but that does not make types exact runtime schemas. Interfaces can intentionally merge; aliases can express closed unions and tuples. Choose based on the contract's extension policy rather than personal preference alone.

Enable strict checking and understand what each additional compiler option changes. Practice by replacing one assertion with a discriminated union or validator. Then add a new union variant and verify that an exhaustive never check identifies each place needing an update. This exercise proves that the model helps future change, not just today's implementation.`,
      },
      {
        key: "ts-application",
        title: "Applying TypeScript to domain and API contracts",
        excerpt: "Keep wire schemas, domain invariants, and UI state distinct but connected.",
        content: `# Model the contract, then implement it

Start an application feature by identifying three different shapes: external input, validated domain data, and public output. A database row is rarely an appropriate public response by default. It may contain private fields, optional relations, or storage-specific representations. Use a deliberate DTO and validate external data before invoking business rules.

## A patch operation

For an account update, omission can mean leave unchanged while a present null can mean clear a field. Model those meanings separately. An optional property is not merely a convenient way to avoid initialization. exactOptionalPropertyTypes can make assignment intent clearer, but runtime validation still has to preserve the distinction between missing and present keys.

\`\`\`typescript
type AccountPatch = {
  displayName?: string;
  biography?: string | null;
};

type SaveState =
  | { kind: "idle" }
  | { kind: "saving"; requestId: string }
  | { kind: "saved"; revision: number }
  | { kind: "failed"; message: string };
\`\`\`

The state model prevents a saved state with no revision and a failure state with no message. A request identifier also supports rejecting a response from a superseded save. Types describe this discipline but do not implement the request ordering automatically.

## Reuse with restraint

Pick and Omit can express intentionally selected subsets. Mapped types are useful for systematic policies, such as readonly configuration or field-level errors. Do not derive every API contract from a database type if that couples clients to internal schema changes. Separate named models often create a more stable boundary than a dense composition of utility types.

Use satisfies for authored configuration that must match a contract while retaining useful inferred information. Use a runtime schema for loaded configuration. A brand can distinguish user IDs from order IDs after validation, but authorization must still check the actual user's access to the referenced resource.

## Test both kinds of guarantees

Compile representative API calls to catch invalid combinations and inference regressions. Run behavior tests for malformed inputs, omitted patch keys, unknown fields, and stale responses. Inspect serialized output for private fields. Type checking and runtime testing answer different questions; a production contract needs both. Prefer a small reusable validator and clear domain types over a large collection of assertions that merely persuades the compiler to stop reporting uncertainty.`,
      },
      {
        key: "ts-pitfalls",
        title: "TypeScript pitfalls: misleading safety and complex abstractions",
        excerpt: "Find the gaps between compiler guarantees, runtime values, and maintenance cost.",
        content: `# Safety that can be accidentally bypassed

Assertions, non-null assertions, and any are escape hatches. Each can be legitimate at a carefully checked boundary, but scattered use hides missing evidence. An assertion does not create a field, a non-null assertion does not prevent an out-of-range array read, and a type-only import does not sanitize a runtime dependency that is imported elsewhere.

## Optional and indexed values

Check an indexed result before using it. A collection described as string[] can still produce undefined for an absent position. noUncheckedIndexedAccess makes that possibility visible. A tuple communicates known positions better, but only when its construction is controlled. For optional properties, distinguish absent from present undefined when key existence affects patch or merge semantics.

## Readonly and aliasing

Readonly is a compile-time view, not a deep runtime freeze. A nested array may remain mutable and another alias may still change the same object. Use nested readonly models to communicate intent and decide whether defensive copying is necessary at an ownership boundary. Freezing everything recursively can be expensive and may interact poorly with objects that require internal mutation.

\`\`\`typescript
type Settings = {
  readonly labels: readonly string[];
};
function firstLabel(settings: Settings): string | undefined {
  return settings.labels[0];
}
\`\`\`

The result explicitly accounts for an empty collection rather than asserting that a label must exist.

## Type-level complexity

Conditional types distribute over unions when the checked side is a naked type parameter. That behavior is useful for selecting members, but not always for testing an entire union. Tuple wrappers can suppress distribution. Keep examples alongside a complex type so its intended results are easy to review. An unreadable type expression is not automatically a stronger design.

Overloads should represent real input-output relationships. Too many overlapping signatures can cause surprising resolution and make implementation changes difficult. Strict function parameter checking also has syntax-sensitive exceptions for methods; do not assume every callback assignment receives the same variance checks.

Review emitted module boundaries, not just source annotations. Type imports disappear, while runtime imports may execute module side effects or pull server dependencies into a client graph. Finish with a boundary audit: where does unknown become trusted, where are assertions concentrated, and which runtime tests would fail if that trust were wrong?`,
      },
    ],
    roadmap: {
      title: "TypeScript contract engineering",
      description:
        "Convert an untyped account workflow into validated inputs, domain states, and stable public contracts.",
      estimatedHours: 28,
      steps: [
        {
          title: "Learn inference and strictness",
          description:
            "Compare inferred literals, annotations, unknown, nullability, and unchecked indexed reads.",
          hours: 4,
        },
        {
          title: "Model valid states",
          description:
            "Replace optional-field state objects with discriminated unions and exhaustive handling.",
          hours: 4,
        },
        {
          title: "Build relational helpers",
          description:
            "Implement constrained generics and key-safe property access without unsafe assertions.",
          hours: 5,
        },
        {
          title: "Design data boundaries",
          description:
            "Validate request data and produce explicit DTOs with missing-versus-null patch semantics.",
          hours: 5,
        },
        {
          title: "Review reusable types",
          description:
            "Apply mapped types, satisfies, and selective branding only where they clarify contracts.",
          hours: 4,
        },
        {
          title: "Verify change safety",
          description:
            "Add a workflow variant, inspect type failures, and test malformed runtime data and serialization.",
          hours: 6,
        },
      ],
    },
    cheatSheet: {
      title: "TypeScript contract checklist",
      content: `# TypeScript quick reference

| Goal | Tool | Limit |
| --- | --- | --- |
| Represent uncertain external data | unknown | Narrow or validate before use |
| Encode mutually exclusive states | Discriminated union | Runtime senders still need validation |
| Check complete branching | never remainder | Silent default fallbacks hide omissions |
| Preserve input-output relationship | Generic parameter | Unrelated parameters add noise |
| Restrict accepted property keys | K extends keyof T | External strings need runtime checks |
| Return a selected property's type | T[K] | Optional properties can include undefined |
| Transform every property | Mapped type | Do not expose private fields accidentally |
| Verify authored configuration | satisfies | It is not a JSON validator |
| Retain literals and readonly inference | as const | It does not freeze runtime values |
| Describe an erased dependency | import type | Real value imports still execute |

\`\`\`typescript
function get<T, K extends keyof T>(value: T, key: K): T[K] {
  return value[key];
}
\`\`\`

## Review reminders

- Prefer evidence-based narrowing to assertions.
- A fresh literal's excess-property check is not exact-object validation.
- Readonly is shallow unless nested structures are modeled explicitly.
- Optional omission and explicit undefined can have different semantics.
- noUncheckedIndexedAccess surfaces potentially absent indexed values.
- Conditional types can distribute over union members; tuple wrappers change that.
- Overloads are useful when the return type genuinely depends on input shape.
- Brands separate domain intent at compile time, not authorization at runtime.
- Use DTOs to isolate public contracts from storage models.
- Validate inputs, test behavior, and compile contracts: none replaces the others.`,
    },
    quiz: {
      title: "TypeScript safety quiz",
      questions: [
        quiz(
          "What does asserting parsed JSON as a domain type do at runtime?",
          [
            "Checks required properties",
            "Rejects extra keys",
            "Nothing by itself",
            "Converts invalid fields",
          ],
          2,
          "A type assertion is erased and does not validate data. A runtime parser or schema must establish the promised domain structure."
        ),
        quiz(
          "Which type requires evidence before arbitrary property access?",
          ["unknown", "any", "object asserted as a record", "A non-null asserted value"],
          0,
          "unknown preserves uncertainty and forces narrowing. any and unchecked assertions can suppress the errors that would reveal an unsafe access."
        ),
        quiz(
          "What makes a tagged union useful for request state?",
          [
            "It makes all fields optional",
            "It performs the network request",
            "It removes all runtime errors",
            "It ties required fields to a specific state",
          ],
          3,
          "A literal discriminator selects a variant whose required fields are known. This avoids ordinary typed construction of contradictory states."
        ),
        quiz(
          "What does K extends keyof T constrain?",
          [
            "The values of every property",
            "The accepted key names",
            "The runtime object's exact keys",
            "The number of properties",
          ],
          1,
          "The constraint limits the type argument to keys described by T. It does not enforce an external object's exact shape at runtime."
        ),
        quiz(
          "Which statement about Readonly<T> is accurate?",
          [
            "It recursively freezes all nested objects",
            "It removes shared aliases",
            "It restricts top-level assignments through that typed view",
            "It serializes objects immutably",
          ],
          2,
          "Readonly is a shallow compile-time transformation. Nested values and other mutable aliases may still permit changes to the runtime object."
        ),
        quiz(
          "Why use an exhaustive never check?",
          [
            "To report unhandled union members when the model grows",
            "To catch every runtime exception",
            "To turn a union into any",
            "To skip validation",
          ],
          0,
          "After all variants are handled, nothing should remain. A newly added variant makes the remainder incompatible with never and exposes missing handling."
        ),
        quiz(
          "What is the main purpose of import type?",
          [
            "To delay a runtime import until first use",
            "To validate the imported module",
            "To make a server value public",
            "To mark a dependency used only in erased type positions",
          ],
          3,
          "A type-only import expresses an erased dependency. It avoids an unnecessary runtime import but does not replace real side-effect imports."
        ),
        quiz(
          "Why can unchecked array indexing return undefined?",
          [
            "Arrays always erase their element type",
            "The requested position may not exist",
            "All strings include undefined",
            "The compiler converts missing values to null",
          ],
          1,
          "An array type does not guarantee a value at every numeric index. Runtime bounds and compiler settings determine how that possibility is handled."
        ),
      ],
    },
  },
  {
    slug: "react",
    references: [
      {
        title: "React learning guide",
        url: "https://www.w3schools.com/react/",
        provider: "W3Schools",
      },
      {
        title: "React tutorial",
        url: "https://www.geeksforgeeks.org/reactjs/react/",
        provider: "GeeksforGeeks",
      },
      {
        title: "React interview topics",
        url: "https://www.interviewbit.com/react-interview-questions/",
        provider: "InterviewBit",
      },
    ],
    questions: [
      q(
        "react-render",
        "Render must be pure",
        "Why should rendering a component not send an analytics event directly?",
        "React may render more than once, interrupt work, or discard a render before committing it. A side effect during render can therefore report an event for UI that never appeared or report duplicates. Keep render as a calculation from props and state; put user-triggered analytics in handlers and synchronization in carefully scoped effects. Purity makes concurrent rendering and testing predictable.",
        "EASY",
        ["rendering", "purity"]
      ),
      q(
        "react-state",
        "State is a render snapshot",
        "Why does reading count immediately after setCount still show the old count in the same handler?",
        "The handler belongs to a render and closes over that render's state snapshot. Calling the setter requests a later render; it does not mutate the existing local variable. Compute a local next value if the handler needs it immediately, or use a functional update when the next state depends on prior state. This distinction explains stale closures without requiring a misleading promise-based model of setters.",
        "EASY",
        ["state", "closures"]
      ),
      q(
        "react-updates",
        "Composing queued updates",
        "How should two increments in one handler reliably add two to the counter?",
        "Use two functional updates, each computing its result from the pending previous value. Two calls using the same captured count plus one may request the same replacement value because the handler's snapshot does not change between calls. Keep updater functions pure because React can invoke them again during development checks. For related fields, a reducer may communicate the transition more clearly.",
        "EASY",
        ["state", "batching"]
      ),
      q(
        "react-keys",
        "Identity and list keys",
        "Why can index keys move a text input's state to the wrong row after reordering?",
        "Keys participate in matching children across renders. An index identifies a position, not the logical item, so a reordered list can reuse a component instance for a different record and preserve the wrong local state. Use a stable ID from the data. Generating random keys during render causes repeated remounts instead, losing state and creating unnecessary work.",
        "MEDIUM",
        ["reconciliation", "keys"]
      ),
      q(
        "react-derived",
        "Derived state without an effect",
        "Should a filtered list be copied into state whenever the query changes?",
        "If the filtered list can be calculated from current items and query, calculate it during render instead of synchronizing a second state variable with an effect. Duplicated state can drift and introduces an extra render with stale output. Memoize only if profiling shows the calculation is expensive and dependencies are stable. Store a snapshot separately only when the product explicitly needs historical data.",
        "MEDIUM",
        ["state", "derived-data"]
      ),
      q(
        "react-effects",
        "Effects synchronize external systems",
        "How do you decide whether logic belongs in an event handler or an effect?",
        "A handler expresses a specific interaction, such as submitting a purchase. An effect synchronizes a rendered state with an external system, such as maintaining a subscription for the selected channel. Moving interaction logic into an effect can accidentally repeat it when dependencies change. Effects are not a general place to run all post-render business logic; first ask whether the calculation can stay in render.",
        "MEDIUM",
        ["effects", "architecture"]
      ),
      q(
        "react-cleanup",
        "Subscription lifecycle",
        "What should an effect do when the selected room changes or the component unmounts?",
        "The effect should return cleanup that disconnects the subscription it created. React runs the old cleanup before the new setup when relevant dependencies change and during unmount. Development Strict Mode may add a setup-cleanup-setup check, exposing missing cleanup. Keep the subscription object scoped to that effect instance so an old cleanup cannot disconnect a newer instance by mistake.",
        "MEDIUM",
        ["effects", "cleanup"]
      ),
      q(
        "react-deps",
        "Dependency honesty",
        "Why is removing a changing value from an effect's dependency list not a safe fix for repeated execution?",
        "The effect closes over values from its render. Omitting a reactive value leaves the effect using an outdated value and breaks its synchronization contract. Restructure the effect, move constants outside the component, or separate event-specific logic rather than suppressing dependency checks. Stabilizing an object may help only when its identity is the actual issue, not when the underlying information genuinely changes.",
        "MEDIUM",
        ["effects", "closures"]
      ),
      q(
        "react-refs",
        "Refs versus state",
        "Where should a timer ID be stored if changing it should not trigger rendering?",
        "A ref can retain mutable information across renders without scheduling a render when its current value changes. It suits timer IDs and imperative handles, whereas visible UI data belongs in state. Avoid reading or writing arbitrary refs during render in ways that change output unpredictably. Cleanup still needs to cancel the timer; using a ref does not create automatic resource disposal.",
        "EASY",
        ["refs", "state"]
      ),
      q(
        "react-input",
        "Controlled form inputs",
        "What contract makes an input controlled, and why avoid switching modes?",
        "A controlled input receives its current value from React state and reports edits through an onChange handler that updates that state. An uncontrolled input keeps its value in the DOM and is initialized with defaultValue. Switching from undefined to a defined value changes the ownership model and can produce warnings or inconsistent behavior. Initialize controlled text state to an empty string and preserve clear ownership.",
        "MEDIUM",
        ["forms", "state"]
      ),
      q(
        "react-reducer",
        "Reducers for related transitions",
        "When is useReducer preferable to several independent state setters?",
        "A reducer is useful when multiple fields must change together according to named transitions, such as starting, completing, or failing an upload. Actions describe intent and the reducer computes the next state without side effects. This centralizes invariants and is easy to test. It adds ceremony for a single independent boolean, so choose it for transition complexity rather than component size alone.",
        "MEDIUM",
        ["reducers", "state-machines"]
      ),
      q(
        "react-context",
        "Context and update fan-out",
        "Why can changing a provider object rerender many consumers even when one field changed?",
        "Context consumers subscribe to the provider's value, and a new value identity can notify them even if they use only one part of that object. Split unrelated contexts, keep state near its users, and stabilize provider values when useful. Memoizing a consumer does not block new context values. For frequent selective updates, a store with subscriptions may fit better than a large global context.",
        "MEDIUM",
        ["context", "performance"]
      ),
      q(
        "react-memo",
        "Memoization is an optimization",
        "Why should correctness not depend on useMemo retaining a computed value forever?",
        "useMemo caches a calculation as an optimization and React may discard that cache under supported circumstances. Put semantic state in state or a suitable owned resource rather than relying on cache persistence. Measure the computation or child rendering cost first, because memoization adds dependency and comparison overhead. Unstable object dependencies can eliminate its benefit while making the code more complicated.",
        "MEDIUM",
        ["memoization", "performance"]
      ),
      q(
        "react-hook",
        "Custom hooks share logic, not instances",
        "Do two calls to the same custom counter hook automatically share one counter?",
        "Each invocation creates its own state and effects in the calling component's hook sequence. A custom hook reuses behavior, not a globally shared state instance. To share state, lift it to a common owner, use context, or use a store with a defined lifetime. Name hooks with the use prefix and keep calls unconditional so React can match their order across renders.",
        "EASY",
        ["hooks", "composition"]
      ),
      q(
        "react-transition",
        "Urgent and non-urgent updates",
        "How can a search UI keep typing responsive while changing a costly result view?",
        "Keep the controlled input update urgent and mark the expensive result update as a transition, or defer the value used by the result view. Transitions allow React to prioritize more urgent work; they do not make CPU work free or cancel network requests automatically. Provide a pending indicator and still handle stale responses. Do not place the controlled input's own value update inside a transition.",
        "HARD",
        ["concurrency", "transitions"]
      ),
      q(
        "react-suspense",
        "Suspense needs a suspending source",
        "Will wrapping an effect-based fetch in Suspense automatically show its fallback?",
        "Suspense responds to rendering that suspends through supported data or code-loading integrations. A normal fetch started in an effect does not itself suspend rendering, so wrapping the component is not enough. Use a framework-supported data pattern or manage loading state explicitly. Choose boundaries around meaningful sections so one slow region does not unnecessarily replace the whole screen.",
        "MEDIUM",
        ["suspense", "data-fetching"]
      ),
      q(
        "react-errors",
        "Error boundary limits",
        "Which failures will a component error boundary not catch automatically?",
        "An error boundary can handle errors thrown while rendering descendants and in supported lifecycle paths, but it does not automatically catch event-handler errors or arbitrary asynchronous callbacks. Handle those locally and convert failures into explicit UI state. A boundary should offer a recovery action and report diagnostics safely, without exposing raw server details to users or repeatedly retrying a permanent failure.",
        "MEDIUM",
        ["errors", "recovery"]
      ),
      q(
        "react-hydration",
        "Server-client initial agreement",
        "Why can Date.now during initial rendering cause hydration mismatches?",
        "The server output and the browser's first render may compute different values, so React cannot reliably match their expected trees. Pass a stable value from the server or show a consistent initial placeholder and update time after hydration. Locale, random values, and browser-only storage can create similar mismatches. Suppressing a warning is not a general fix for divergent initial rendering logic.",
        "MEDIUM",
        ["hydration", "ssr"]
      ),
      q(
        "react-external",
        "External stores and consistent snapshots",
        "Why use useSyncExternalStore instead of an ad hoc effect subscription for an external mutable store?",
        "useSyncExternalStore provides a subscription and snapshot contract designed for consistent reads with concurrent rendering. The snapshot should remain stable when the store has not changed, and server rendering needs an appropriate server snapshot. A homemade effect subscription can miss changes between rendering and subscription. This API integrates an external store; it does not decide the store's business model or ownership.",
        "HARD",
        ["external-store", "concurrency"]
      ),
      q(
        "react-testing",
        "Behavior-focused component tests",
        "How should a test verify a form submission without depending on internal hook state?",
        "Interact through the rendered form using accessible names, enter values, submit, and assert visible pending, success, or error behavior. Mock the external boundary rather than the state hook. Cover a validation failure and a rejected request so lifecycle bugs are exposed. Avoid tests that inspect private component variables or arbitrary class names, since those couple correctness to refactoring details.",
        "MEDIUM",
        ["testing", "accessibility"]
      ),
    ],
    notes: [
      {
        key: "react-foundations",
        title: "React foundations: pure rendering and stable identity",
        excerpt:
          "Understand snapshots, ownership, and reconciliation before optimizing components.",
        content: `# Rendering is a calculation

A React component describes UI from its current props and state. Rendering should be pure: no requests, subscriptions, or mutation of external objects merely because the component function ran. React can retry, interrupt, or discard rendering. Side effects belong to explicit interactions or synchronization with an external system, not to the calculation itself.

## State snapshots

Each render sees a snapshot of state. Its handlers retain that snapshot even after a setter requests another render. When a next value depends on previous state, use a functional updater. Keep updater functions pure. For several related fields, describe transitions through a reducer instead of issuing setters that can temporarily produce invalid combinations.

\`\`\`typescript
type CounterAction = { type: "increment" } | { type: "reset" };
function reduceCount(count: number, action: CounterAction): number {
  switch (action.type) {
    case "increment": return count + 1;
    case "reset": return 0;
  }
}
\`\`\`

This example is a transition function, not a place to send analytics or persist data. The component or service that dispatches an action owns those external concerns.

## Identity and ownership

State belongs to a component's position and identity in the rendered tree. Stable keys help React match logical list items across changes. Index keys identify positions and can attach local state to the wrong record after sorting. Random keys force remounting and throw away state. Define component functions at stable module scope rather than creating new component types inside a parent's render.

Place state at the nearest owner that needs to coordinate it. Derive filtered lists or totals from source state when possible. Copying derived data into a second state variable creates synchronization work and a chance for drift. Context transports a value through the tree; it does not automatically provide selective subscriptions or isolate unrelated updates.

## Hooks and refs

Call hooks unconditionally at the top level so their order remains stable. Custom hooks share logic, while each invocation retains its own state. Refs hold mutable information that does not drive rendering, such as a timer handle. Visible data belongs in state.

Practice by explaining why a reordered editable list preserves or loses each field. Then change the key policy and predict the outcome before testing. This teaches identity more effectively than memorizing reconciliation terminology alone.`,
      },
      {
        key: "react-application",
        title: "Applying React to an accessible request-driven form",
        excerpt:
          "Connect user intent, request ownership, and external synchronization without duplicated state.",
        content: `# Build a form as a state machine

A reliable form has more states than submitted and not submitted. Model editing, submitting, saved, and failed states, plus field validation where needed. Decide whether a later submission supersedes an earlier one and whether edits are allowed while a save is in flight. Those product rules should determine state transitions before selecting hooks.

## Separate interaction from synchronization

The submit handler validates data and invokes the service because submission is a specific user action. An effect should not watch a submitted boolean and silently trigger the mutation again when unrelated dependencies change. Effects are better suited to maintaining a subscription or synchronizing an external widget with rendered state.

\`\`\`typescript
type SaveResult =
  | { ok: true; revision: number }
  | { ok: false; message: string };

async function submitDraft(text: string): Promise<SaveResult> {
  if (text.trim().length === 0) {
    return { ok: false, message: "Enter a draft before saving." };
  }
  const response = await fetch("/api/drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  if (!response.ok) {
    return { ok: false, message: "The draft could not be saved." };
  }
  const data: unknown = await response.json();
  if (typeof data !== "object" || data === null ||
      !("revision" in data) || typeof data.revision !== "number") {
    return { ok: false, message: "The save response was invalid." };
  }
  return { ok: true, revision: data.revision };
}
\`\`\`

The caller still owns authentication behavior, request identity, and visible feedback. Keep validation and transport outside presentational components when they are reused.

## Feedback and responsiveness

Use controlled inputs with consistent initial values. Associate labels and errors with fields, preserve keyboard navigation, and announce meaningful completion feedback without moving focus unexpectedly. A pending state should prevent unintended duplicate submissions according to the product policy, not simply disable every interaction.

Keep typing urgent. If rendering results is costly, defer the result value or use a transition for that work, while leaving the input update urgent. A transition is not network cancellation. Use request identity and abort where appropriate.

Test the form through visible behavior: valid save, empty input, rejected response, rapid resubmission, and unmount during a request. Assertions should describe what a user can perceive rather than how many state hooks the implementation happens to use.`,
      },
      {
        key: "react-pitfalls",
        title: "React pitfalls: effects, caches, and concurrent assumptions",
        excerpt:
          "Avoid stale closures, missing cleanup, over-memoization, and incorrect loading boundaries.",
        content: `# Review synchronization before optimization

An effect's dependency list describes the reactive information it uses. Omitting a changing value does not make the effect efficient; it makes the effect observe stale information. First decide whether the work is actually synchronization. Derived calculations belong in render, and interaction-specific mutations usually belong in handlers.

## Cleanup belongs to setup

A subscription effect should create its resource and return cleanup for that exact resource. On a dependency change, React cleans up the old effect before establishing the new one. Strict Mode development checks may perform an extra setup-cleanup cycle, so missing cleanup can appear as duplicate connections. Do not disable the check to hide a lifecycle defect.

\`\`\`typescript
type Connection = { close(): void };
function ownConnection(connection: Connection): () => void {
  return () => connection.close();
}
\`\`\`

This small ownership pattern does not create an effect itself; it illustrates that the disposer should refer to the resource created by its own setup, not whichever connection a global variable points to later.

## Memoization and subscriptions

useMemo and useCallback are optimization tools. They do not provide a semantic guarantee that a cached value will exist forever. Measure before adding them, and remember that new object dependencies can invalidate a cache every render. Context changes still reach consumers even when those consumers are memoized. Split unrelated provider values or choose selective external-store subscriptions for high-frequency state.

## Loading and errors

Suspense responds to a supported source that suspends during rendering. A request started in an ordinary effect does not automatically activate a surrounding fallback. Error boundaries likewise do not automatically catch event-handler exceptions or arbitrary asynchronous callback failures. Handle operational errors at their boundary and convert them into deliberate recovery UI.

## Hydration and scheduling

The server output and first browser render should agree. Randomness, time, locale formatting, and browser-only storage can break that agreement. Use a stable initial representation and update after hydration when needed. Transitions prioritize work but do not make expensive computation disappear or cancel requests.

End a review by testing reordering, rapid prop changes, subscription cleanup, slow requests, and server-client initial agreement. These cases reveal assumptions that a static screenshot cannot. Optimize only after the component's ownership and lifecycle are correct.`,
      },
    ],
    roadmap: {
      title: "React interaction engineering",
      description:
        "Build an accessible editable list and request-driven form with explicit state and lifecycle ownership.",
      estimatedHours: 32,
      steps: [
        {
          title: "Understand pure render",
          description:
            "Predict snapshots, functional updates, and immutable object changes in small components.",
          hours: 4,
        },
        {
          title: "Establish identity",
          description:
            "Build a sortable editable list with stable keys and the nearest shared state owner.",
          hours: 4,
        },
        {
          title: "Model form transitions",
          description:
            "Implement controlled fields, validation, reducer actions, and accessible feedback.",
          hours: 6,
        },
        {
          title: "Own external synchronization",
          description:
            "Create a subscription hook with honest dependencies, cleanup, and request race protection.",
          hours: 6,
        },
        {
          title: "Improve measured responsiveness",
          description:
            "Profile rendering, then apply selective memoization and deferred non-urgent work.",
          hours: 5,
        },
        {
          title: "Verify lifecycle behavior",
          description:
            "Test keyboard flows, rejected requests, list reordering, cleanup, and hydration assumptions.",
          hours: 7,
        },
      ],
    },
    cheatSheet: {
      title: "React ownership and lifecycle sheet",
      content: `# React quick decisions

| Concern | Preferred approach | Common mistake |
| --- | --- | --- |
| Visible changing data | State | Ref updates do not rerender |
| Value derived from current inputs | Calculate during render | Synchronizing duplicate state with an effect |
| Previous-state transition | Functional updater | Reusing one captured snapshot |
| Several related transitions | Reducer | Independent setters permit invalid combinations |
| User-triggered mutation | Event handler | Watching a boolean in an effect |
| External subscription | Effect with cleanup | Omitting dependencies or disposal |
| Stable list identity | Record ID key | Index or random key |
| Logic reuse | Custom hook | Assuming hook calls share one state instance |
| Imperative mutable handle | Ref | Making visible output depend on arbitrary ref mutation |
| Non-urgent result rendering | Transition or deferred value | Deferring the controlled input update |

## Production review

- Render and updater functions must remain pure.
- Each render's handlers observe that render's state snapshot.
- Effects synchronize external systems, not every post-render calculation.
- Setup should return cleanup for the same resource instance.
- Memoization improves cost, not correctness or permanent persistence.
- Context value identity affects update fan-out.
- Suspense requires a supported suspending source.
- Error boundaries do not automatically catch event or detached async errors.
- Initial server and browser output must agree for hydration.
- External mutable stores need a consistent snapshot contract.
- Test user-visible outcomes through accessible controls, not private hook internals.

Before optimizing, draw the owner of every state value, request, timer, and subscription. Unclear ownership is usually a correctness problem before it is a performance problem.`,
    },
    quiz: {
      title: "React state and lifecycle quiz",
      questions: [
        quiz(
          "What does a handler read after requesting a state update in the same render?",
          [
            "The next render's state immediately",
            "That render's existing snapshot",
            "A promise returned by the setter",
            "The DOM's computed state",
          ],
          1,
          "The handler closes over the render snapshot. A setter requests another render rather than rewriting the local value already captured by the handler."
        ),
        quiz(
          "Which key best preserves row identity after sorting?",
          [
            "The array position",
            "A new random number",
            "The row's display label even if duplicated",
            "A stable unique record ID",
          ],
          3,
          "A stable record ID identifies the logical item across positions. Index and random keys can respectively misattach state or force remounts."
        ),
        quiz(
          "Where should a purely derived filtered list usually be computed?",
          [
            "During rendering from current inputs",
            "In a mount-only effect",
            "In a timer ref",
            "In a second synchronized state variable",
          ],
          0,
          "A derived value can be calculated directly. Duplicating it in state introduces synchronization work and possible stale intermediate output."
        ),
        quiz(
          "What should a subscription effect return?",
          [
            "The latest props object",
            "A second subscription",
            "Cleanup for its own subscription",
            "The provider's state setter",
          ],
          2,
          "Cleanup releases the exact resource created by that effect setup. This protects dependency changes, unmounting, and development lifecycle checks."
        ),
        quiz(
          "Do two calls to a custom state hook share a state instance automatically?",
          [
            "Yes, because the hook has one name",
            "No, each invocation has its own state",
            "Only in production",
            "Only if the return value is an object",
          ],
          1,
          "Custom hooks reuse logic, not state instances. Sharing requires a common state owner, context, or an explicit external store."
        ),
        quiz(
          "What must activate a Suspense fallback?",
          [
            "Any promise anywhere in the application",
            "An ordinary fetch in useEffect",
            "A changing ref",
            "Rendering that suspends through a supported source",
          ],
          3,
          "Suspense is connected to suspending rendering. Effect-based fetching alone does not provide that contract and needs explicit loading state."
        ),
        quiz(
          "Why keep a controlled text input update urgent?",
          [
            "Typing should not wait for non-urgent result rendering",
            "Transitions cannot update any state",
            "Urgent updates cancel all requests",
            "Inputs never trigger rerenders",
          ],
          0,
          "The input must reflect editing promptly. Defer the expensive dependent view, not the state that directly controls the input value."
        ),
        quiz(
          "Which error needs explicit local handling rather than automatic error-boundary capture?",
          [
            "A descendant throwing during render",
            "A supported lifecycle error",
            "An event handler's rejected operation",
            "A descendant render calculation failure",
          ],
          2,
          "Error boundaries do not automatically handle event-handler or detached asynchronous failures. Convert those failures into deliberate recovery state."
        ),
      ],
    },
  },
  {
    slug: "nextjs",
    references: [
      {
        title: "Next.js tutorial overview",
        url: "https://www.geeksforgeeks.org/nextjs/nextjs-tutorial/",
        provider: "GeeksforGeeks",
      },
      {
        title: "Next.js interview topics",
        url: "https://www.interviewbit.com/next-js-interview-questions/",
        provider: "InterviewBit",
      },
      {
        title: "Cache Components and explicit caching",
        url: "https://nextjs.org/docs/app/getting-started/caching",
        provider: "Next.js",
      },
    ],
    questions: [
      q(
        "next-routing",
        "App Router file conventions",
        "How do page, layout, and route files serve different purposes in the App Router?",
        "A page exposes UI for a route, a layout provides a shared wrapper for descendant routes, and a route file exports HTTP method handlers using Request and Response. They are not interchangeable. A page and route handler cannot own the same route segment level. Use route groups to organize code without adding URL segments, and keep data and business rules outside these thin entry points.",
        "EASY",
        ["app-router", "routing"]
      ),
      q(
        "next-boundaries",
        "Small client boundaries",
        "Why mark an interactive widget as client instead of marking the whole page?",
        "Pages and layouts are Server Components by default, allowing data access near the source and avoiding unnecessary browser JavaScript. A use client boundary includes its imported client module graph, so placing it high in the tree can increase bundle size. Keep interactive state near the widget and pass only the data it needs. Props crossing the boundary must follow React's serialization contract.",
        "EASY",
        ["server-components", "client-components"]
      ),
      q(
        "next-ssr-client",
        "Client does not mean browser-only rendering",
        "Can a Client Component's initial render safely read window unconditionally?",
        "Client Components can participate in server prerendering for an initial page load, so window is not universally available during their render. Access browser-only APIs in effects or a deliberate client-only loading strategy, and keep the initial output consistent for hydration. The use client directive identifies a module boundary for interactivity, not a promise that every execution occurs only in the browser.",
        "MEDIUM",
        ["hydration", "client-components"]
      ),
      q(
        "next-params",
        "Asynchronous route params",
        "What is the Next.js 16 pattern for reading a dynamic slug passed to a server page?",
        "Treat params as a promise, await it, and then read the slug from the resolved object. Page searchParams are also asynchronous props, while a Client Component can use supported hooks or React use for promise props. Do not teach synchronous params access as the current contract. Validate the slug before repository access because route typing does not establish that the requested resource exists.",
        "EASY",
        ["async-request-apis", "routing"]
      ),
      q(
        "next-request",
        "Cookies and headers are async",
        "How should a server function read cookies and incoming headers in Next.js 16?",
        "Await cookies() and headers() from next/headers before reading their values. These APIs depend on request-time information and cannot be read directly inside an ordinary use cache scope. Incoming headers are read-only. Cookie writes belong in Server Functions or Route Handlers before streaming begins, not during Server Component rendering. Reading a cookie is not equivalent to validating an authenticated session.",
        "MEDIUM",
        ["async-request-apis", "cookies"]
      ),
      q(
        "next-fetch-default",
        "Fetch cache defaults",
        "Is a plain server fetch automatically a persistently cached request in Next.js 16.2.9?",
        "No: do not assume the old force-cache default. The fetch reference describes auto no cache behavior; a static route can still execute a fetch during build and serve prerendered output. Fetch data caching and route-output prerendering are separate questions. In the model without Cache Components, opt in with force-cache or a revalidation policy, and use no-store when request-time freshness is required.",
        "MEDIUM",
        ["fetch", "caching"]
      ),
      q(
        "next-cache-components",
        "Opt-in Cache Components",
        "What changes when cacheComponents is explicitly enabled?",
        "Cache Components is an opt-in configuration model that combines a prerendered shell with cached work and request-time regions. Use use cache for reusable functions or components and set lifetime with cacheLife. Uncached asynchronous or request-dependent regions need appropriate Suspense boundaries. Do not mix in legacy dynamic, revalidate, or fetchCache segment prescriptions as though they were the configuration model for this mode.",
        "HARD",
        ["cache-components", "rendering"]
      ),
      q(
        "next-cache-key",
        "Inputs and cache isolation",
        "How should tenant-specific data be passed to a cached function?",
        "Read and validate request-time identity outside the cache scope, then pass a safe tenant or user identifier as an explicit argument after authorization. Arguments and relevant closed-over values participate in use cache keys. Tags are invalidation labels, not substitutes for isolation keys. Avoid putting secrets or request objects into shared caches; incorrect tenant separation can leak data even when the cache is fast.",
        "HARD",
        ["cache-keys", "multi-tenancy"]
      ),
      q(
        "next-memo",
        "Render memoization versus persistent caching",
        "Why can two identical GET fetches during one render execute once without promising cross-request persistence?",
        "React render-pass fetch memoization can deduplicate matching GET requests while rendering a component tree. That lifetime is different from a persistent data cache or a prerendered route. Route Handlers are outside that component tree and do not inherit its memoization behavior. Explicitly identify the cache layer and its invalidation policy rather than using the word cached for every form of reuse.",
        "MEDIUM",
        ["memoization", "caching"]
      ),
      q(
        "next-revalidate",
        "Stale-while-revalidate",
        "What freshness promise does revalidateTag(tag, 'max') make after a catalog update?",
        "It marks tagged entries stale and uses stale-while-revalidate behavior: a subsequent visitor may receive stale content while replacement data is produced in the background. That suits catalogs where a short freshness delay is acceptable. It is not the same as immediately expiring data for read-your-own-writes. Call it from an allowed Server Action or Route Handler and choose a tag strategy tied to the affected domain data.",
        "MEDIUM",
        ["revalidation", "tags"]
      ),
      q(
        "next-update-tag",
        "Read-your-own-writes",
        "When would updateTag be more appropriate than stale-while-revalidate?",
        "Use updateTag in a Server Action when the writer should see the new data immediately rather than a stale cached value. It immediately expires the tagged data and is limited to Server Actions, unlike revalidateTag which also supports Route Handlers. Invalidate only after a successful mutation, and remember that cache freshness is not a substitute for a database transaction or concurrent-write policy.",
        "MEDIUM",
        ["server-actions", "revalidation"]
      ),
      q(
        "next-route-cache",
        "Route Handler caching",
        "Are GET Route Handlers always cached, and does the answer depend on Cache Components?",
        "Without Cache Components, Route Handlers are not cached by default; a GET can explicitly opt into static caching, while mutation methods are not cached. With Cache Components enabled, GET handlers follow the prerendering model and can be prerendered when they use no uncached or runtime data. State the mode before describing defaults, and keep authentication-dependent responses out of inappropriate shared output caches.",
        "HARD",
        ["route-handlers", "caching"]
      ),
      q(
        "next-actions",
        "Server Actions are entry points",
        "What validation and authorization should a save Server Action perform?",
        "Treat action arguments as untrusted input, validate them with a runtime schema, authenticate the caller, and authorize access to the specific resource before mutation. An action running on the server does not make it private to a trusted UI. Delegate business rules to a service and writes to a repository, return safe errors, and invalidate relevant data after the transaction succeeds.",
        "MEDIUM",
        ["server-actions", "security"]
      ),
      q(
        "next-streaming",
        "Streaming meaningful regions",
        "How can a slow personalized panel avoid blocking a public page shell?",
        "Place the request-dependent panel behind a meaningful Suspense boundary with an accessible fallback and keep the public shell independently renderable. In Cache Components mode this separation is central to mixing cached and runtime work. Suspense provides a loading boundary but does not make arbitrary synchronous code dynamic. Avoid starting independent data operations sequentially before reaching the boundary.",
        "MEDIUM",
        ["streaming", "suspense"]
      ),
      q(
        "next-search",
        "Client search parameters and static rendering",
        "Why wrap a component using useSearchParams in Suspense on a statically rendered route?",
        "The hook reads the browser's search parameters and can require a client-rendered portion up to the nearest Suspense boundary on a static route. A boundary contains that behavior instead of forcing an unnecessarily large client subtree, and production builds can enforce the requirement. Server pages can instead await their searchParams prop when the route's rendering strategy permits request-dependent work.",
        "MEDIUM",
        ["search-params", "suspense"]
      ),
      q(
        "next-errors",
        "Expected errors versus rendering failures",
        "How should an invalid form submission differ from an unexpected render failure?",
        "Return an expected validation result for a user-correctable submission instead of throwing it as an unexpected rendering failure. Use the App Router error boundary conventions for unexpected descendant failures and not-found handling for absent resources. Boundary components offer recovery, but they do not authorize access or automatically sanitize messages. Report diagnostics privately and show stable, non-sensitive user feedback.",
        "MEDIUM",
        ["errors", "forms"]
      ),
      q(
        "next-metadata",
        "Metadata and async inputs",
        "How should a dynamic detail page generate metadata without trusting its URL blindly?",
        "Await the route params in generateMetadata, validate the identifier, and load permitted public data through the shared repository or service. Produce a canonical URL and title based on the resolved resource rather than an arbitrary query string. Metadata generation follows server data rules; it should not expose private content or require a client effect to establish essential indexing information.",
        "MEDIUM",
        ["metadata", "seo"]
      ),
      q(
        "next-proxy",
        "Proxy is not full authorization",
        "What belongs in Next.js 16 Proxy, and where should authoritative access checks remain?",
        "Proxy is the renamed middleware convention and is suitable for request-based redirects, rewrites, and lightweight optimistic checks. It is not intended as a slow database layer or complete session-management solution. Perform authoritative authentication and resource authorization in Server Actions, Route Handlers, and the data-access layer. A navigation redirect alone does not protect direct access to a mutation endpoint.",
        "MEDIUM",
        ["proxy", "authorization"]
      ),
      q(
        "next-navigation",
        "Prefetching is not data permanence",
        "Why can a prefetched navigation feel instant yet still require a deliberate freshness policy?",
        "Prefetching prepares route resources before a click, and client navigation can reuse layouts or router state. This is not a guarantee that every displayed record stays current indefinitely. Treat router reuse, persistent data caching, and server prerendering as separate layers. After a write, choose the appropriate data invalidation and UI refresh behavior, then test actual production navigation rather than relying on development impressions.",
        "MEDIUM",
        ["navigation", "prefetch"]
      ),
      q(
        "next-deploy",
        "Production verification of rendering",
        "Why test a built application when diagnosing caching or hydration behavior?",
        "Development includes HMR behavior and other diagnostics that can differ from production, including fetch reuse across edits. A built application reveals prerendering, required Suspense boundaries, bundle boundaries, and deployment runtime assumptions. Test a public static page, a personalized request-time page, and a post-mutation read. Inspect headers and data access counts instead of judging caching only by how fast a page appears.",
        "HARD",
        ["deployment", "testing"]
      ),
    ],
    notes: [
      {
        key: "next-foundations",
        title: "Next.js 16.2.9 foundations: App Router and request-time data",
        excerpt:
          "Use current server boundaries and asynchronous request APIs, not older synchronous examples.",
        content: `# App Router foundations for Next.js 16.2.9

The App Router connects file conventions to routing and rendering. A page defines route UI, a layout wraps descendants, and a route file defines HTTP handlers. Route groups organize folders without adding URL segments. Keep these entry points thin: repositories access data, services enforce business rules, and components present the permitted result.

## Server and client boundaries

Pages and layouts are Server Components by default. They can access server-only services without sending those implementations to the browser. Add a use client boundary where state, event handlers, or browser APIs are needed. That boundary affects the imported module graph, so moving it to a whole page can unnecessarily enlarge browser bundles.

Client Components can still contribute to server prerendered output on an initial load. Do not read window unconditionally during render. Keep the first server and browser representation consistent and move browser-only synchronization into an appropriate effect.

## Await request APIs

In Next.js 16, await page params and page searchParams. Await cookies() and headers() before reading their values. Client hook APIs have their own contracts; do not conflate a server page's promise prop with a browser hook result.

\`\`\`typescript
import { cookies, headers } from "next/headers";

type Input = { params: Promise<{ slug: string }> };
async function readRequest(input: Input) {
  const { slug } = await input.params;
  const cookieStore = await cookies();
  const headerStore = await headers();
  return {
    slug,
    theme: cookieStore.get("theme")?.value,
    language: headerStore.get("accept-language")
  };
}
\`\`\`

The function reads request information; it does not establish authentication. Validate identifiers and sessions separately. Incoming headers are read-only, and cookie writes belong to permitted Server Functions or Route Handlers before streaming, not to component rendering.

## Distinguish rendering from caching

A Server Component is not automatically a persistently cached database query. A static output can be produced during build even when a plain fetch does not opt into persistent data caching. Decide whether the page is public, request-dependent, or a composition of both. Read the caching guide that matches the cacheComponents setting before choosing directives and segment configuration.`,
      },
      {
        key: "next-application",
        title: "Applying Next.js caching with an explicit freshness contract",
        excerpt: "Separate the opt-in Cache Components model from the model without it.",
        content: `# Cache policy starts with product requirements

Classify each data set by audience, acceptable staleness, and invalidation trigger. A public catalog can tolerate background refresh; a just-saved account preference may require read-your-own-writes. Personalized data must be isolated by validated identity and permission. A cache tag helps invalidate data but does not replace a key that distinguishes tenants or users.

## Choose one configuration model

With cacheComponents enabled, use use cache for reusable functions or components, cacheLife for lifetime, and cacheTag for invalidation labels. Request APIs such as cookies and headers must be read outside an ordinary cache scope. Pass safe validated values as arguments when parameterized caching is appropriate.

\`\`\`typescript
import { cacheLife, cacheTag } from "next/cache";

async function readPublicSummary(category: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("summary:" + category);
  const response = await fetch(
    "https://catalog.example.org/summary/" +
    encodeURIComponent(category)
  );
  if (!response.ok) throw new Error("Summary unavailable");
  return response.text();
}
\`\`\`

The endpoint is illustrative; a real integration needs its own validation and operational policy. The function's argument participates in the cache key. Uncached asynchronous and request-time UI belongs behind meaningful Suspense boundaries so the shell can be delivered without waiting for every personalized region.

Without Cache Components, use the documented fetch cache and revalidation options or the applicable database caching API. Plain fetch is not an automatic force-cache opt-in. A build can nevertheless prerender route output, so measure data caching and output reuse separately. Legacy segment options such as force-dynamic belong to this model, not to Cache Components prescriptions.

## Mutations and verification

Validate and authorize a Server Action, complete the write, and then invalidate affected data. revalidateTag with the max profile uses stale-while-revalidate. updateTag immediately expires data for read-your-own-writes and is available only in Server Actions. Choose the behavior intentionally instead of assuming every invalidation immediately changes every viewer.

Verify a production build using public navigation, personalized requests, and post-write reads. Record which layer served each result: render memoization, data cache, prerendered output, or client router reuse. This makes freshness explainable rather than accidental.`,
      },
      {
        key: "next-pitfalls",
        title: "Next.js pitfalls: stale defaults, security boundaries, and build differences",
        excerpt: "Audit assumptions against the installed 16.2.9 guides before shipping.",
        content: `# Version-sensitive assumptions deserve review

Older Next.js examples often combine synchronous request APIs with caching defaults that no longer describe the installed version. In 16.2.9, await cookies, headers, page params, and page searchParams. Treat the local installed documentation as the version anchor, and distinguish it from general tutorial material that may use a different router or release.

## Multiple meanings of cached

Matching GET fetches can be memoized within a server render pass. That is not cross-request persistence and does not apply to Route Handlers as part of the React tree. Plain fetch does not imply the old force-cache default. A route can still have build-time output, and development HMR can reuse fetch results across edits. These layers explain why a refresh, navigation, and source edit can show different behavior.

Without Cache Components, Route Handlers are uncached by default and GET can explicitly opt into static behavior. With Cache Components, GET follows the prerendering model and pure handlers can be built into static output. Mutation methods are not a shared response-cache strategy. Avoid a blanket statement that every GET is either always cached or always dynamic.

## Request data and isolation

Do not read cookies or headers directly inside an ordinary use cache function. Read them in a request-time region, validate identity, authorize the resource, and pass only appropriate values onward. A shared tag does not distinguish tenants. Never cache an authentication-dependent response under a public key simply because the URL is the same.

\`\`\`typescript
type AuthorizedScope = { tenantId: string; userId: string };
function publicCacheKey(scope: AuthorizedScope, resourceId: string) {
  return scope.tenantId + ":" + resourceId;
}
\`\`\`

This demonstrates an isolation dimension, not an authorization implementation. A real service must establish the scope and ensure that omitted dimensions do not change the permitted result.

## Thin entry points and recovery

Server Actions remain externally reachable mutation entry points. Validate inputs and authorize every resource. Proxy, the renamed middleware convention, can perform lightweight routing checks but is not the full authorization layer. Keep private errors out of client messages.

Place useSearchParams behind Suspense when required by static rendering, and test production builds rather than relying on development alone. Exercise a slow region, a missing resource, an invalid action, and a successful post-write read. Every case should have an explicit loading, recovery, and freshness outcome.`,
      },
    ],
    roadmap: {
      title: "Next.js 16.2.9 App Router delivery",
      description:
        "Build a public catalog and protected editor while documenting rendering mode, authorization, and freshness.",
      estimatedHours: 36,
      steps: [
        {
          title: "Map route conventions",
          description:
            "Create a route plan with pages, layouts, groups, handlers, and error boundaries.",
          hours: 4,
        },
        {
          title: "Set component boundaries",
          description:
            "Keep data on the server and isolate interactive widgets with safe serialized props.",
          hours: 5,
        },
        {
          title: "Handle request-time APIs",
          description:
            "Await route inputs, cookies, and headers; validate identifiers and protect data access.",
          hours: 5,
        },
        {
          title: "Select a caching model",
          description:
            "Compare both configuration modes and implement a documented audience and freshness policy.",
          hours: 8,
        },
        {
          title: "Implement secure writes",
          description:
            "Add validated authorized actions, transactional service calls, and deliberate tag invalidation.",
          hours: 6,
        },
        {
          title: "Verify production navigation",
          description:
            "Build and test streaming, search parameters, personalized isolation, and read-after-write behavior.",
          hours: 8,
        },
      ],
    },
    cheatSheet: {
      title: "Next.js 16.2.9 version-aware sheet",
      content: `# Next.js 16.2.9 quick reference

| Concern | Current rule |
| --- | --- |
| Pages and layouts | Server Components by default |
| Interactive module boundary | use client; minimize its imported graph |
| Browser-only API during initial render | Not guaranteed available in a Client Component |
| Page params and searchParams | Promise props; await on the server |
| cookies and headers | Async request APIs; await before reading |
| Cookie writes | Permitted Server Functions or Route Handlers, before streaming |
| Plain server fetch | Do not assume persistent force-cache default |
| Static output | Can exist independently of a fetch data-cache opt-in |
| Render-pass fetch memoization | Different lifetime from persistent caching |
| Proxy | Renamed middleware convention; not complete authorization |

## Cache Components enabled

- Set cacheComponents explicitly in configuration.
- Use use cache for reusable work, cacheLife for lifetime, and cacheTag for labels.
- Read runtime APIs outside ordinary cache scopes.
- Arguments and relevant closed-over values participate in cache keys.
- Isolate uncached asynchronous regions with meaningful Suspense boundaries.
- GET Route Handlers can prerender when they avoid uncached and runtime data.

## Without Cache Components

- Use the documented fetch caching and revalidation options.
- Route Handlers are not cached by default; GET can opt in.
- Legacy dynamic, revalidate, and fetchCache segment settings belong to this model.

## After a mutation

revalidateTag(tag, "max") permits stale-while-revalidate. updateTag(tag) immediately expires data for read-your-own-writes and is Server Action only. Authorization and database atomicity remain separate requirements.

Test a built application: development HMR, route output, data caches, and client router reuse are different layers.`,
    },
    quiz: {
      title: "Next.js 16.2.9 routing and caching quiz",
      questions: [
        quiz(
          "How should a server page read its dynamic params in Next.js 16?",
          [
            "Read params.slug synchronously",
            "Await params before reading slug",
            "Read them only from window",
            "Treat params as a URLSearchParams instance",
          ],
          1,
          "Dynamic page params follow an asynchronous contract. Await the promise and validate the resolved identifier before accessing domain data."
        ),
        quiz(
          "Which statement about plain server fetch is accurate?",
          [
            "It always opts into force-cache",
            "It makes every route dynamic",
            "Its data-cache default and route prerendering are separate concerns",
            "It has no effect during build",
          ],
          2,
          "Do not assume the older persistent force-cache default. A route may still fetch during build and serve prerendered output."
        ),
        quiz(
          "What enables the Cache Components model?",
          [
            "An explicit cacheComponents configuration setting",
            "Every use client directive",
            "Using GET in any handler",
            "Adding a cookies call",
          ],
          0,
          "Cache Components is an opt-in model. Its directives and runtime-region rules should not be confused with legacy segment configuration."
        ),
        quiz(
          "Where can updateTag be used for immediate expiry?",
          [
            "Only in browser event handlers",
            "Inside any component render",
            "Only in Proxy",
            "In Server Actions",
          ],
          3,
          "updateTag is limited to Server Actions and supports read-your-own-writes. revalidateTag also supports Route Handlers with its documented semantics."
        ),
        quiz(
          "What does revalidateTag(tag, 'max') support?",
          [
            "Automatic transaction rollback",
            "Stale-while-revalidate behavior",
            "Permanent cache deletion with no refetch",
            "Authorization based on tag names",
          ],
          1,
          "The max profile marks data stale so a visitor may receive stale content while regeneration happens. It is not an authorization or transaction mechanism."
        ),
        quiz(
          "Why keep authoritative authorization beyond Proxy?",
          [
            "Proxy cannot read any request data",
            "Proxy prevents all direct endpoint access",
            "Actions and handlers can be accessed independently of navigation redirects",
            "Proxy automatically validates database permissions",
          ],
          2,
          "A routing redirect is not a complete access-control boundary. Protected actions, handlers, and data access must authorize the actual resource."
        ),
        quiz(
          "Can a Client Component render on the server during initial loading?",
          [
            "Yes, client boundaries do not imply browser-only initial rendering",
            "No, use client disables all server output",
            "Only if it has no props",
            "Only in the Pages Router",
          ],
          0,
          "Client Components can participate in prerendered initial output. Browser-only APIs must therefore be handled in a suitable lifecycle or loading strategy."
        ),
        quiz(
          "With Cache Components enabled, what can happen to a pure GET handler?",
          [
            "It must always execute on every request",
            "It becomes a cached POST",
            "It reads cookies during build automatically",
            "It can be prerendered when it avoids uncached and runtime data",
          ],
          3,
          "GET handlers follow the Cache Components prerendering model. Runtime or uncached work changes what can be included in static output."
        ),
      ],
    },
  },
  {
    slug: "nodejs",
    references: [
      {
        title: "Node.js learning guide",
        url: "https://www.w3schools.com/nodejs/",
        provider: "W3Schools",
      },
      {
        title: "Node.js tutorial",
        url: "https://www.geeksforgeeks.org/node-js/nodejs/",
        provider: "GeeksforGeeks",
      },
      {
        title: "Node.js interview topics",
        url: "https://www.interviewbit.com/node-js-interview-questions/",
        provider: "InterviewBit",
      },
    ],
    questions: [
      q(
        "node-runtime",
        "JavaScript and host responsibilities",
        "What does Node add beyond the JavaScript language?",
        "Node provides host facilities such as filesystem access, networking, process management, buffers, and an event-driven runtime. The language defines promises and functions, while the host decides how many external operations are serviced. A promise does not itself create another JavaScript thread. Knowing this boundary explains why an asynchronous socket operation can overlap but a long synchronous loop still blocks request handling.",
        "EASY",
        ["runtime", "event-loop"]
      ),
      q(
        "node-blocking",
        "Blocking request latency",
        "Why does a CPU-heavy loop in one handler delay unrelated clients?",
        "JavaScript callbacks in a typical Node event loop run on the same thread, so a long synchronous callback prevents other ready callbacks from executing. Marking the handler async does not move that computation elsewhere. Partition work into small chunks when appropriate or use workers for CPU-heavy processing. Measure event-loop delay and request tail latency, not only the total throughput of the heavy operation.",
        "MEDIUM",
        ["performance", "cpu"]
      ),
      q(
        "node-pool",
        "The libuv worker pool",
        "Do all asynchronous Node operations use the same background worker pool?",
        "No. Many network operations rely on operating-system readiness mechanisms, while some filesystem, DNS, compression, and cryptographic operations use the libuv worker pool depending on the API. Saturating that shared pool can delay otherwise unrelated work. Measure the actual bottleneck before tuning pool size, and distinguish this pool from worker_threads, which run separate JavaScript execution environments.",
        "HARD",
        ["libuv", "concurrency"]
      ),
      q(
        "node-timers",
        "Scheduling without exact deadlines",
        "Why is setTimeout(callback, 0) not a guarantee that callback runs immediately?",
        "A timer schedules eligibility after a delay; execution still waits for the event loop and other work. Ordering with setImmediate depends on the context, and timer behavior should not be used as a synchronization contract. Use explicit promises or events for dependencies. Excessive nextTick or microtask recursion can starve I/O, so yielding and bounding work are important for responsiveness.",
        "MEDIUM",
        ["timers", "scheduling"]
      ),
      q(
        "node-streams",
        "Streaming versus buffering",
        "Why stream a large download instead of reading the whole file before responding?",
        "Streaming processes bounded chunks and can begin sending data before the complete file is in memory. It reduces peak memory and supports backpressure, but errors can occur after response headers have already been sent. Use a pipeline with proper error and abort handling. Buffering remains reasonable for small bounded payloads that need complete validation or transformation before any bytes are exposed.",
        "MEDIUM",
        ["streams", "memory"]
      ),
      q(
        "node-backpressure",
        "Respecting writable pressure",
        "What should a producer do when writable.write returns false?",
        "The false return indicates that the writable buffer has reached its pressure threshold, so pause producing and resume after drain rather than continuing to append unbounded data. stream.pipeline can coordinate this across stream stages. Backpressure protects memory but does not make a slow consumer fast; enforce deadlines and cancellation so a stalled client cannot retain a resource indefinitely.",
        "MEDIUM",
        ["streams", "backpressure"]
      ),
      q(
        "node-buffer",
        "Bytes and character boundaries",
        "Why can decoding each arbitrary network chunk independently corrupt UTF-8 text?",
        "A multibyte character can be split across chunk boundaries. Decoding each fragment independently can introduce replacement characters or incorrect output. Use a decoder that carries incomplete byte sequences between chunks, or gather a bounded complete message before decoding. Buffer length measures bytes rather than user-visible characters, so define limits according to whether the protocol constrains bytes or text.",
        "MEDIUM",
        ["buffers", "encoding"]
      ),
      q(
        "node-modules",
        "CommonJS and ES modules",
        "How should a package make its module format predictable?",
        "Declare the intended package module type and use matching file extensions and import/export conventions. CommonJS and ES modules have different loading, export, and interoperability behavior, so accidental mixing can fail only when a deployment path executes. Prefer clear package entry points and test supported consumers. TypeScript compilation settings do not automatically make every emitted file compatible with the target runtime.",
        "MEDIUM",
        ["modules", "packages"]
      ),
      q(
        "node-errors",
        "Operational errors and defects",
        "Why should a service distinguish a connection timeout from an invariant violation?",
        "A timeout is an operational failure that may justify a bounded retry or safe unavailable response. An invariant violation indicates incorrect assumptions and needs diagnostics rather than silent continuation. Handle errors where enough context exists to classify them, preserve internal causes in private logs, and expose stable messages. A blanket catch that returns success can corrupt business decisions and erase useful failure signals.",
        "MEDIUM",
        ["errors", "reliability"]
      ),
      q(
        "node-events",
        "EventEmitter error handling",
        "What happens if an EventEmitter emits error without a listener?",
        "An unhandled error event has special behavior and can be thrown, potentially terminating the process. Register error handling before starting the resource and define whether the error closes it, retries it, or fails the owning operation. Also dispose listeners when ownership ends. Raising the listener limit only to silence warnings can conceal repeated subscription leaks rather than fixing them.",
        "MEDIUM",
        ["events", "resources"]
      ),
      q(
        "node-workers",
        "Workers versus processes",
        "When would worker_threads be preferable to another child process?",
        "Workers suit CPU-heavy JavaScript tasks when a separate execution thread and message passing are sufficient, with optional shared-memory designs that require careful synchronization. Child processes offer stronger isolation and can run external executables, but usually have greater startup and communication cost. Neither is a free performance gain: use a bounded pool and account for serialization, failure handling, and cancellation.",
        "HARD",
        ["workers", "processes"]
      ),
      q(
        "node-http",
        "Request body limits",
        "Why must an HTTP API bound a JSON request before parsing it?",
        "Parsing requires CPU and memory, and an attacker or buggy client can submit a body far larger than the domain allows. Enforce byte limits while reading, check content type, and validate the parsed shape before using it. A declared Content-Length is not enough because streaming requests can differ or omit it. Return a stable client error without logging the whole sensitive payload.",
        "MEDIUM",
        ["http", "validation"]
      ),
      q(
        "node-abort",
        "Propagating request cancellation",
        "How should a disconnected client affect downstream work?",
        "Propagate an abort signal to supported downstream requests, streams, and operations, and release owned resources when the caller no longer needs them. Cancellation is cooperative and may race with completion, so correctness must not rely on rollback happening automatically. For writes, define whether work is committed independently or cancelled before commit, and make repeated requests safe through an idempotency policy.",
        "HARD",
        ["cancellation", "http"]
      ),
      q(
        "node-idempotency",
        "Safe retries",
        "How can a payment-creation endpoint avoid duplicate effects when a client retries?",
        "Accept an idempotency key, validate its scope, and atomically associate it with the operation's result so repeated equivalent requests return that result instead of creating another charge. Reject conflicting payloads for the same key and use a documented retention policy. A memory-only key map is insufficient across multiple processes or restarts, and retries should be bounded with backoff and jitter.",
        "HARD",
        ["idempotency", "transactions"]
      ),
      q(
        "node-pools",
        "Database connection budgets",
        "Why can adding application replicas overload the database even when each replica has a small pool?",
        "Every replica contributes its own maximum connections, so the total budget is roughly replicas times per-process pool size plus administrative and other workloads. Unbounded request concurrency can queue behind the pool and increase tail latency. Reuse one appropriately owned pool per process, set acquisition deadlines, and scale with the database's capacity rather than assuming more application instances always improve throughput.",
        "MEDIUM",
        ["database", "pooling"]
      ),
      q(
        "node-shutdown",
        "Graceful shutdown",
        "What sequence should a server follow after receiving a termination signal?",
        "Stop accepting new work, mark readiness false, let bounded in-flight work finish, close owned pools and subscriptions, and exit before the deployment's deadline. Keep a hard timeout for stuck operations and make cleanup idempotent. Calling process.exit immediately can truncate responses or logs, while waiting forever prevents deployment. Coordinate background jobs separately so they are not silently abandoned or duplicated.",
        "MEDIUM",
        ["lifecycle", "deployment"]
      ),
      q(
        "node-config",
        "Validate configuration at startup",
        "Why parse environment configuration once instead of reading strings throughout services?",
        "Environment values are strings or absent, so repeated ad hoc interpretation can make different services disagree about booleans, ports, and timeouts. Validate and normalize configuration in a dedicated module during startup, fail clearly for required invalid values, and expose typed settings. Do not print secret values in diagnostics. Runtime updates require a separate deliberate reload mechanism rather than scattered reads.",
        "EASY",
        ["configuration", "validation"]
      ),
      q(
        "node-logs",
        "Structured request context",
        "How can logs correlate asynchronous work with one request without passing an ID everywhere?",
        "AsyncLocalStorage can carry request context across supported asynchronous paths, letting logging helpers retrieve a request ID and safe metadata. Initialize the context at the request boundary and test integrations that create unusual async resources. Avoid storing large request bodies or mutable shared state in the context. Correlation improves diagnosis but does not excuse logging credentials or personal data.",
        "MEDIUM",
        ["observability", "async-context"]
      ),
      q(
        "node-security",
        "Filesystem and process boundaries",
        "How should a file-export service avoid path traversal and shell injection?",
        "Resolve paths against a controlled root and verify containment after normalization instead of concatenating untrusted filenames. Where commands are necessary, use argument arrays with a non-shell execution API and validate the allowed arguments. Be aware of symlinks and filesystem permissions when defining containment. Escaping a string alone is not a reliable universal policy for every shell and operating system.",
        "HARD",
        ["security", "filesystem"]
      ),
      q(
        "node-testing",
        "Testing lifecycle and failure behavior",
        "What focused tests reveal more than a successful endpoint response?",
        "Test malformed and oversized inputs, downstream timeouts, client cancellation, and shutdown with an in-flight request. Mock external services at clear boundaries while keeping validation and lifecycle logic real. Check that resources close and no late result changes a completed response. A passing happy-path test does not prove concurrency safety or that a process can terminate cleanly during deployment.",
        "MEDIUM",
        ["testing", "reliability"]
      ),
    ],
    notes: [
      {
        key: "node-foundations",
        title: "Node.js foundations: runtime concurrency and data movement",
        excerpt: "Separate asynchronous I/O, CPU work, worker pools, and streams.",
        content: `# Understand the host, not just async syntax

Node runs JavaScript with host APIs for networking, files, processes, and binary data. A typical event loop executes JavaScript callbacks on one thread, while the host and operating system manage other work. Calling an async function does not move a synchronous calculation into a background thread. A long loop still delays unrelated callbacks and increases request latency.

## Concurrency mechanisms

Network readiness is often handled through operating-system facilities. Some filesystem, DNS, compression, and cryptographic APIs use the libuv worker pool. That pool is distinct from worker_threads, which provide separate JavaScript execution environments. Saturating one resource can delay unrelated operations, so measure the specific bottleneck before changing pool sizes or adding replicas.

Timers describe when work becomes eligible, not exact deadlines. The relative behavior of timer and immediate callbacks depends on context. Excessive nextTick or microtask recursion can starve I/O. Use explicit completion signals for dependencies and keep callback work bounded.

## Bytes and streams

Buffers represent bytes, not abstract text characters. UTF-8 characters may span network chunks, so decoding needs to preserve partial sequences. Streaming lets a service process bounded chunks rather than buffering an entire file. Backpressure keeps a fast producer from overrunning a slow consumer, and cancellation releases resources when the consumer disappears.

\`\`\`javascript
import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";

async function copyFile(source, destination, signal) {
  await pipeline(
    createReadStream(source),
    createWriteStream(destination),
    { signal }
  );
}
\`\`\`

The caller must choose trusted paths and decide what to do with a partial destination after failure. Pipeline coordinates stream completion and errors, but it does not make the file operation transactional.

## Module and lifecycle contracts

Declare whether a package is CommonJS or ES module and keep emitted code compatible with the deployment runtime. Initialize reusable resources at a clear ownership boundary. Close pools, sockets, subscriptions, and workers during shutdown.

Practice by comparing a buffered file copy with a streamed copy under a slow destination. Observe memory and elapsed time. Then add a CPU-heavy loop to a request callback and measure unrelated latency. These experiments expose the runtime model more clearly than simply labeling Node non-blocking.`,
      },
      {
        key: "node-application",
        title: "Applying Node.js to a resilient HTTP service",
        excerpt: "Combine validation, deadlines, idempotency, and resource budgets.",
        content: `# A request is an owned operation

Design an HTTP service around explicit boundaries: transport reads bytes, validation establishes a contract, a service enforces business rules, and a repository performs data access. Handlers translate the result into a safe response. This keeps protocol details out of the domain while preserving enough context to classify failures.

## Bound input and work

Limit request bytes before JSON parsing, validate content type, and reject malformed shapes with stable client errors. Limit downstream concurrency and database acquisition time. A small per-process pool can still create too many connections when multiplied by many replicas. Reserve capacity for administration and other workloads.

Give external calls a deadline and propagate cancellation where supported. A disconnected client does not automatically cancel every operation or roll back committed data. Decide whether a write is allowed to finish independently and document the outcome.

\`\`\`javascript
async function loadRemote(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Remote service unavailable");
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}
\`\`\`

Use a validated allowlist or trusted configuration for URLs in a real service; accepting arbitrary client URLs creates additional security risks. The timer belongs to the operation and is released on every completion path.

## Retries and writes

Retry only failures known to be safe to repeat, using bounded backoff with jitter. A mutation needs an idempotency policy when a client may retry after losing the response. Persist the key and result atomically, scope the key to the caller and operation, and reject conflicting payloads. A process-local map cannot provide this guarantee across replicas.

## Observe and stop cleanly

Use structured logs with request IDs and safe error categories. AsyncLocalStorage can carry context, but do not store secrets or entire payloads there. Monitor event-loop delay, pool waits, downstream latency, and cancellation rates.

On termination, stop accepting requests, fail readiness, finish bounded in-flight work, and close resources before a hard deadline. Test this sequence with a slow request. Production reliability is not just serving traffic while healthy; it is also failing clearly, recovering deliberately, and leaving resources in a known state.`,
      },
      {
        key: "node-pitfalls",
        title: "Node.js pitfalls: hidden blocking and incomplete cleanup",
        excerpt: "Review failure paths that only appear under load, cancellation, or deployment.",
        content: `# Hidden blocking is still blocking

An async handler can contain synchronous JSON processing, compression, regular expressions, or CPU loops that block the event loop. Measure tail latency under representative input sizes. Avoid assuming that high throughput on tiny payloads proves the service will remain responsive on large or adversarial ones. Bound payloads and move genuinely CPU-heavy work into an appropriately sized worker pool.

## Resource pressure

Ignoring a writable stream's false return can grow buffers without bound. A stalled client can retain files and sockets unless deadlines and abort paths are implemented. A database pool protects the database only within its configured process; total connections grow with replicas. Queue limits and acquisition deadlines prevent a backlog from becoming an invisible memory problem.

## Failure classification

An EventEmitter error without a listener has special failure behavior. Register listeners before starting the resource. Unhandled rejections and uncaught exceptions should not be treated as harmless logging events after which all application invariants are assumed valid. Report safely and use a controlled recovery or shutdown policy appropriate to the failure.

\`\`\`javascript
function attachResourceError(resource, report) {
  const handler = (error) => report(error);
  resource.on("error", handler);
  return () => resource.off("error", handler);
}
\`\`\`

The owner still decides whether the resource remains usable after an error. Removing a listener while the resource can still emit errors may be unsafe, so shutdown order matters.

## Security and configuration

Validate configuration at startup instead of scattering string conversions through services. Keep secrets out of logs. Resolve filesystem paths within a controlled root and account for symlinks and permissions. Prefer non-shell process execution with validated argument arrays; shell escaping is not a universal cross-platform guarantee.

## Lifecycle verification

Immediate process.exit can truncate logs and responses. Waiting forever for a stuck operation can block a deployment. Build an idempotent cleanup sequence with a hard deadline and include background jobs in its ownership model.

Test malformed requests, slow consumers, pool exhaustion, interrupted streams, duplicate retries, and termination during work. Verify not only the returned status but also closed resources and absence of duplicate effects. These tests should protect business invariants and lifecycle guarantees rather than arbitrary timing assumptions.`,
      },
    ],
    roadmap: {
      title: "Node.js service engineering",
      description:
        "Implement a bounded HTTP export service with safe inputs, streaming, observability, and graceful shutdown.",
      estimatedHours: 34,
      steps: [
        {
          title: "Map runtime behavior",
          description:
            "Compare synchronous CPU work, network I/O, libuv operations, and worker execution.",
          hours: 4,
        },
        {
          title: "Handle bytes and streams",
          description:
            "Build a streamed export with decoding, backpressure, error propagation, and abort support.",
          hours: 6,
        },
        {
          title: "Define HTTP contracts",
          description:
            "Add body limits, schema validation, safe errors, and service/repository separation.",
          hours: 5,
        },
        {
          title: "Control downstream work",
          description:
            "Set deadlines, pool budgets, retry limits, and persistent idempotency behavior.",
          hours: 7,
        },
        {
          title: "Own operational lifecycle",
          description:
            "Add validated configuration, structured request logs, readiness, and bounded shutdown.",
          hours: 5,
        },
        {
          title: "Test under failure",
          description:
            "Exercise cancellation, slow consumers, duplicate writes, resource exhaustion, and termination.",
          hours: 7,
        },
      ],
    },
    cheatSheet: {
      title: "Node.js operational decision sheet",
      content: `# Node.js quick decisions

| Need | Approach | Caveat |
| --- | --- | --- |
| Overlap network I/O | Async host API | Async does not move CPU loops off-thread |
| CPU-heavy JavaScript | Bounded worker pool | Include message and startup costs |
| Strong isolation or external executable | Child process | Validate arguments and avoid an unnecessary shell |
| Large data transfer | Streams and pipeline | Errors can occur after headers are sent |
| Slow writable destination | Respect backpressure | Add timeout and abort policies |
| UTF-8 across chunks | Stateful decoder | Byte count is not character count |
| Request correlation | AsyncLocalStorage | Keep context small and non-sensitive |
| Retry-safe mutation | Persisted idempotency key | Scope and payload must be checked atomically |

## Lifecycle checklist

- Validate environment strings once at startup.
- Declare module format and test emitted code in the deployment runtime.
- Enforce request byte limits before parsing.
- Bound concurrency, database acquisition, and downstream time.
- Multiply pool size by replica count when budgeting connections.
- Register EventEmitter error handling before starting work.
- Propagate cancellation while recognizing that it is cooperative.
- Preserve private error causes but expose stable safe messages.
- On shutdown, fail readiness, stop new work, drain bounded work, and close resources.
- Keep a hard deadline for cleanup and make disposal idempotent.

\`\`\`javascript
try {
  await performWork();
} finally {
  releaseOwnedResource();
}
\`\`\`

The release operation must match the resource's ownership and may itself need to be awaited. Finally is a control-flow tool, not proof that every external effect can be undone.`,
    },
    quiz: {
      title: "Node.js concurrency and lifecycle quiz",
      questions: [
        quiz(
          "What happens to a CPU-heavy loop inside an async request handler?",
          [
            "It automatically runs in libuv",
            "It automatically runs in a worker",
            "It still blocks the JavaScript event loop while executing",
            "It becomes a timer task per iteration",
          ],
          2,
          "Async changes the return and await behavior, not the execution location of synchronous work. Long loops still delay other callbacks."
        ),
        quiz(
          "What should a producer do after writable.write returns false?",
          [
            "Pause until drain or use a coordinating pipeline",
            "Immediately append larger chunks",
            "Assume the write was permanently rejected",
            "Close every stream in the process",
          ],
          0,
          "The false return signals backpressure rather than a permanent write failure. Pausing prevents unbounded buffer growth behind a slow consumer."
        ),
        quiz(
          "Why can decoding each network chunk independently damage UTF-8?",
          [
            "Buffers cannot contain text bytes",
            "Every chunk ends on a character boundary",
            "UTF-8 uses only fixed-width characters",
            "A multibyte character can span chunks",
          ],
          3,
          "Chunk boundaries are transport boundaries, not character boundaries. A stateful decoder retains incomplete bytes until the remaining bytes arrive."
        ),
        quiz(
          "Which resource budget grows when replicas are added?",
          [
            "The maximum string length",
            "Total potential database connections",
            "The number of language keywords",
            "The size of one local timer",
          ],
          1,
          "Each process contributes its own pool. Replica count multiplied by pool size can exceed the database connection budget even with small local pools."
        ),
        quiz(
          "What makes an idempotency record useful across replicas?",
          [
            "A local array of past request IDs",
            "A random key generated after the write",
            "Atomic persistent association of scoped key, payload, and result",
            "Ignoring retries that fail once",
          ],
          2,
          "A persistent atomic record lets all replicas agree on the operation already performed. It must also reject conflicting payload reuse."
        ),
        quiz(
          "What is a sound first step during graceful shutdown?",
          [
            "Stop accepting new work and mark readiness false",
            "Call process.exit before cleanup",
            "Wait forever without a deadline",
            "Increase all pool sizes",
          ],
          0,
          "Removing readiness and stopping admission prevent new work while existing bounded work drains. Resources can then close before the hard deadline."
        ),
        quiz(
          "What can AsyncLocalStorage help carry?",
          [
            "Automatic authorization for every request",
            "A global transaction that never ends",
            "A replacement for error handling",
            "Request correlation context across supported asynchronous paths",
          ],
          3,
          "AsyncLocalStorage can preserve request metadata for logging and tracing. It does not validate permissions or replace explicit failure handling."
        ),
        quiz(
          "Why enforce a byte limit before parsing JSON?",
          [
            "JSON always compresses itself",
            "Parsing large input consumes CPU and memory",
            "Content-Length always proves actual size",
            "Validation only works on tiny strings",
          ],
          1,
          "Input must be bounded while reading because parsing consumes resources. A client-provided length alone is not a complete enforcement mechanism."
        ),
      ],
    },
  },
  {
    slug: "html-css",
    references: [
      {
        title: "HTML learning guide",
        url: "https://www.w3schools.com/html/",
        provider: "W3Schools",
      },
      {
        title: "HTML tutorial",
        url: "https://www.geeksforgeeks.org/html/html-tutorial/",
        provider: "GeeksforGeeks",
      },
      {
        title: "CSS interview topics",
        url: "https://www.interviewbit.com/css-interview-questions/",
        provider: "InterviewBit",
      },
    ],
    questions: [
      q(
        "html-semantics",
        "Semantics before appearance",
        "Why is a native button better than a clickable generic container for an action?",
        "A native button provides keyboard activation, focus behavior, and action semantics by default. A generic clickable container requires those behaviors to be reimplemented and tested, not merely styled. Use links for navigation and buttons for actions. Semantics also improve assistive-technology interpretation and automated testing, while CSS can change appearance without sacrificing the underlying interaction contract.",
        "EASY",
        ["semantics", "accessibility"]
      ),
      q(
        "html-landmarks",
        "Landmarks and heading hierarchy",
        "How should a long document expose its structure to keyboard and screen-reader users?",
        "Use meaningful landmarks and headings that reflect the information hierarchy, with one clear primary content region and distinguishable navigation regions. Headings should communicate sections rather than being chosen solely for font size. A skip link helps users bypass repeated navigation. Good structure improves navigation, but it still needs readable labels and a sensible DOM order rather than only visual grouping.",
        "EASY",
        ["document-structure", "accessibility"]
      ),
      q(
        "html-labels",
        "Form labels are not placeholders",
        "Why should an input have a persistent label even if its placeholder explains the expected value?",
        "A placeholder disappears as the user types and may have weak contrast, so it is not a reliable persistent field name. Associate a visible label with the control and connect help or error text through the appropriate accessible description mechanism. Validation messages should explain how to recover. A programmatic name and a visual label serve related but distinct needs for assistive and sighted users.",
        "EASY",
        ["forms", "accessibility"]
      ),
      q(
        "html-validation",
        "Browser validation and server trust",
        "Does a required field or input type make its submitted value safe for the server?",
        "Browser constraints improve feedback but can be bypassed by a direct request or modified client. Validate the submitted value again on the server and enforce authorization separately. Choose input types for useful keyboards and semantics, while preserving explicit domain checks such as length and allowed format. Do not confuse an email-shaped string with proof that the caller owns that email address.",
        "MEDIUM",
        ["forms", "validation"]
      ),
      q(
        "html-images",
        "Alternative text policy",
        "How should alt text differ for an informative chart and a purely decorative image?",
        "An informative image needs a text alternative communicating its purpose; a complex chart may also need a nearby detailed explanation or data table. A purely decorative image should use an empty alternative so it does not add noise. The policy depends on context: an image inside a link may need to describe the destination. Avoid repeating adjacent text unnecessarily or using filenames as descriptions.",
        "EASY",
        ["images", "accessibility"]
      ),
      q(
        "html-responsive-images",
        "Responsive image selection",
        "How do srcset and sizes reduce wasted image downloads?",
        "srcset offers candidates, while sizes describes the expected rendered width for width-descriptor candidates so the browser can select an appropriate resource considering viewport and pixel density. Incorrect sizes can cause an oversized download. Provide dimensions or an aspect ratio to reserve layout space, and avoid lazy-loading the likely largest visible hero image when that would delay its presentation.",
        "MEDIUM",
        ["images", "performance"]
      ),
      q(
        "html-loading",
        "Script execution policies",
        "How do defer and async differ for ordinary external scripts?",
        "A deferred classic script downloads without blocking parsing and executes after parsing in document order, before DOMContentLoaded. An async script executes when ready and does not preserve order with other async scripts. Choose async for independent work and defer for ordered dependencies. Module scripts defer by default unless configured otherwise, so do not assume all script attributes have identical behavior across script kinds.",
        "MEDIUM",
        ["scripts", "loading"]
      ),
      q(
        "css-box",
        "Predictable box dimensions",
        "Why is border-box often used for layout sizing?",
        "With border-box, a declared width includes padding and border, making the rendered border box easier to budget within a container. The content area becomes smaller as padding or border grows. Margins remain outside that calculation. This simplifies many layouts but does not prevent overflow from long unbreakable content, minimum-size rules, or children whose intrinsic sizes exceed available space.",
        "EASY",
        ["box-model", "sizing"]
      ),
      q(
        "css-cascade",
        "Cascade before specificity",
        "Why can a more specific selector still lose to another declaration?",
        "The cascade considers factors such as origin, importance, and cascade layer precedence before comparing specificity within the relevant group. Source order resolves later ties. A highly specific selector in a lower-priority normal layer can lose to a less specific one in a higher-priority layer. Understand that hierarchy before adding important flags, which can make future overrides harder and invert layer behavior for important declarations.",
        "HARD",
        ["cascade", "specificity"]
      ),
      q(
        "css-inheritance",
        "Inheritance and custom properties",
        "Why does changing a container's color affect text descendants but not necessarily their borders?",
        "Some properties, such as color, inherit by default, while others do not. A border color may use currentColor when specified that way, but inheritance rules do not automatically apply to every property. Custom properties normally inherit and can carry design tokens through a subtree. Define fallbacks and scopes deliberately so a local theme does not unintentionally affect unrelated descendants.",
        "MEDIUM",
        ["inheritance", "tokens"]
      ),
      q(
        "css-flex",
        "Flex sizing and minimums",
        "Why can a flex child overflow even when flex-shrink is enabled?",
        "A flex item's automatic minimum size can prevent it from shrinking below its content's intrinsic minimum. For a layout intended to allow shrinkage, min-width: 0 on the relevant item can help, combined with a wrapping or truncation policy. flex-shrink distributes negative space but does not override every minimum constraint. Test long words, code, and localized labels rather than only short sample text.",
        "MEDIUM",
        ["flexbox", "overflow"]
      ),
      q(
        "css-grid",
        "Grid versus flexbox",
        "When is Grid a better fit than Flexbox for a dashboard?",
        "Grid is well suited to coordinated rows and columns where items need shared track alignment. Flexbox is primarily a one-dimensional layout model and fits a toolbar or a flexible row. Both can wrap and nest, but using the model that matches the relationship reduces manual width calculations. Consider content-driven sizing and responsive track changes instead of fixing every item to a pixel width.",
        "EASY",
        ["grid", "flexbox"]
      ),
      q(
        "css-position",
        "Containing blocks and absolute positioning",
        "Why might an absolutely positioned badge align to an unexpected ancestor?",
        "An absolute element is positioned relative to its containing block, which is often established by a positioned ancestor but can also be affected by properties such as transforms. It is not necessarily the nearest DOM parent. Give the intended container an explicit positioning context and test overflow behavior. Avoid using absolute positioning for ordinary document layout because it removes the element from normal flow.",
        "MEDIUM",
        ["positioning", "layout"]
      ),
      q(
        "css-stacking",
        "Z-index is local",
        "Why can an element with a huge z-index remain behind another panel?",
        "z-index ordering is constrained by stacking contexts. A child cannot escape its ancestor's stacking context merely by using a larger number, and properties such as transforms or opacity can create new contexts. Inspect the ancestor chain and the context ordering rather than escalating numbers. For overlays, choose a deliberate portal or top-layer strategy and still manage focus and background interaction.",
        "HARD",
        ["stacking-context", "overlays"]
      ),
      q(
        "css-queries",
        "Viewport and container responsiveness",
        "When should a reusable card use a container query instead of a media query?",
        "A container query reacts to the card's available container space, so the same component can adapt differently in a sidebar and a full-width region at the same viewport size. A media query reacts to the viewport or user environment. Establish an appropriate query container and avoid containment choices that break sizing assumptions. Use media queries for broader page changes and user preferences such as reduced motion.",
        "MEDIUM",
        ["responsive-design", "container-queries"]
      ),
      q(
        "css-units",
        "Choosing units for intent",
        "How should rem, percentages, and viewport units be chosen for a responsive interface?",
        "rem supports sizing relative to the root font, percentages depend on a relevant containing dimension, and viewport units express viewport-based sizes. Use the unit that matches the relationship rather than choosing one everywhere. Dynamic viewport units can help with changing mobile browser chrome, while clamp can bound fluid values. Test zoom and text scaling so fluid sizing does not reduce accessibility.",
        "MEDIUM",
        ["units", "responsive-design"]
      ),
      q(
        "css-focus",
        "Visible focus is part of interaction",
        "Why is removing outlines globally an accessibility regression?",
        "Keyboard users need to know which control will receive activation. Removing outlines without a visible replacement hides that information, even when pointer interactions still seem fine. Use a strong focus-visible treatment with sufficient contrast and ensure focused controls are not obscured by sticky regions or overlays. Test actual tab order and activation rather than assuming a styled hover state covers keyboard behavior.",
        "MEDIUM",
        ["focus", "accessibility"]
      ),
      q(
        "css-motion",
        "Motion and rendering cost",
        "How should an animated panel balance smoothness and accessibility?",
        "Prefer transform and opacity for suitable animations because they often avoid repeated layout, but measure actual compositing and avoid promoting every element indefinitely. Honor prefers-reduced-motion by removing nonessential motion or using a less disruptive transition. Keep essential status information available without animation. Smooth motion does not justify moving focus unexpectedly or causing content to shift during reading.",
        "MEDIUM",
        ["animation", "performance"]
      ),
      q(
        "css-order",
        "Visual order and reading order",
        "Why can CSS order create an inaccessible form even when the screen looks correct?",
        "CSS can change visual order without changing DOM reading and keyboard navigation order. Users may then tab through fields in an order different from the layout they see. Put content in a sensible DOM sequence and use layout tools to present that sequence responsively. Reordering is not automatically wrong, but verify that meaning and interaction remain coherent at each breakpoint and with assistive technology.",
        "MEDIUM",
        ["dom-order", "accessibility"]
      ),
      q(
        "css-testing",
        "Testing robust layout",
        "Which cases should a responsive layout review include beyond common device widths?",
        "Test long and localized text, keyboard navigation, high zoom, reduced motion, forced colors where relevant, and missing or slow images. Verify that content remains available without horizontal page overflow at narrow widths, with exceptions for inherently two-dimensional content. A set of screenshots at three widths cannot prove resilience to intrinsic sizing, accessibility preferences, or asynchronous content changes.",
        "MEDIUM",
        ["testing", "responsive-design"]
      ),
    ],
    notes: [
      {
        key: "html-css-foundations",
        title: "HTML and CSS foundations: meaning, cascade, and layout",
        excerpt:
          "Separate document semantics from visual rules and understand how dimensions are resolved.",
        content: `# Meaning and presentation are separate contracts

HTML communicates document structure and interaction semantics. CSS describes presentation and layout. A visually button-like container is not automatically an accessible button, and a large-font paragraph is not automatically a heading. Start with the right element roles, meaningful headings, and a sensible reading order; then style that structure.

## Forms and content alternatives

Give controls persistent labels and useful descriptions. Placeholders can provide examples but disappear during entry and are not substitutes for labels. Browser validation improves feedback but does not establish server trust. Informative images need an alternative that conveys purpose; decorative images should not interrupt the reading experience. Complex charts may need a longer nearby explanation.

## The cascade

Before specificity, the cascade considers origin, importance, and layer precedence. Source order resolves relevant ties. Treat layers as an intentional architecture for resets, shared tokens, components, and overrides rather than fighting every conflict with stronger selectors. Inheritance applies to selected properties, while custom properties can pass design tokens through a subtree.

\`\`\`css
@layer base, components;
@layer base {
  * { box-sizing: border-box; }
}
@layer components {
  .card {
    padding: 1rem;
    color: var(--text-color, #202020);
    border: 1px solid currentColor;
  }
}
\`\`\`

This example uses a fallback token and makes the border follow the text color explicitly. It does not define the entire theme or guarantee that every token combination meets contrast requirements.

## Layout models

The box model separates content, padding, border, and margin. border-box makes declared dimensions include padding and border, but margins remain outside. Flexbox coordinates a primary axis; Grid coordinates tracks across two dimensions. Intrinsic content and automatic minimum sizes can still create overflow, so test long text and use minimum-size overrides only where shrinking is intended.

Positioned elements and stacking contexts have their own rules. A larger z-index cannot escape an ancestor context. Absolute positioning is useful for intentional overlays, not a replacement for ordinary document flow.

Practice by building one card with a long title and one form with clear labels. Explain every sizing and selector choice. A layout that survives unfamiliar content is more valuable than one that matches only a single screenshot.`,
      },
      {
        key: "html-css-application",
        title: "Applying HTML and CSS to a reusable responsive interface",
        excerpt: "Design from content constraints, accessibility, and component context.",
        content: `# Build a responsive results panel

Start with a semantic content plan: a section heading, a list of results, meaningful navigation links, and action buttons where state changes occur. Keep the DOM order coherent before applying Grid or Flexbox. A reusable panel may appear in a narrow sidebar or a wide page body, so responsiveness should follow its actual available space rather than only the viewport.

## Content-driven sizing

Use flexible tracks and deliberate minimums. A long identifier or localized title can reveal overflow hidden by sample content. Let text wrap when meaning matters; truncate only when the full value remains available through an accessible design. Avoid fixed heights on content that can grow under zoom or translation.

\`\`\`css
.results-region {
  container-type: inline-size;
}
.results {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr);
}
@container (min-width: 40rem) {
  .results {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.result-title {
  overflow-wrap: anywhere;
}
\`\`\`

The panel adapts to its container. The zero minimum prevents the track's intrinsic minimum from forcing the entire layout wider than intended, but wrapping policy still matters. Check that containment does not conflict with surrounding intrinsic sizing.

## Images and stability

Provide image dimensions or an aspect ratio so space is reserved before the resource arrives. Use candidate sources and a correct sizes description when the image width varies. Do not lazily defer the likely largest visible hero image if that delays the main content. Informative images need appropriate alternatives; decorative thumbnails may not need to repeat an adjacent title.

## Interaction and themes

Use persistent labels, visible focus, and meaningful error feedback. Preserve focus when results update and avoid announcing every minor visual change. Theme tokens should cover text, surfaces, borders, and focus treatments with tested contrast, not merely swap backgrounds.

Honor reduced-motion preferences and test narrow layouts with enlarged text. Review keyboard order at every breakpoint because visual reordering does not change DOM order. Finish with long labels, missing images, slow loading, and an empty result list. Responsive design is adaptation to content and user conditions, not a collection of device-specific screenshots.`,
      },
      {
        key: "html-css-pitfalls",
        title: "HTML and CSS pitfalls: deceptive visuals and hidden constraints",
        excerpt: "Catch stacking, focus, overflow, and loading defects before release.",
        content: `# The screen can look right while the contract is wrong

A generic element with a click listener may resemble a button but lack keyboard activation and semantics. A placeholder may resemble a label until typing hides it. A reordered grid may look logical while keyboard focus follows a different DOM order. Test interaction and structure independently from appearance.

## Overflow and dimensions

border-box does not make every child fit. Flex and grid items can retain automatic minimum sizes, and unbreakable text can force overflow. Use min-width: 0 where shrinking is intended and choose a wrapping policy. Fixed heights often fail with localization, text scaling, or validation errors. Prefer content-driven height unless the product has a deliberate scroll region with clear behavior.

## Stacking and positioning

A huge z-index is local to its stacking context. Transforms, opacity, and other properties can create unexpected contexts. Inspect ancestors before changing numbers. An overlay also needs focus management and background interaction control; being visually above the page is not enough.

\`\`\`css
.dialog-surface {
  max-width: min(36rem, calc(100vw - 2rem));
  max-height: calc(100dvh - 2rem);
  overflow: auto;
}
.action:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 3px;
}
\`\`\`

These rules address dimensions and focus appearance only. A production dialog still needs correct semantics, lifecycle, and keyboard behavior. The focus color must remain visible against surrounding surfaces.

## Cascade and performance

Adding important declarations to every conflict hides the actual cascade design. Layer order is considered before specificity for normal declarations, while important declarations have different layer precedence. Document intentional overrides. Animating layout properties can cause repeated layout work; transforms and opacity often fit better, but compositing still has memory and rendering costs.

## User conditions

Honor reduced motion and verify usable high-zoom layouts. Do not hide essential content simply because a breakpoint is narrow. Reserve image space to avoid layout shifts and choose loading priority for visible content. Test script dependency order: async does not preserve execution order for independent classic scripts.

Before release, inspect keyboard navigation, accessible names, long text, slow assets, forced colors where relevant, and reduced-motion behavior. These checks reveal failures that pixel-perfect comparison on a fast desktop will miss.`,
      },
    ],
    roadmap: {
      title: "Semantic responsive interface engineering",
      description:
        "Build a results panel and form that remain usable across content, viewport, and accessibility conditions.",
      estimatedHours: 27,
      steps: [
        {
          title: "Plan semantic structure",
          description:
            "Choose headings, landmarks, links, buttons, labels, and content alternatives.",
          hours: 4,
        },
        {
          title: "Understand cascade and boxes",
          description:
            "Trace layers, inheritance, dimensions, and selector conflicts using a small component.",
          hours: 4,
        },
        {
          title: "Build content-driven layouts",
          description:
            "Use Grid and Flexbox with intrinsic sizing, long text, and deliberate wrapping policies.",
          hours: 5,
        },
        {
          title: "Adapt reusable components",
          description:
            "Add container and media queries, responsive images, and stable loading dimensions.",
          hours: 5,
        },
        {
          title: "Polish accessible interaction",
          description:
            "Implement focus treatments, error feedback, theme contrast, and reduced-motion behavior.",
          hours: 4,
        },
        {
          title: "Verify adverse conditions",
          description:
            "Test zoom, keyboard order, localization, narrow space, missing images, and slow loading.",
          hours: 5,
        },
      ],
    },
    cheatSheet: {
      title: "HTML and CSS semantic layout sheet",
      content: `# HTML and CSS quick decisions

| Need | Prefer | Check |
| --- | --- | --- |
| Navigate to a resource | Link | Meaningful accessible name |
| Change application state | Native button | Keyboard activation and focus |
| Identify a field | Persistent associated label | Placeholder is only supplementary |
| Explain an informative image | Contextual alternative | Complex charts need more detail |
| Decorative image | Empty alternative | Do not duplicate adjacent meaning |
| One-axis alignment | Flexbox | Automatic minimum sizes can overflow |
| Shared rows and columns | Grid | Use appropriate track minimums |
| Reusable local adaptation | Container query | Establish a suitable container |
| Page or preference adaptation | Media query | Test real content and user settings |
| Fluid bounded sizing | clamp with suitable units | Preserve text zoom behavior |

## Debugging checklist

- Cascade origin, importance, and layers precede specificity.
- Margins remain outside border-box dimensions.
- min-width: 0 can permit intended flex or grid shrinkage.
- A large z-index cannot escape an ancestor stacking context.
- CSS visual order does not change reading or tab order.
- Visible focus must remain visible and not be obscured.
- Reserve image dimensions to avoid asynchronous layout shifts.
- srcset candidates need an accurate sizes policy.
- Async classic scripts do not preserve dependency order.
- Prefer transform or opacity for suitable motion and honor reduced-motion preferences.

\`\`\`css
.fluid-heading {
  font-size: clamp(1.25rem, 1rem + 1vw, 2rem);
}
\`\`\`

Fluid sizing is a relationship, not an accessibility guarantee. Verify large text, localization, narrow containers, and theme contrast in the actual interface.`,
    },
    quiz: {
      title: "HTML and CSS robust-interface quiz",
      questions: [
        quiz(
          "Which element is generally appropriate for an action rather than navigation?",
          [
            "A link without a destination",
            "A generic container with only a click handler",
            "A native button",
            "A heading styled as a control",
          ],
          2,
          "A native button supplies action semantics and standard keyboard interaction. Navigation should instead use a link with a meaningful destination."
        ),
        quiz(
          "What does border-box include in a declared width?",
          [
            "Content, padding, and border",
            "Content and margin only",
            "All descendant margins",
            "Only the content area",
          ],
          0,
          "border-box includes padding and border in the declared dimension. Margins stay outside, and intrinsic child content can still overflow."
        ),
        quiz(
          "Why can a huge z-index fail to raise an overlay above a sibling panel?",
          [
            "z-index never affects positioned elements",
            "All overlays share one global ordering",
            "Opacity disables every descendant",
            "The overlay is constrained by its ancestor stacking context",
          ],
          3,
          "Stacking contexts form local ordering groups. A child's large z-index cannot outrank elements outside a lower-ranked ancestor context."
        ),
        quiz(
          "Which rule is appropriate for a purely decorative image?",
          [
            "Describe its filename",
            "Use an empty alternative",
            "Repeat all adjacent text",
            "Label it as a required action",
          ],
          1,
          "An empty alternative prevents decorative content from adding noise. Informative images require alternatives that convey their contextual purpose."
        ),
        quiz(
          "What should a reusable sidebar card often respond to?",
          [
            "Only the device's model name",
            "Only a fixed screen width",
            "Its container's available size",
            "The number of JavaScript modules",
          ],
          2,
          "Container queries let reusable components adapt to their local space, which may differ substantially within the same viewport."
        ),
        quiz(
          "Why retain a visible focus indicator?",
          [
            "Keyboard users need to identify the active control",
            "Hover always identifies keyboard focus",
            "Focus outlines only affect screen readers",
            "It prevents all form validation errors",
          ],
          0,
          "Visible focus communicates where keyboard activation will occur. Removing it without a clear replacement makes interaction difficult or impossible."
        ),
        quiz(
          "What is a limitation of visually reordering content with CSS?",
          [
            "It always removes semantic roles",
            "It automatically updates tab order",
            "It forces every element into a new stacking context",
            "DOM reading and keyboard order may remain unchanged",
          ],
          3,
          "Visual layout can diverge from DOM order. A coherent source order and testing at breakpoints are necessary for predictable navigation."
        ),
        quiz(
          "How do ordinary external async scripts behave?",
          [
            "They always execute in document order",
            "They execute when ready without dependency-order guarantees",
            "They wait for all deferred scripts first",
            "They never run before parsing ends",
          ],
          1,
          "Async downloads do not block parsing, but execution occurs when each script is ready. Use an appropriate ordered strategy for dependent classic scripts."
        ),
      ],
    },
  },
  {
    slug: "nosql",
    references: [
      {
        title: "MongoDB learning guide",
        url: "https://www.w3schools.com/mongodb/",
        provider: "W3Schools",
      },
      {
        title: "Introduction to NoSQL",
        url: "https://www.geeksforgeeks.org/introduction-to-nosql/",
        provider: "GeeksforGeeks",
      },
      {
        title: "MongoDB interview topics",
        url: "https://www.interviewbit.com/mongodb-interview-questions/",
        provider: "InterviewBit",
      },
    ],
    questions: [
      q(
        "nosql-models",
        "NoSQL is a family of models",
        "How do document, key-value, wide-column, and graph stores differ in their primary fit?",
        "Document stores organize nested records, key-value stores optimize access by a known key, wide-column stores often support partition-oriented sparse data, and graph stores emphasize relationship traversal. These categories do not imply identical query languages or guarantees. Choose from concrete access patterns and operational requirements rather than assuming every non-relational store is interchangeable or inherently faster than a relational database.",
        "EASY",
        ["data-models", "selection"]
      ),
      q(
        "nosql-access",
        "Access patterns drive modeling",
        "What questions should precede designing a high-volume event collection?",
        "List the reads and writes, required sort orders, filtering keys, result limits, retention policy, and acceptable consistency. Then choose partitioning and indexes that serve those patterns. A flexible document format does not guarantee cheap arbitrary queries. Prototype with realistic cardinality and skew; an event model optimized for append and per-user history may perform poorly for global analytics.",
        "MEDIUM",
        ["modeling", "access-patterns"]
      ),
      q(
        "nosql-embed",
        "Embedding bounded data",
        "When should an order embed its purchased line-item descriptions?",
        "Embedding can keep a bounded set of line items together and preserve the description and price that applied at purchase time. That fits an aggregate commonly read and updated as one unit. Do not embed an unbounded history that continually enlarges the document. Referencing shared mutable catalog records may save duplication, but it can lose historical meaning unless the order stores a deliberate snapshot.",
        "MEDIUM",
        ["documents", "embedding"]
      ),
      q(
        "nosql-reference",
        "Referencing independent entities",
        "Why might comments be separate documents rather than an ever-growing array in a post?",
        "Comments can grow without a natural bound, require independent pagination and moderation, and receive concurrent updates from many users. Separate documents avoid a single expanding aggregate and allow independent indexes. The tradeoff is additional reads or joins supported by the chosen store. Define ownership and deletion behavior explicitly, since references do not necessarily enforce relational foreign-key constraints.",
        "MEDIUM",
        ["references", "pagination"]
      ),
      q(
        "nosql-schema",
        "Flexible does not mean unvalidated",
        "How can a document service prevent malformed records while still evolving its schema?",
        "Validate writes against versioned application contracts and use database validation features where appropriate. Optional fields and schema versions can support controlled evolution, but readers need a documented policy for older records. A schemaless label means the database may permit varying shapes, not that the application can operate without invariants. Test missing fields and migration transitions before changing query assumptions.",
        "EASY",
        ["schemas", "validation"]
      ),
      q(
        "nosql-index",
        "Index cost and selectivity",
        "Why should a service avoid indexing every field automatically?",
        "Indexes consume storage and must be maintained on writes, so unnecessary indexes increase write cost and operational burden. Choose indexes for actual filters, sorts, and uniqueness requirements, considering cardinality and selectivity. Inspect execution plans and keys examined under realistic data. An index existing by name does not prove the query uses it efficiently or that it removes an expensive in-memory sort.",
        "MEDIUM",
        ["indexes", "performance"]
      ),
      q(
        "nosql-compound",
        "Compound index ordering",
        "How should equality, sorting, and range predicates influence a document-store compound index?",
        "A useful starting point is to align leading fields with stable equality filters, then support the required sort and range pattern according to the engine's planner rules. For example, a tenant-filtered timeline needs tenant isolation and a predictable time order. Index field order matters and one arrangement will not optimize every query. Verify the execution plan rather than treating a rule of thumb as universal.",
        "HARD",
        ["compound-indexes", "query-plans"]
      ),
      q(
        "nosql-pagination",
        "Seek pagination",
        "Why can a cursor be better than a large offset for an activity feed?",
        "A large offset can require scanning and discarding many records, and concurrent inserts can shift positions between pages. A cursor based on a stable sort key and unique tie-breaker lets the next query seek after the last item. Encode the query scope in the cursor and validate it. Cursor pagination improves continuity, but it does not create a frozen snapshot unless the store and API explicitly support one.",
        "MEDIUM",
        ["pagination", "cursors"]
      ),
      q(
        "nosql-cap",
        "CAP applies during partitions",
        "What choice does CAP highlight when a distributed store experiences a network partition?",
        "During a partition, a system cannot simultaneously guarantee linearizable consistency and a successful response from every reachable node for every operation. This is a failure-mode tradeoff, not a permanent slogan that all NoSQL systems always sacrifice consistency. Evaluate the store's behavior per operation and configuration. A checkout write may choose to fail rather than accept conflicting state while a public feed tolerates delayed data.",
        "HARD",
        ["cap", "distributed-systems"]
      ),
      q(
        "nosql-eventual",
        "Eventual convergence and user experience",
        "What does eventual consistency fail to guarantee immediately after a write?",
        "Eventual consistency describes convergence under suitable conditions when updates stop; it does not guarantee that the next read from every replica sees the write or that all intermediate observations are ordered. Design the interface for delayed visibility or request stronger session guarantees where supported. Do not interpret eventual as a fixed delay bound unless the service explicitly documents such a bound.",
        "MEDIUM",
        ["consistency", "replication"]
      ),
      q(
        "nosql-read-write",
        "Read and write concerns",
        "Why are write acknowledgement and read visibility separate decisions?",
        "A write acknowledgement policy controls what replication or durability conditions must be met before success is reported. A read policy controls which versions and nodes are acceptable for a read. Stronger acknowledgement alone does not define every subsequent read's freshness. In MongoDB, concerns and session options interact with deployment topology; use the documented configuration for the needed durability and read-your-own-writes behavior.",
        "HARD",
        ["mongodb", "durability"]
      ),
      q(
        "nosql-atomic",
        "Single-document atomicity",
        "How can a counter update avoid losing concurrent increments?",
        "Use the store's atomic update operation rather than reading a value, incrementing it locally, and writing a replacement. The read-modify-write sequence can overwrite another client's change. In MongoDB, a single-document update can be atomic, but a collection-wide invariant may require a transaction or different aggregate design. Atomicity scope is a property of the operation, not of the word NoSQL.",
        "MEDIUM",
        ["atomicity", "concurrency"]
      ),
      q(
        "nosql-cas",
        "Optimistic concurrency",
        "How should two editors avoid silently overwriting the same document revision?",
        "Include the expected revision in the update condition and increment the revision when the update succeeds. If no record matches, report a conflict and let the caller reload or merge. This compare-and-set approach avoids silent last-write-wins replacement without holding a long application lock. It requires every writer to follow the revision protocol and an explicit user experience for conflict resolution.",
        "MEDIUM",
        ["optimistic-locking", "revisions"]
      ),
      q(
        "nosql-transactions",
        "Transactions where the model needs them",
        "Does using a document store mean multi-document transactions are impossible?",
        "No. Some document stores support multi-document transactions, with deployment and performance constraints specific to the product. Use them when an invariant genuinely spans documents, while considering whether a bounded aggregate could make the write simpler. Transactions add coordination and retry handling; they do not make an inefficient access model efficient or replace idempotency for externally retried requests.",
        "MEDIUM",
        ["transactions", "modeling"]
      ),
      q(
        "nosql-shards",
        "Shard key quality",
        "Why can a timestamp-only shard key create a hot partition for append-heavy writes?",
        "New timestamps concentrate writes in the newest range, which can overload one shard instead of distributing traffic. A key needs appropriate cardinality and distribution while still supporting important queries. Hashing can spread writes but make range reads less targeted. Evaluate tenant skew, monotonically increasing values, and future growth rather than choosing a shard key solely because it is present in every record.",
        "HARD",
        ["sharding", "hotspots"]
      ),
      q(
        "nosql-replication",
        "Replication is not sharding",
        "What different problems do replicas and shards address?",
        "Replication maintains copies of data for availability and potentially read scaling, while sharding partitions the data set across nodes to distribute storage and work. A sharded deployment may itself replicate each shard. Replicas do not remove all single-primary write bottlenecks, and sharding adds routing and cross-partition costs. Map the actual bottleneck before choosing either as a scaling strategy.",
        "EASY",
        ["replication", "sharding"]
      ),
      q(
        "nosql-ttl",
        "Expiration is not an exact timer",
        "Can a TTL index be used as the sole rule for whether an expired session is accepted?",
        "No. TTL cleanup is generally asynchronous and may leave expired records present for a period. Check the expiry timestamp in the authentication path rather than relying on physical deletion as proof of validity. TTL indexes are useful for retention and eventual cleanup, but deletion timing and limitations depend on the product. Important compliance deadlines need a verified lifecycle policy beyond a casual TTL assumption.",
        "MEDIUM",
        ["ttl", "security"]
      ),
      q(
        "nosql-aggregation",
        "Pipeline ordering and working set",
        "How can an aggregation pipeline reduce unnecessary work?",
        "Apply selective filters and narrow projections as early as the engine can use them safely, and support relevant match and sort operations with indexes. Later grouping or sorting can consume substantial memory and may spill according to engine limits and configuration. Inspect the execution plan because optimizers can reorder stages. Avoid fetching every record into application memory to perform a database-sized aggregation.",
        "MEDIUM",
        ["aggregation", "performance"]
      ),
      q(
        "nosql-denormalize",
        "Maintaining duplicated data",
        "How should a service handle denormalized author names copied into many posts?",
        "First define whether the copied name is a historical snapshot or a projection expected to track the current author. For a projection, implement update propagation, versioning, and repair or reconciliation for missed updates. Duplication buys faster reads at the cost of maintenance and temporary inconsistency. Without a declared ownership policy, two copies can diverge indefinitely and neither is clearly authoritative.",
        "HARD",
        ["denormalization", "consistency"]
      ),
      q(
        "nosql-operations",
        "Backups and recovery evidence",
        "Why is replica availability not equivalent to having a recoverable backup?",
        "Replicas can propagate accidental deletions or corruption, so multiple live copies do not guarantee recovery to a prior valid point. Keep backups or point-in-time recovery according to recovery objectives and test restoration into an isolated environment. Verify data, indexes, permissions, and application compatibility after restore. A backup dashboard showing success is weaker evidence than a timed restoration exercise.",
        "MEDIUM",
        ["backups", "operations"]
      ),
    ],
    notes: [
      {
        key: "nosql-foundations",
        title: "NoSQL foundations: models, aggregates, and guarantees",
        excerpt:
          "Choose a data model from access patterns rather than a relational-versus-NoSQL slogan.",
        content: `# NoSQL describes several different families

Document, key-value, wide-column, and graph stores organize and query data differently. A document store is not merely a key-value store with prettier records, and a graph store's traversal model is not interchangeable with an indexed event collection. Products also differ in consistency, transaction scope, validation, indexing, and operational requirements.

## Begin with access patterns

List each read and write, including filters, sort order, result limits, expected cardinality, and retention. Add concurrency and freshness requirements. A flexible record shape does not guarantee efficient arbitrary querying. Prototype with realistic skew: one large tenant or one hot key may dominate a workload even when average traffic looks modest.

## Aggregate boundaries

Embed bounded information that is commonly read together or represents a historical snapshot. An order can preserve the descriptions and prices used at purchase time. Reference independently growing data such as comments so it can be paginated, moderated, and indexed without enlarging one document indefinitely.

\`\`\`json
{
  "orderId": "order-204",
  "schemaVersion": 1,
  "customerId": "customer-18",
  "items": [
    { "productId": "product-9", "description": "Travel mug", "priceMinor": 1800 }
  ],
  "revision": 1
}
\`\`\`

This bounded snapshot does not define payment authorization or inventory consistency. Those are separate business invariants. Document limits and atomicity guarantees depend on the selected database.

## Guarantees and evolution

Validate records at application boundaries and use database validation features where appropriate. Flexible schema means variation is permitted, not that readers can operate without invariants. Schema versions and optional fields support controlled evolution when readers know how to handle older records.

Single-document atomic updates can protect a counter, while multi-document invariants may require supported transactions or a different aggregate design. Eventual consistency does not promise immediate visibility on every replica. CAP highlights a tradeoff during network partitions; it is not a permanent label that every NoSQL operation is weakly consistent.

Practice by modeling a timeline, an order, and a relationship-heavy recommendation query. Explain why their boundaries and indexes differ. The goal is a justified model, not choosing one database family for every feature.`,
      },
      {
        key: "nosql-application",
        title: "Applying NoSQL to a tenant-scoped activity feed",
        excerpt:
          "Design indexes, cursor pagination, and concurrency around explicit query contracts.",
        content: `# Model a feed around its actual reads

Suppose the primary read is the newest activities for one tenant, optionally filtered by actor. The write path appends events and retains them for a defined period. Begin with tenant isolation, a stable sort key, a unique tie-breaker, and a bounded page size. Decide whether readers need a frozen snapshot or simply a continuous feed that may include newly arriving data.

## Index and cursor design

A compound index should support the common tenant filter and ordering. A second actor-specific query may require a different index. Do not add every possible field combination in advance; each index consumes space and write work. Inspect execution plans with realistic volume, selective and nonselective filters, and skewed tenants.

\`\`\`json
{
  "tenantId": "tenant-7",
  "eventId": "event-812",
  "occurredAt": "2026-11-15T08:00:00.000Z",
  "actorId": "user-23",
  "kind": "draft-saved",
  "schemaVersion": 1
}
\`\`\`

A cursor can encode the last timestamp and event ID plus the query scope. Validate or authenticate that cursor according to the API's threat model. Seeking after the last pair avoids large offset scans and reduces page shifting, but it does not automatically freeze concurrent data. Ensure timestamp ties have deterministic ordering.

## Writes and revisions

For editable documents, include an expected revision in the atomic update condition and increment it on success. A failed match is a conflict, not proof that the document never existed. If a workflow spans documents, choose the database's transaction support or a deliberate asynchronous consistency model. Retried requests still need idempotency when external effects are possible.

## Retention and scale

Use TTL cleanup for eventual retention where appropriate, but evaluate expiry timestamps in authorization or eligibility checks. Cleanup timing is not an exact deadline. Plan shard keys from distribution and query routing needs; a monotonically growing timestamp can concentrate new writes.

Test cursor scope misuse, tied timestamps, missing older fields, concurrent edits, hot tenants, and restoration from backup. Monitor examined keys, returned rows, write latency, and replication behavior. These measurements show whether the model supports the stated workload rather than merely accepting its documents.`,
      },
      {
        key: "nosql-pitfalls",
        title: "NoSQL pitfalls: unbounded aggregates and ambiguous consistency",
        excerpt: "Review the operational and correctness costs hidden by flexible documents.",
        content: `# Flexible storage does not remove design obligations

An ever-growing array can exceed document limits, increase update cost, and become a concurrency hotspot. A collection with no write validation can accumulate shapes that readers no longer understand. A duplicated field without an ownership policy can diverge forever. Make aggregate size, schema evolution, and source-of-truth rules explicit.

## Consistency is operation-specific

Read acknowledgement, write durability, replica selection, and session guarantees answer different questions. Stronger write acknowledgement does not automatically define every future read's freshness. Eventual consistency does not promise a fixed convergence deadline unless the service documents one. During a partition, availability and linearizable behavior can conflict, so choose based on the operation's business risk.

## Updates and duplicated fields

Reading a counter and then writing its incremented replacement can lose concurrent changes. Use atomic operators or a conditional revision update. If many documents copy a current author name, provide propagation and repair. If the field is a historical snapshot, do not silently rewrite it as though it were a projection.

\`\`\`json
{
  "filter": { "documentId": "draft-41", "revision": 6 },
  "change": { "newTitle": "Deployment notes", "nextRevision": 7 }
}
\`\`\`

This illustrates the compare-and-set contract, not a portable query language. The implementation must apply the condition and revision change atomically using the chosen database API.

## Index and partition mistakes

Indexing every field increases write cost without guaranteeing useful plans. A compound index's field order affects supported filtering and sorting. A shard key with poor distribution can create a hot partition, while a hashed key may trade away targeted range reads. Test realistic skew and explain plans instead of relying on average-sized sample data.

## Expiry and recovery

TTL deletion is usually asynchronous, so an expired session must still fail a timestamp check while its record exists. Replicas provide availability, not historical recovery from an accidental delete. Keep a backup policy tied to recovery-point and recovery-time goals, and prove it with restores.

Before release, test old schema versions, large aggregates, cursor boundaries, conflicts, delayed replicas, partition-sensitive operations, and backup restoration. Each check should protect a stated invariant. The absence of a relational schema does not make those invariants optional; it moves more responsibility into deliberate modeling and operations.`,
      },
    ],
    roadmap: {
      title: "NoSQL workload and correctness engineering",
      description:
        "Model a tenant activity feed and editable aggregate with explicit query, consistency, and recovery contracts.",
      estimatedHours: 33,
      steps: [
        {
          title: "Compare model families",
          description:
            "Map document, key-value, wide-column, and graph capabilities to concrete workloads.",
          hours: 4,
        },
        {
          title: "Choose aggregate boundaries",
          description:
            "Design bounded embedding, independent references, schema validation, and version evolution.",
          hours: 5,
        },
        {
          title: "Optimize primary reads",
          description:
            "Create workload-driven indexes and cursor pagination, then inspect realistic query plans.",
          hours: 6,
        },
        {
          title: "Protect concurrent writes",
          description:
            "Implement atomic updates, revision conflicts, and a justified transaction or consistency policy.",
          hours: 6,
        },
        {
          title: "Plan distributed behavior",
          description:
            "Evaluate shard-key skew, replication visibility, partition tradeoffs, and TTL limitations.",
          hours: 5,
        },
        {
          title: "Prove recovery and resilience",
          description:
            "Test old records, hot tenants, concurrent edits, cursor boundaries, and timed backup restoration.",
          hours: 7,
        },
      ],
    },
    cheatSheet: {
      title: "NoSQL model and guarantee sheet",
      content: `# NoSQL quick decisions

| Requirement | Consider | Tradeoff |
| --- | --- | --- |
| Bounded data read as one aggregate | Embedding | Document growth and shared-update contention |
| Independently growing history | References and separate records | More queries and explicit ownership |
| Access by a known key | Key-value model | Arbitrary queries may not be available |
| Relationship traversal | Graph model | Different indexing and operational assumptions |
| Stable feed pages | Cursor with unique tie-breaker | Not automatically a frozen snapshot |
| Concurrent counter | Atomic update operator | Atomicity scope remains product-specific |
| Prevent lost editor changes | Expected revision condition | Caller needs conflict handling |
| Multiple-document invariant | Supported transaction or redesign | Coordination and retries cost |
| Eventual cleanup | TTL feature | Deletion is not an exact expiry timer |
| Historical recovery | Backups and restore tests | Live replication propagates mistakes |

## Modeling review

- Write down query filters, sorts, limits, and cardinality before selecting indexes.
- Indexes add storage and write maintenance.
- Inspect plans and examined records under realistic skew.
- Tags, categories, and flexible fields still need validation rules.
- Distinguish historical snapshots from projections expected to stay current.
- Replication copies data; sharding partitions data.
- A monotonic shard key can concentrate append traffic.
- Read policy and write acknowledgement are separate choices.
- CAP describes behavior during partitions, not a blanket product ranking.
- Check expiry timestamps when validity matters, even before TTL cleanup.
- Restore data, indexes, permissions, and application compatibility in recovery exercises.

Choose a database from the workload and failure contract. The label NoSQL alone predicts neither speed nor consistency nor whether transactions are supported.`,
    },
    quiz: {
      title: "NoSQL modeling and guarantees quiz",
      questions: [
        quiz(
          "Which data is a strong candidate for bounded embedding in an order?",
          [
            "An unlimited comment history",
            "A snapshot of purchased line items",
            "Every customer's full profile",
            "A global stream of all orders",
          ],
          1,
          "A bounded purchase snapshot is commonly read together and preserves historical meaning. Unbounded or independently growing data is a poor aggregate fit."
        ),
        quiz(
          "What does replication primarily do?",
          [
            "Partition every record by a shard key",
            "Create a historical backup automatically",
            "Maintain copies for availability and related goals",
            "Remove every write bottleneck",
          ],
          2,
          "Replication maintains copies, while sharding partitions the data set. Replicas can propagate bad writes and do not automatically provide historical recovery."
        ),
        quiz(
          "Why check an expiry timestamp even when a TTL index exists?",
          [
            "Cleanup can be asynchronous and the record may still exist",
            "TTL guarantees immediate deletion",
            "TTL validates every request's identity",
            "Indexes prevent reading expired records automatically",
          ],
          0,
          "TTL is a cleanup mechanism with product-specific timing. Validity must be checked independently when accepting expired data would be unsafe."
        ),
        quiz(
          "How can optimistic concurrency prevent silent editor overwrites?",
          [
            "Always replace the whole document without a condition",
            "Retry forever without reading",
            "Use the latest local timestamp only",
            "Condition the update on the expected revision",
          ],
          3,
          "An atomic expected-revision condition lets one update succeed and reports a conflict for stale editors, who can then reload or merge."
        ),
        quiz(
          "What is a risk of a timestamp-only shard key for append-heavy data?",
          [
            "All queries become automatically targeted",
            "New writes can concentrate on the newest partition",
            "Every replica stores different schemas by definition",
            "It disables all indexes",
          ],
          1,
          "Monotonic keys can direct most new writes into one range. Distribution and query-routing requirements must both inform shard-key design."
        ),
        quiz(
          "What does eventual consistency not guarantee immediately?",
          [
            "The ability to store any data",
            "The existence of replicas",
            "Every read seeing the latest write",
            "That all writes use documents",
          ],
          2,
          "Eventual convergence does not imply immediate visibility across replicas. Stronger session or read policies may be needed for the user experience."
        ),
        quiz(
          "Why not index every field automatically?",
          [
            "Indexes add storage and write-maintenance cost",
            "Indexes never improve reads",
            "Every index is a transaction",
            "Indexes remove schema validation",
          ],
          0,
          "Indexes must be chosen for actual query patterns. They consume resources and can slow writes even when no important query uses them."
        ),
        quiz(
          "What evidence best supports a backup recovery plan?",
          [
            "A replica count greater than one",
            "A screenshot of a successful write",
            "A TTL configuration",
            "A tested timed restore with data and index verification",
          ],
          3,
          "Restoration proves the backup can meet recovery objectives. Replication alone can propagate accidental deletion or corruption to every live copy."
        ),
      ],
    },
  },
];
