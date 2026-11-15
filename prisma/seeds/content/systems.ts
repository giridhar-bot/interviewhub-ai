import type { TopicContent } from "./types";

type QuestionEntry = [title: string, answer: string, difficulty?: "EASY" | "MEDIUM" | "HARD"];

// prettier-ignore
const lowLevelDesign: TopicContent = {
    slug: "low-level-design",
    references: [
      {
        title: "OOPs Interview Questions",
        url: "https://www.interviewbit.com/oops-interview-questions/",
        provider: "InterviewBit",
      },
      {
        title: "Object-Oriented Programming Concepts in Java",
        url: "https://www.geeksforgeeks.org/java/object-oriented-programming-oops-concept-in-java/",
        provider: "GeeksforGeeks",
      },
      {
        title: "OOPs Concepts in Java",
        url: "https://www.tpointtech.com/java-oops-concepts",
        provider: "JavaTpoint / TpointTech",
      },
      // Supplemental public URL; fetch returned 403, so not counted as verified.
      {
        title: "Java OOP (supplemental)",
        url: "https://www.w3schools.com/java/java_oop.asp",
        provider: "W3Schools",
      },
    ],
    questions: questions("low-level-design", [
      ["How do you find classes from a problem statement?", "Extract responsibilities, lifecycle rules, and invariants rather than turning every noun into a class. In a parking system, a ticket tracks a session while an allocation policy chooses a suitable space. Ask which object owns each state transition. Fewer cohesive types with explicit contracts are easier to test than many passive objects connected by one enormous manager.", "EASY"],
      ["What is the difference between abstraction and encapsulation?", "Abstraction exposes the operations a caller needs; encapsulation controls access to representation and protects invariants. A wallet can expose debit without exposing a mutable balance field. Hiding a field is insufficient if a returned collection lets callers mutate the same internal state, so consider defensive copies or immutable views as part of the contract.", "EASY"],
      ["How does the single responsibility principle guide a refactor?", "Look for independent reasons to change, not a fixed maximum method count. A receipt object that calculates taxes, renders a PDF, and emails customers couples accounting policy to formatting and transport. Separate those responsibilities behind useful boundaries, but avoid one-line classes that add indirection without isolating a genuine policy or dependency."],
      ["How can a design remain open to extension without speculative complexity?", "Identify an actual varying policy and give it a stable contract. A shipping-cost strategy can vary by carrier without rewriting order placement. Keep the interface small and introduce implementations when requirements justify them; predicting every future carrier or plugin system can burden current development more than a later focused refactor would."],
      ["What does substitutability require beyond matching method names?", "A subtype must honor the expectations of callers, including accepted inputs, outputs, and invariants. A read-only collection that inherits an interface promising successful mutation violates that contract even if it has the same method signatures. Prefer capability-specific interfaces or composition when a subtype would strengthen preconditions or break expected behavior.", "HARD"],
      ["Why use interface segregation?", "Clients should depend on the capabilities they use rather than a broad interface that forces irrelevant operations. A health monitor may need status but not refund or capture. Separate read and payment capabilities so a test double or implementation does not need meaningless throwing methods. Excessive fragmentation is also costly, so group operations by coherent client needs."],
      ["How does dependency inversion differ from using a dependency injection container?", "Dependency inversion makes core policy depend on a contract instead of a concrete external mechanism. Passing a clock or payment gateway through a constructor is injection and can be done manually. A container automates wiring but cannot repair poor boundaries. For deterministic expiry tests, an injected clock is more useful than hiding a global clock behind a framework."],
      ["When is composition safer than inheritance?", "Composition is useful when behavior varies independently or when an inheritance relationship would expose unwanted operations. A notification service can combine a formatter and a sender instead of inheriting one class per format-channel combination. Inheritance remains useful for genuine substitutable families, but implementation reuse alone does not prove an is-a relationship."],
      ["What should distinguish a value object from an entity?", "An entity retains identity while its attributes change; a value object is defined by its validated values. A reservation is an entity, while an amount with currency is a value object. Make value objects immutable and compare them by value. Do not treat equal-looking reservations as interchangeable merely because their current fields happen to match."],
      ["How do you model a lifecycle as a state machine?", "List states, permitted transitions, triggers, and transition side effects. An order might move from created to paid to shipped, with cancellation allowed only before shipment. Centralize transition checks so every caller obeys the same rules. A state pattern can help when behavior grows, but a small explicit transition table is often clearer than many classes."],
      ["When does the strategy pattern improve a design?", "Strategy isolates interchangeable algorithms behind a common contract. A route planner might choose fastest or lowest-cost routing without branching throughout the application. Keep shared validation outside the strategy when it truly applies to all algorithms. If only one algorithm exists and variation is unlikely, a plain function may be sufficient."],
      ["How do a factory and a builder solve different problems?", "A factory chooses and creates an appropriate implementation; a builder assembles a complex valid object through staged configuration. A parser factory can choose by format, while a request builder collects headers and options. Neither should permit partially initialized objects to escape, and simple constructors remain preferable when the arguments are few and clear."],
      ["What should you watch for in observer-style event handling?", "Observers decouple notification from subscribers but introduce questions about ordering, exceptions, lifetime, and synchronous versus asynchronous delivery. If one listener throws, define whether others still run. Unsubscribe short-lived listeners to avoid leaks. For durable cross-process events, an in-memory observer list is not enough; persistent messaging has different guarantees."],
      ["Why can a singleton make tests and concurrency harder?", "A globally accessible mutable singleton hides dependencies and shares state across unrelated tests and requests. A counter or cached configuration can then leak between cases. Prefer explicit lifetime-scoped instances and dependency passing; if one shared resource is truly required, document its synchronization and cleanup rather than assuming single construction makes every operation thread-safe."],
      ["How do you design error contracts?", "Separate expected domain outcomes from infrastructure failures and programmer mistakes. A booking conflict may be a typed result, while an unreachable database is a recoverable operational error. Preserve internal diagnostic context without exposing secrets to callers. Consistent error contracts make retry decisions testable; a generic exception for every outcome leaves clients guessing."],
      ["How can concurrent allocation oversell a resource?", "Two callers can both observe availability before either updates it, so a check followed by a write is not necessarily atomic. Enforce allocation with a lock, compare-and-set, or database transaction and constraint at the true sharing boundary. A process-local mutex does not protect multiple application instances. Test the losing request's outcome as well as the successful one.", "HARD"],
      ["What should a repository interface expose?", "Expose persistence operations aligned with domain needs without leaking the entire storage engine. A reservation repository might support atomic creation and lookup by identity, while orchestration stays in a service. Avoid pretending complex transactions are simple independent CRUD calls. Document consistency, pagination, and concurrency semantics so a fake repository does not accidentally promise more than production."],
      ["What makes a unit test valuable for a design?", "Test observable contracts and edge cases rather than private method calls. For a pricing policy, verify boundary dates, invalid currency, and rounding decisions with a controllable clock. Mock external effects at meaningful boundaries, but keep pure value objects real. A refactor that preserves behavior should not require rewriting every test because internal call order changed."],
      ["How would you model a parking facility?", "Separate physical spaces, vehicle requirements, active tickets, pricing, and allocation policy. A space can be unavailable for maintenance even when not occupied, so availability is more than a boolean tied to a ticket. Allocate atomically and release idempotently. Keeping pricing independent allows hourly and flat-rate policies without duplicating ticket lifecycle logic."],
      ["How do you manage money and rounding in an object model?", "Represent currency explicitly and use integer minor units or an appropriate decimal type rather than binary floating point for financial calculations. Define rounding at a business boundary, including currencies with different minor-unit scales. An illustrative tax calculation should specify whether rounding occurs per item or per invoice; inconsistent choices can create reconciliation differences.", "HARD"],
    ]),
    notes: [
      {
        key: "low-level-design-foundations",
        title: "Foundations: responsibilities and behavioral contracts",
        excerpt: "Use cohesive responsibilities, explicit invariants, and carefully chosen abstractions to build a model that can evolve.",
        content: `# Foundations of low-level design

## Start with behavior

Read the use cases and write observable operations before drawing class boxes. For a parking facility, a driver enters, receives a ticket, pays, and exits. Maintenance can remove a space from service. Translate these into responsibilities: allocating capacity, tracking a session, calculating a charge, and settling a payment. A noun is only a candidate type; not every noun deserves an independently mutable object.

## Decide who owns invariants

A ticket cannot become paid twice for two unrelated transactions. A space cannot have two active assignments. Currency cannot silently change during arithmetic. Put each rule in the object or transactional service that has enough information to enforce it. Making every property public and validating only in the screen leaves background jobs and other callers free to bypass the same rules.

## Model identity and value separately

An entity is recognized across changes by identity. A ticket's fee or state may change while it remains the same ticket. A value object represents a validated value, such as a time interval or currency amount. Prefer immutability for values and define equality deliberately. A mutable object used as a map key can create surprising lookup behavior if equality depends on fields that later change.

## Use SOLID as diagnostic guidance

Single responsibility concerns reasons to change, not line count. Open-closed design isolates demonstrated variation. Substitutability requires behavioral compatibility, not merely matching signatures. Interface segregation follows client needs. Dependency inversion keeps domain policy independent of mechanisms such as a payment provider or database driver. None of these principles mandates a framework or a large inheritance tree.

## Prefer small, stable seams

Inject a clock where time affects behavior and a payment contract where an external effect occurs. Keep arithmetic and validation as ordinary pure code. Composition lets a ticket service combine pricing and allocation policies without requiring a subclass for every combination. Use inheritance only where callers can safely treat every subtype as the promised parent.

## Explain the tradeoff

A diagram should include a few representative method contracts, lifecycle transitions, and error outcomes. State why a boundary exists and what would make it change. A simple explicit implementation with tests is stronger than an elaborate pattern catalog that cannot explain who owns state or how an invalid transition is prevented.`,
      },
      {
        key: "low-level-design-application",
        title: "Application: design a testable parking workflow",
        excerpt: "Connect a domain model to persistence and external payment while keeping allocation and lifecycle rules explicit.",
        content: `# Applying low-level design

## Write a scenario matrix

Cover a compatible space, a full facility, an unsupported vehicle, a space under maintenance, an expired ticket, a duplicate payment callback, and simultaneous arrivals. The matrix defines behavior more precisely than a class diagram alone. Add expected domain outcomes and note which failures are temporary infrastructure errors.

## Build the core model

Use vehicle requirements and space capabilities rather than a long chain of vehicle-type conditionals. A ticket owns its session identity, entry time, and state. A pricing policy accepts a validated interval and returns a money value with currency. A facility service orchestrates allocation through a repository contract that guarantees atomic assignment. Avoid exposing an internal mutable list of spaces for callers to edit.

## Make transitions explicit

A representative flow is active, payment pending, paid, and closed. Failure during payment should not accidentally free a space before the exit policy allows it. Decide how cancellation, manual override, and lost tickets work. A small transition table is adequate when transitions are simple; separate state objects can help when state-specific behavior becomes substantial.

## Isolate external effects

The payment gateway has a typed outcome and an idempotency mechanism. Store the payment operation identity so a repeated callback can be recognized. A repository is not just a generic CRUD wrapper if the domain needs atomic allocation or settlement. State its concurrency contract, and make the test fake enforce the same important rules instead of always succeeding.

## Test with controlled dependencies

Pass a clock into time-dependent pricing. Verify exact boundaries such as the first billed interval and rounding rules. Use a real money value object, a small deterministic pricing implementation, and a fake gateway for provider timeouts. Test behavior rather than asserting every internal helper call. Add a concurrency test at the persistence boundary because isolated unit tests cannot prove cross-process exclusivity.

## Refactor when evidence appears

If a second allocation policy is introduced, extract a strategy behind a clear contract. If configuration becomes complex, use a builder that produces only validated complete objects. Do not add both patterns solely to demonstrate terminology. Finish with a sequence walkthrough for the happy path and one failure path, showing which component owns each decision, how errors propagate, and how a duplicate request is handled safely.`,
      },
      {
        key: "low-level-design-pitfalls",
        title: "Pitfalls: pattern theater, shared state, and weak tests",
        excerpt: "Spot designs that look sophisticated but obscure ownership, invalid transitions, or concurrency guarantees.",
        content: `# Low-level design pitfalls

## The god object

A single manager that parses inputs, prices tickets, writes SQL, sends messages, and formats receipts has many reasons to change. Split genuine policies and effects, then keep orchestration readable. Replacing the manager with dozens of tiny classes that forward every call is not necessarily better; useful boundaries should isolate independent behavior or dependencies.

## Anemic models and invisible rules

Plain data transfer objects are appropriate at an API boundary. Inside a domain, public mutable state can make invariants impossible to track. If every caller manually checks whether a ticket can close, one caller will eventually forget. Centralize lifecycle validation, and avoid returning writable internal collections. Encapsulation includes protecting indirect mutation paths.

## Inheritance for code reuse alone

A subtype that throws for an operation promised by its parent is often a sign that the hierarchy models implementation convenience rather than substitutability. Prefer composition or narrower capability contracts. Deep hierarchies also make behavior dependent on subtle overrides and constructor order. Show a concrete client use case that remains valid for every subtype before committing to inheritance.

## Hidden global dependencies

Global clocks, random generators, and mutable singletons make reproducibility harder. Tests can pass alone and fail together because state survives between them. Pass explicit dependencies with intentional lifetimes and reset resources through normal cleanup. A singleton database connection pool can be sensible, but it does not imply all consumers should share unrelated business state.

## Concurrency at the wrong boundary

A lock inside one object protects only callers sharing that exact object and process. Multiple service instances still race over persisted capacity. Match synchronization to the actual resource boundary: local locks for local state, database constraints or transactional operations for shared records. Also define lock ordering and timeouts so preventing races does not introduce deadlocks.

## Tests that fossilize the implementation

Tests tied to private helpers or exact mock call sequences become expensive during harmless refactors. Assert public outcomes, important external effects, and domain errors instead. Keep a few integration tests for storage semantics and contracts. A permissive fake can hide bugs if it allows impossible state or silently ignores uniqueness rules.

## Final review

Ask who creates each object, who may mutate it, who destroys or closes it, and what happens on partial failure. Check money representation, time boundaries, equality semantics, listener cleanup, and error classification. Patterns are vocabulary for explaining a solution, not a scorecard that rewards the most named techniques.`,
      },
    ],
    roadmap: roadmap("Implement a parking domain model", "Build a small domain library with concurrency-aware contracts and focused tests.", [
      ["Capture scenarios", "Write normal, invalid, duplicate, and concurrent arrival scenarios with expected outcomes.", 3],
      ["Model invariants", "Implement identity, money, intervals, and ticket transitions using validated immutable values.", 5],
      ["Separate policies", "Add pricing and allocation contracts with two justified policy implementations.", 4],
      ["Connect persistence", "Define and demonstrate atomic allocation plus idempotent payment settlement.", 6],
      ["Test boundaries", "Exercise clock boundaries, rounding, invalid transitions, provider failures, and competing allocations.", 5],
      ["Review and explain", "Present class and sequence diagrams; remove abstractions with no demonstrated purpose.", 3],
    ]),
    cheatSheet: {
      title: "Low-level design contracts at a glance",
      content: `# Low-level design quick reference

- **Responsibility:** a coherent reason to change; do not confuse it with one method per class.
- **Entity:** identity persists while attributes change. **Value object:** equality follows validated values.
- **Encapsulation:** protect invariants and indirect mutation through exposed collections.
- **Abstraction:** show the useful contract, hide irrelevant representation.
- **SRP:** separate pricing, rendering, storage, and delivery when they change independently.
- **OCP:** isolate a demonstrated varying algorithm; avoid a speculative plugin architecture.
- **LSP:** subtypes must preserve caller expectations, including preconditions and outcomes.
- **ISP:** expose capabilities each client actually uses.
- **DIP:** domain policy depends on contracts, not concrete external clients; injection need not use a container.
- **Strategy:** interchangeable policy. **Factory:** select an implementation. **Builder:** assemble a complex valid object.
- **State:** explicit legal transitions; a table may be simpler than state classes.
- **Observer:** define ordering, error handling, subscription lifetime, and delivery timing.
- **Repository:** specify atomicity and consistency for domain operations, not only generic CRUD.
- **Concurrency:** synchronize where the shared state truly lives; a local lock cannot protect multiple processes.
- **Money:** explicit currency, suitable decimal or minor units, and a documented rounding boundary.
- **Testing:** public behavior, invalid transitions, dependency failures, deterministic time, and integration checks for storage contracts.

Review question: can a caller bypass a rule by changing a returned object? If yes, the apparent private field may not provide real encapsulation.`,
    },
    quiz: quiz("Low-level design reasoning", [
      ["A receipt type computes tax and sends email. Which split is most justified?", ["One class for every property", "Separate accounting policy from email delivery", "A deeper receipt inheritance tree", "Make all methods static"], 1, "Tax policy and message delivery change for different reasons. Separating them creates a useful test and evolution boundary."],
      ["Which object is most naturally a value object?", ["A customer with a stable identifier", "An active reservation", "A currency amount with validated value and currency", "A mutable payment operation record"], 2, "A money value is identified by its contents rather than a persistent lifecycle identity, and immutability protects arithmetic assumptions."],
      ["A subtype rejects inputs accepted by its parent contract. Which concern is strongest?", ["Substitutability", "Builder completeness", "Observer cleanup", "Factory selection"], 0, "Strengthening preconditions means callers that work with the parent may fail with the subtype, violating behavioral substitutability."],
      ["How should expiry tests avoid depending on wall-clock timing?", ["Sleep longer in every test", "Ignore boundary cases", "Use a global mutable date in all tests", "Inject a controllable clock"], 3, "A controllable clock makes boundary behavior reproducible and isolates tests without adding real-time sleeps or shared mutable state."],
      ["Which guarantee cannot be supplied by a mutex in one service instance?", ["Exclusive access to that instance's memory", "Unique allocation across independent service processes", "Serialized local critical-section execution", "Protection of a shared local object"], 1, "Independent processes do not share that mutex. Cross-process allocation requires coordination at the actual shared storage boundary."],
      ["When is a strategy most useful?", ["When every field needs a setter", "When a class must have only one method", "When a demonstrated algorithm varies behind a stable contract", "When hiding all dependencies globally"], 2, "Strategy isolates meaningful policy variation, such as pricing algorithms, without requiring changes throughout the orchestration code."],
      ["What should a repository fake preserve?", ["Important production invariants and concurrency outcomes", "The exact database driver's private methods", "Unlimited successful writes regardless of constraints", "Only the happy-path return shape"], 0, "A fake that ignores essential uniqueness or state rules can make invalid business logic appear correct, so key contracts must remain represented."],
      ["What is the best reason to prefer composition here?", ["It always eliminates all interfaces", "It guarantees thread safety automatically", "It removes the need for tests", "Two behaviors vary independently without a true subtype relationship"], 3, "Composition combines independent policies without forcing a brittle inheritance hierarchy; it still requires clear contracts and tests."],
    ]),
};

type QuizEntry = [
  question: string,
  options: [string, string, string, string],
  correctIndex: number,
  explanation: string,
];
type StepEntry = [title: string, description: string, hours: number];

function questions(slug: string, entries: QuestionEntry[]): TopicContent["questions"] {
  return entries.map(([title, answer, difficulty = "MEDIUM"], index) => ({
    key: `${slug}-q${String(index + 1).padStart(2, "0")}`,
    title,
    prompt: title,
    answer,
    difficulty,
    tags: [slug, "interview-preparation"],
  }));
}

function roadmap(
  title: string,
  description: string,
  entries: StepEntry[]
): TopicContent["roadmap"] {
  return {
    title,
    description,
    estimatedHours: entries.reduce((total, step) => total + step[2], 0),
    steps: entries.map(([stepTitle, stepDescription, hours]) => ({
      title: stepTitle,
      description: stepDescription,
      hours,
    })),
  };
}

function quiz(title: string, entries: QuizEntry[]): TopicContent["quiz"] {
  return {
    title,
    questions: entries.map(([question, options, correctIndex, explanation]) => ({
      question,
      options,
      correctIndex,
      explanation,
    })),
  };
}

// Original lessons; references provide further reading, not reproduced answers.
// prettier-ignore
export const systemsContent: TopicContent[] = [
  {
    slug: "system-design",
    references: [
      {
        title: "System Design Tutorial",
        url: "https://www.geeksforgeeks.org/system-design/system-design-tutorial/",
        provider: "GeeksforGeeks",
      },
      {
        title: "System Design Interview Questions",
        url: "https://www.interviewbit.com/system-design-interview-questions/",
        provider: "InterviewBit",
      },
      {
        title: "Timeouts, Retries, and Backoff with Jitter",
        url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
        provider: "AWS",
      },
    ],
    questions: questions("system-design", [
      [
        "How do you turn an ambiguous product request into a design?",
        "Separate user journeys from quality constraints before selecting services. Ask which operations must succeed, expected peak traffic, acceptable staleness, and data retention. For a booking service, preventing double booking may matter more than a fresh search index. State assumptions explicitly so a reviewer can challenge the tradeoff rather than guess your intent.",
        "EASY",
      ],
      [
        "How do you estimate capacity without false precision?",
        "Start with active users, actions per user, payload size, and retention, then estimate average and peak rates separately. One million actions per day is roughly twelve per second on average, but a launch can be far burstier. Include replicas, indexes, and headroom in storage estimates; measure a prototype before treating an arithmetic estimate as a hardware requirement.",
      ],
      [
        "When is vertical scaling preferable to horizontal scaling?",
        "A larger machine is often the simplest improvement for a small transactional service because it preserves local coordination and avoids distributed failure modes. Horizontal scaling increases capacity and resilience only when state and load can be divided effectively. For example, stateless API replicas scale easily, while a single hot database row can remain a bottleneck regardless of replica count.",
      ],
      [
        "What does a load balancer actually solve?",
        "A load balancer distributes requests across healthy endpoints and can terminate transport connections, but it does not make shared storage reliable. Choose routing based on workload: least outstanding requests may suit variable-duration jobs better than round robin. Health checks must reflect ability to serve traffic; a process that responds while its required database is unreachable may still be unusable.",
        "EASY",
      ],
      [
        "How should you choose a cache strategy?",
        "Choose ownership and freshness first. Cache-aside loads on a miss and invalidates after writes, which is simple but permits stale windows and concurrent misses. A product catalog can accept a short TTL; an account balance often needs authoritative reads. Use bounded TTLs, eviction limits, and stampede protection rather than assuming a cache is always faster or always coherent.",
      ],
      [
        "How do SQL and document databases differ in a design decision?",
        "Choose by access patterns and invariants, not by a slogan about scalability. Relational transactions and constraints help orders with line items and payment state; document storage can make a self-contained profile efficient to retrieve. Both approaches can scale and both require schema discipline. Denormalization trades simpler reads for more complicated updates and reconciliation.",
      ],
      [
        "What can replication improve, and what can it break?",
        "Replicas can improve availability and distribute reads, but asynchronous replicas may lag and cannot automatically guarantee read-your-writes. After changing a profile, route the next read to the writer or use a version-aware policy if freshness matters. Replication also copies accidental deletes, so it is not a substitute for isolated backups and tested recovery.",
      ],
      [
        "How do you pick a shard key?",
        "A good key spreads load while keeping important queries local. Tenant ID can colocate a tenant's records, but one large tenant may dominate a shard; hashing distributes writes while making range scans harder. Plan routing, resharding, and cross-shard transactions before the dataset grows. Adding shards does little for a workload focused on one hot key.",
        "HARD",
      ],
      [
        "What does CAP mean during a network partition?",
        "During a partition, a distributed system cannot simultaneously guarantee every successful read sees the latest acknowledged write and that every request to a nonfailed node completes successfully. This is not a permanent choice of any two letters. A reservation service may reject uncertain writes to preserve exclusivity, while a social feed can serve older data and reconcile later.",
        "HARD",
      ],
      [
        "How do strong and eventual consistency affect the user experience?",
        "Strong consistency simplifies decisions that depend on a current shared value, while eventual consistency permits replicas to converge after independent updates. Choose the contract per operation: search results may lag, but checkout must validate inventory authoritatively. Tell users when a view is still processing and use version tokens or session guarantees where stale reads would be confusing.",
      ],
      [
        "Why is idempotency important for write APIs?",
        "A client may retry after a timeout even though the original write committed. Persist an idempotency key, request fingerprint, and outcome under an atomic uniqueness rule so the retry returns the same logical result. A payment endpoint should reject reuse with a different amount. The key needs a documented retention window; a request ID in a log alone does not prevent duplicate effects.",
      ],
      [
        "What guarantees should you expect from a message queue?",
        "Treat redelivery as normal unless the complete producer, broker, and consumer transaction boundary proves stronger guarantees. A worker may finish an effect and crash before acknowledging, so make consumption idempotent and acknowledge only after durable completion. For email delivery, record a delivery operation and reconcile provider outcomes; a broker's exactly-once feature does not cover every external side effect.",
      ],
      [
        "How does the transactional outbox prevent lost events?",
        "Write the business state and an outbox record in one local database transaction, then let a relay publish the record. This closes the gap where an order commits but its event is never sent. The relay can publish twice if it crashes before marking delivery, so consumers still deduplicate. The extra table and cleanup work buy recoverability rather than magical global atomicity.",
        "HARD",
      ],
      [
        "When would you use a saga instead of a distributed transaction?",
        "A saga coordinates local commits with compensating actions when a single atomic transaction across services is impractical. For a travel package, reserve a room, request payment, then release the room if payment fails. Compensation is a business operation, not time reversal: a sent notification cannot be unsent. Model intermediate states, retries, and manual repair explicitly.",
        "HARD",
      ],
      [
        "How do rate limiting and backpressure differ?",
        "Rate limiting controls admitted traffic using a policy such as a token bucket; backpressure signals that downstream capacity is saturated so producers slow down or stop. A report API might limit each tenant and also cap its worker queue. Return actionable retry guidance, preserve capacity for critical requests, and avoid unbounded buffering that merely postpones an outage.",
      ],
      [
        "How should a service retry transient failures?",
        "Use a total deadline, a bounded attempt count, exponential backoff, and jitter; retry only errors and operations that are safe to repeat. Several layers retrying independently can multiply traffic into a failing dependency. For a read request, propagate the remaining budget to each hop. For a write, combine retry policy with an idempotency contract instead of relying on hope.",
      ],
      [
        "What makes observability useful rather than noisy?",
        "Connect metrics, structured logs, and traces to user journeys and service objectives. A high CPU graph is less actionable than a sustained checkout error rate linked to a database timeout trace. Track tail latency, traffic, errors, and saturation, avoid sensitive payloads and unbounded metric labels, and give alerts owners plus a clear investigative next step.",
      ],
      [
        "How do you design disaster recovery?",
        "Define recovery point objective as acceptable lost data and recovery time objective as acceptable restoration delay. A cross-region replica may reduce recovery time but also propagate corruption; immutable backups address a different failure. Rehearse restoring data, credentials, routing, and dependencies together. A backup that has never been restored is evidence of copying, not evidence of recoverability.",
        "HARD",
      ],
      [
        "How would you structure a URL shortening service?",
        "Store a unique code mapped to a validated destination, use a unique constraint to resolve generated-code collisions, and keep redirects on a fast read path with caching. Separate analytics from redirect latency through asynchronous events. Decide expiration, abuse controls, and redirect semantics early; permanent redirects reduce repeat traffic but make destination changes harder because clients may cache them.",
      ],
      [
        "How do you evolve APIs and data models safely?",
        "Prefer additive changes and an expand-migrate-contract sequence: add the new field, deploy compatible readers and writers, backfill with bounded batches, then remove the old representation after verification. A rename done in one deployment can break older instances still running. Keep compatibility tests and rollback constraints visible because schema rollback is not equivalent to reverting application code.",
        "HARD",
      ],
    ]),
    notes: [
      {
        key: "system-design-foundations",
        title: "Foundations: requirements, invariants, and budgets",
        excerpt:
          "Build a defensible architecture from user journeys, explicit invariants, and measured capacity assumptions.",
        content: `# Foundations of system design

## Begin with the contract

An architecture is a set of decisions under constraints, not a collection of popular products. Write the main user journey in plain language: a customer searches, reserves an item, pays, and receives confirmation. Distinguish the required behavior from quality goals such as latency, availability, cost, privacy, and recovery time. Mark what is out of scope. Search ranking can be excluded from a reservation exercise without excluding inventory correctness.

## Identify invariants

An invariant is a rule that must survive concurrency and failure. "At most one active reservation per seat" is stronger than "the screen usually shows current seats." Place enforcement at an authoritative boundary, often a transaction and a uniqueness constraint. A cache or a frontend check can improve responsiveness but cannot independently enforce the rule when two clients race. Define what a failed or uncertain request means to the caller.

## Estimate before optimizing

Calculate average request rate from daily actions, then state a separate peak assumption. Estimate bytes per record multiplied by retained records; add indexes, replication, and backup overhead explicitly. Separate concurrent connections from requests per second and latency from throughput. Little's law relates average in-flight work to throughput and average time in a stable system, but it does not justify a queue that grows without bound. Use estimates to expose likely bottlenecks, then revise them with measurements.

## Choose boundaries deliberately

A modular monolith may keep transactions and operational ownership simple. Services can isolate scaling and team responsibilities, but introduce network delays, partial failures, compatibility requirements, and distributed tracing. Start with logical boundaries even if they share a deployment. Split when there is evidence that independent operation is worth the coordination cost.

## State the consistency model

Ask which readers require current data and which can tolerate delay. A catalog view can be eventually consistent while reservation creation checks the primary authority. Under a partition, preserving an exclusivity invariant may require refusing some requests. Document that refusal as part of the product behavior rather than promising uninterrupted success.

## Review artifact

Produce a diagram, an assumptions list, a table of invariants, and a short decision record. For each major choice, name an alternative and the condition that would make you reconsider it. This makes an interview explanation auditable and gives a production team a useful starting point for experiments.`,
      },
      {
        key: "system-design-application",
        title: "Application: a reliable reservation pipeline",
        excerpt:
          "Trace a reservation through storage, retries, events, observability, and recovery instead of stopping at a diagram.",
        content: `# Applying system design to reservations

## Define the synchronous path

The client supplies an item, a requested interval, and an idempotency key. Authenticate the caller, validate the payload, and check authorization before touching shared state. In one database transaction, enforce availability, create a reservation, and store an outbox event. Return the reservation identifier and a precise state such as pending payment. Do not describe pending work as confirmed.

## Handle uncertainty

A timeout means the client did not receive a result; it does not prove the transaction failed. Bind the idempotency key to the caller and a fingerprint of the intended operation. An identical retry retrieves the previous result, while a changed payload with the same key is rejected. Keep this mapping for a documented period that covers realistic retries. Use a status endpoint so clients can reconcile an uncertain outcome.

## Move optional work off the critical path

A relay publishes outbox events to a durable queue. A notification worker records its operation before calling a provider and handles redelivery. Analytics and search indexing can lag without blocking the reservation transaction. Monitor the oldest undelivered event as well as queue depth; a shallow queue can still contain one stuck, important message.

## Add caches selectively

Cache catalog descriptions and approximate availability for browsing. On checkout, validate availability against the source of truth. Use TTL jitter or request coalescing to reduce stampedes when a popular item's cache entry expires. Treat stale data as a declared browsing compromise, not an invisible change to purchase semantics.

## Test overload and failure

Exercise a traffic burst, a slow database, a worker crash after a side effect, and a lost response after commit. Bound concurrency and queues so overload produces controlled rejection instead of memory exhaustion. Use deadlines and jittered retries; ensure nested retries cannot amplify load without a cap. A circuit breaker can shed calls to a failing dependency, but needs an intentional recovery policy.

## Observe and recover

Track successful reservations, conflict responses, pending-state age, payment failure rate, and tail latency. Link logs with correlation identifiers without storing payment credentials. Define recovery point and recovery time objectives, then restore an isolated backup into a test environment and replay only safe operations. Finish with a runbook that tells an operator how to detect an inconsistency, stop further harm, and reconcile records using authoritative evidence.`,
      },
      {
        key: "system-design-pitfalls",
        title: "Pitfalls: hidden coupling and misleading guarantees",
        excerpt:
          "Recognize common failure amplifiers and replace vague availability claims with verifiable contracts.",
        content: `# System design pitfalls

## Distributed does not automatically mean resilient

Five services can share one database, one credential issuer, or one deployment pipeline. Their boxes on a diagram are not independent failure domains. Map dependencies and ask what happens when each one slows rather than fails cleanly. A timeout cascade often consumes threads and connection pools before any service declares itself down.

## Avoid guarantee inflation

"Exactly once" must identify the full boundary. A broker can deduplicate a publication while an external payment or email still repeats. Use durable idempotency records and reconciliation for effects outside a transaction. Likewise, "strong consistency" should refer to an operation and a storage contract, not every view in a multi-system product.

## Replicas and backups answer different questions

Replication helps when a machine disappears, but can reproduce a bad migration or an authorized accidental delete. Backups need retention, access isolation, integrity checks, and restoration drills. Multi-region routing is not a recovery plan unless data promotion, secrets, dependencies, and the possibility of conflicting writers are addressed.

## Caches introduce correctness work

Cache invalidation can race with a delayed read that refills an old value. Negative caching can hide newly created records. A shared hot key can overload the source of truth when it expires. Use version-aware writes where appropriate, keep authoritative checks for important mutations, and load-test expiration events rather than only steady-state hits.

## Watch amplification and cardinality

Retries at the client, gateway, service, and worker can turn one operation into many attempts. Unbounded labels such as user identifiers in metrics can make the observability system itself expensive or unstable. Limit retry budgets, aggregate metrics by useful dimensions, and keep detailed identifiers in protected logs or traces with retention controls.

## Resist premature sharding

Sharding changes uniqueness checks, transactions, pagination, and operations. It cannot solve a single hot key without changing the workload. Check query plans, indexes, payload sizes, and connection pooling before adopting it. If sharding is justified, test routing updates and data movement with concurrent traffic.

## Use a review checklist

For every component ask: who owns it, what data is authoritative, how does it fail, what is the timeout, what can be retried, and how is it restored? For every degraded mode ask what the user sees. A design is stronger when it honestly refuses an unsafe operation than when it promises impossible guarantees with no explanation of failure behavior.`,
      },
    ],
    roadmap: roadmap(
      "Design and review a reservation service",
      "Produce a runnable small prototype and evidence-based architecture review.",
      [
        ["Define scope", "Write journeys, invariants, peak assumptions, latency targets, and excluded features.", 3],
        ["Model persistence", "Create a local schema sketch and test two concurrent reservations against a uniqueness rule.", 5],
        ["Implement safe requests", "Prototype idempotency, validation, pagination, and a status lookup for uncertain outcomes.", 5],
        ["Add asynchronous work", "Demonstrate an outbox relay and deduplicating worker with crash-and-retry tests.", 6],
        ["Exercise reliability", "Load-test bursts, slow dependencies, bounded queues, and restore a sample backup.", 5],
        ["Present tradeoffs", "Write a decision record, operating runbook, and ten-minute design walkthrough with alternatives.", 3],
      ],
    ),
    cheatSheet: {
      title: "System design decision checklist",
      content: `# System design quick reference

- **Requirements:** name actors, journeys, exclusions, peak load, payload size, retention, and acceptable stale views.
- **Invariants:** identify what must never happen; enforce it at an authoritative transaction boundary.
- **Capacity:** average requests per second = daily requests / 86400. Add a separately justified peak factor and storage overhead.
- **Scaling:** vertical scaling buys simplicity; horizontal scaling needs partitionable work and externalized state.
- **Cache:** choose keys, TTL, eviction, invalidation, miss coalescing, and behavior when the cache fails.
- **Replication:** asynchronous reads can lag. Read-your-writes needs a deliberate routing or version policy.
- **Sharding:** balance load and query locality; consider hot tenants, resharding, and cross-shard operations.
- **Queues:** expect redelivery; acknowledge after durable completion, monitor age, and quarantine repeated failures.
- **Outbox:** commit state plus event locally; publish later; consumers still deduplicate.
- **Retries:** deadline + attempt limit + backoff + jitter + safe operation semantics.
- **Overload:** bounded concurrency, bounded queues, tenant limits, and clear rejection behavior.
- **Recovery:** RPO concerns lost data; RTO concerns restoration time. Restore drills matter more than backup-job success.
- **Observability:** user-facing SLOs, tail latency, saturation, correlated traces, and privacy-aware logs.
- **Review:** state an alternative, its cost, and the evidence that would make you change the decision.

Example: show approximate stock in search, but validate and decrement authoritative inventory atomically at checkout. Fast browsing and correct purchase state do not require identical consistency contracts.`,
    },
    quiz: quiz("System design reasoning", [
      ["A checkout write times out after the server commits. What best supports a safe retry?", ["A longer client timeout only", "A persisted idempotency key bound to the request", "A new random key on every retry", "Reading a possibly stale replica first"], 1, "A durable key associates repeat attempts with one logical result; the timeout alone cannot reveal whether the original write committed."],
      ["Which catalog operation can most naturally tolerate eventual consistency?", ["Charging a payment exactly as requested", "Enforcing the final inventory decrement", "Showing a recently edited product description", "Enforcing unique active seat reservations"], 2, "A delayed description is often an acceptable browsing compromise, while financial and exclusivity invariants require an authoritative decision."],
      ["What problem does an outbox directly address?", ["Atomicity between a local state change and recording its event", "All duplicate external side effects", "Automatic queue ordering across all producers", "Unlimited downstream throughput"], 0, "The same local transaction records state and publication intent. Delivery can still repeat, and consumers must handle duplicate events."],
      ["What is the strongest evidence that a backup supports recovery?", ["Its filename contains a recent date", "A replica is currently healthy", "A scheduled copy job returned success", "A complete restore drill met the recovery objectives"], 3, "A restore drill tests usable data and operational dependencies. Copy success and replication alone do not prove a system can be restored."],
      ["A queue grows continuously during a traffic burst. What is the most useful first control?", ["Increase retries at every layer", "Bound admission and worker concurrency", "Remove request deadlines", "Put every user ID in metric labels"], 1, "Bounded admission and concurrency prevent resource exhaustion; unbounded retries or buffering can amplify the initial capacity problem."],
      ["During a partition, an exclusive reservation system may need to do what?", ["Accept writes on both sides without coordination", "Serve every read from any local cache as current", "Reject writes whose uniqueness cannot be established", "Disable all backups until the partition heals"], 2, "Preserving exclusive ownership may require refusing an uncertain write. Availability of all requests cannot simply be promised during partition."],
      ["Why might a tenant-ID shard key perform poorly?", ["One unusually large tenant concentrates traffic", "It prevents storing tenant data together", "It removes the need for query routing", "It always requires a full-table scan for one tenant"], 0, "Colocation is useful, but a heavy tenant can create a hot shard. Distribution must be evaluated against real tenant sizes and request patterns."],
      ["Which alert best connects to a checkout reliability objective?", ["Any brief CPU spike", "Every individual successful request", "A daily count of deployed services", "Sustained elevated checkout failure rate"], 3, "A sustained failure rate reflects user-visible reliability and supports an actionable response; infrastructure signals provide investigation context."],
    ]),
  },
  lowLevelDesign,
  {
    slug: "devops",
    references: [
      { title: "DevOps Interview Questions", url: "https://www.interviewbit.com/devops-interview-questions/", provider: "InterviewBit" },
      { title: "DevOps Tutorial", url: "https://www.tpointtech.com/devops", provider: "JavaTpoint / TpointTech" },
      { title: "Kubernetes Overview", url: "https://kubernetes.io/docs/concepts/overview/", provider: "Kubernetes" },
      { title: "Configure Liveness, Readiness and Startup Probes", url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", provider: "Kubernetes" },
    ],
    questions: questions("devops", [
      ["What is DevOps beyond a collection of tools?", "DevOps is a way of organizing delivery and operation around shared ownership, fast feedback, and repeatable change. A team that uses containers but hands every production problem to another group still has a coordination gap. Start with a small improvement such as a reproducible deployment and shared incident review; tool adoption is useful only when it improves outcomes.", "EASY"],
      ["How do continuous integration, delivery, and deployment differ?", "Continuous integration frequently combines changes with automated checks. Continuous delivery keeps a tested artifact ready for release, possibly with approval; continuous deployment automatically releases qualifying changes. A regulated product may retain an approval gate while still delivering continuously. The important distinction is readiness versus automatic production release, not a particular pipeline vendor.", "EASY"],
      ["What belongs in a trustworthy build pipeline?", "Run reproducible dependency installation, static checks, focused tests, and artifact creation in a controlled environment. Associate the output with a source revision and dependency evidence, then promote the same artifact rather than rebuilding for production. A passing build is not enough if mutable dependencies or untrusted scripts can change the result after review."],
      ["Why are immutable artifacts useful?", "An immutable artifact gives staging and production the same application bytes, making investigation and rollback more reliable. Inject environment-specific configuration separately and record its version. Rebuilding the same commit for each environment can still produce different dependency content, so a commit identifier alone is weaker than a verified artifact digest."],
      ["What does infrastructure as code provide?", "Infrastructure as code records desired resources in version-controlled definitions that can be reviewed and applied repeatedly. It improves traceability but does not automatically prevent destructive changes or secrets leakage. Review plans, restrict apply permissions, protect state, and test changes in a safe environment. Manual emergency changes should be reconciled to avoid persistent drift."],
      ["How should secrets reach an application?", "Retrieve secrets through a controlled secret manager or runtime identity with least privilege; avoid baking them into images, source, or command logs. Rotate credentials and test how applications reload them. Short-lived workload credentials reduce exposure, but a compromised workload can still exercise its granted permissions, so narrow authorization remains necessary."],
      ["How do containers differ from virtual machines?", "Containers isolate processes while normally sharing the host kernel; virtual machines provide a guest operating system through a virtualization boundary. Containers are efficient for packaging services, but are not a universal security boundary equivalent to a separate VM. Minimize privileges, patch the host, and choose stronger isolation when the workload or tenancy risk requires it.", "EASY"],
      ["What makes a container image production-ready?", "Use a suitable minimal base, a non-root runtime where feasible, pinned or verified inputs, and a build process that excludes secrets and unnecessary tooling. Separate build dependencies from runtime content with staged builds. Smaller images reduce distribution cost and attack surface, but they still need vulnerability review, provenance, and a working debugging strategy."],
      ["What does Kubernetes reconcile?", "Kubernetes controllers compare desired state with observed cluster state and act to reduce the difference. A Deployment can replace failed Pods, but it cannot infer business correctness or repair corrupted application data. Declare resources, health behavior, and placement needs accurately; the platform automates a specified operational contract rather than inventing one for the application."],
      ["How do readiness, liveness, and startup probes differ?", "Readiness indicates whether a container should receive service traffic; liveness can trigger a restart when the container is unhealthy; startup probes protect slow initialization before other probes take over. A transient shared database outage should not automatically cause every container to restart. Choose checks according to the failure that a restart can actually repair."],
      ["How do resource requests and limits affect workloads?", "Requests help the scheduler place workloads based on expected resource needs, while limits constrain resource use. CPU limiting can cause throttling and memory limit violations can lead to termination. Measure realistic consumption rather than copying arbitrary values; a service with low average memory but large bursts needs different sizing from a steady worker."],
      ["When do rolling, blue-green, and canary releases make sense?", "Rolling releases replace instances gradually, blue-green maintains separate environments for a switch, and canary exposes a limited cohort before expansion. Canary helps detect application regressions but needs representative traffic and measurable gates. All strategies must address shared data and schema compatibility; switching traffic cannot undo a destructive migration."],
      ["How do you make a database migration deployment-safe?", "Use compatible stages: add new structures, deploy code that tolerates both versions, backfill in bounded batches, and remove old structures later. Check locks, duration, and old-instance behavior. For example, a one-step column rename can break instances from the previous release; reverting the image does not recreate deleted data or automatically restore compatibility.", "HARD"],
      ["How can a rollback fail even with an older image available?", "The older image may expect an old schema, a different configuration, or a message format no longer produced. Record these compatibility constraints and test rollback while mixed versions exist. A feature flag can reduce exposure without reverting binaries, but flags also need ownership and cleanup so old branches do not become permanent hidden complexity.", "HARD"],
      ["What are useful service-level indicators and objectives?", "An indicator measures user-visible behavior, such as successful API responses within a latency target; an objective defines the desired proportion over a window. An error budget makes reliability tradeoffs explicit. CPU usage is an investigation signal, not necessarily a user objective. Define which failures count so the team does not improve a metric merely by excluding inconvenient traffic."],
      ["How should alerts be designed?", "Alert on actionable symptoms and sustained risk, attach ownership and a runbook, and group related events to reduce noise. A single transient failure can be logged without waking someone; a sustained critical-path error rate may warrant escalation. Review false positives and missed incidents because an alert that is always ignored becomes an operational liability."],
      ["What should incident response prioritize?", "Stabilize the user impact first, establish an incident lead and communications rhythm, and preserve a timeline for later analysis. A reversible traffic reduction can be safer than several simultaneous speculative fixes. After recovery, examine contributing system conditions without blaming individuals and assign specific improvements with owners and verification criteria."],
      ["What does software supply-chain security require?", "Protect source review, dependency resolution, build identity, artifact provenance, and deployment authorization as one chain. Dependency scanning detects known issues but cannot prove an artifact came from the approved build. Verify digests and provenance, restrict pipeline tokens, and review third-party automation because a trusted release path can otherwise promote untrusted bytes.", "HARD"],
      ["How should backup drills fit into operations?", "Test recovery on a schedule using isolated environments, realistic dependencies, and explicit time and data-loss objectives. Verify not only database rows but application startup, credentials, routing, and authorization. A successful scheduled backup job proves the copy step ran; only a restoration exercise shows whether the team can use it during an outage."],
      ["Which delivery metrics support improvement without encouraging gaming?", "Use trends such as change lead time, deployment frequency, failed-change rate, and recovery time together with product and reliability context. A team can inflate deployment counts with trivial changes or hide failures by redefining them. Metrics should identify bottlenecks and guide experiments, not rank individuals or replace judgment about user outcomes."],
    ]),
    notes: [
      {
        key: "devops-foundations",
        title: "Foundations: delivery as an observable system",
        excerpt: "Connect collaboration, repeatability, feedback, and operational ownership before selecting automation products.",
        content: `# DevOps foundations

## Shared ownership

Development and operation are parts of the same product lifecycle. A release is not complete merely because an artifact reached a server; the service must work for users and be supportable when it fails. Shared ownership means agreeing on quality gates, incident responsibilities, and feedback loops. It does not mean everyone must become an expert in every infrastructure product.

## Repeatable delivery

Keep source and infrastructure definitions under review. Build with a reproducible dependency process, run appropriate tests, and identify the resulting artifact by digest. Promote that artifact across environments with separate controlled configuration. Continuous integration gives frequent feedback on combined changes. Continuous delivery maintains release readiness, while continuous deployment removes a manual release decision for qualifying changes.

## Treat environments as intentional configurations

Development, staging, and production need different scale and access policies, but accidental differences create unreliable evidence. Record configuration, protect secrets, and make deployment prerequisites explicit. Infrastructure state may contain sensitive values and needs controlled storage and access. Review proposed destructive changes before applying them, and reconcile manual emergency fixes afterward.

## Understand runtime packaging

A container bundles the application and its user-space dependencies, usually sharing the host kernel. It is not a tiny virtual machine with an independent kernel. Prefer minimal runtime contents, non-root execution where appropriate, and narrow privileges. Pin or verify inputs, keep secrets outside image layers, and record provenance. Packaging does not remove the need to patch hosts or review application vulnerabilities.

## Observe user outcomes

Use service-level indicators tied to critical journeys: successful requests, completion latency, and freshness where relevant. Define objectives and measurement windows before an incident. Logs and traces provide context, while metrics summarize trends. Keep sensitive payloads out of telemetry and avoid labels whose values grow with every user or request.

## Improve the system, not the scoreboard

Delivery and recovery metrics can reveal slow reviews, flaky tests, or risky releases. Compare trends in context rather than rewarding deployment count alone. Finish an improvement cycle with a hypothesis, a bounded change, and evidence. For example, promoting one artifact instead of rebuilding per environment should reduce unexplained differences; verify that outcome rather than assuming the automation succeeded because the pipeline is green.`,
      },
      {
        key: "devops-application",
        title: "Application: an auditable release pipeline",
        excerpt: "Build once, deploy progressively, check user-facing signals, and rehearse recovery with compatible data changes.",
        content: `# Applying DevOps to a service

## Create a pipeline contract

Choose a small service with one critical user journey. Require source review, static checks, unit tests, and a focused integration test before creating an artifact. Record the source revision, artifact digest, dependency inventory, and build identity. Separate untrusted contribution checks from jobs allowed to publish or deploy, and grant each job only the permissions it needs.

## Externalize configuration

Put nonsecret settings in versioned configuration and obtain secrets at runtime through a controlled identity. Verify that missing configuration fails clearly rather than silently choosing unsafe defaults. Test credential rotation. Avoid echoing secrets in a shell trace or passing them into image build layers that remain recoverable even after later deletion.

## Define runtime behavior

Declare resource requests and limits based on measurements. Use readiness to remove an instance from traffic when it cannot serve, liveness only for a condition a restart can fix, and startup protection for slow initialization. Graceful termination should stop new work, finish or safely hand off accepted work, and close connections within the deployment grace period.

## Release progressively

Start with a limited cohort and compare error rate, latency, saturation, and a domain-specific completion signal. Establish rollback or stop criteria before deployment. Expand exposure only after an observation window with representative traffic. A quiet canary with no meaningful users proves little. Record configuration and schema versions alongside the image so the complete release can be reconstructed.

## Migrate data compatibly

Add a new column or representation first, deploy compatible code, then backfill with bounded batches. Verify progress and correctness before switching reads. Remove the old structure only after older versions no longer require it. Test failure during backfill and rollback during mixed-version operation; a successful forward migration alone is incomplete evidence.

## Close the operational loop

Write a runbook with detection, triage, safe mitigation, escalation, and recovery checks. Simulate a provider outage and a bad release in a safe environment. Practice restoring a backup with required identities and dependencies. After the exercise, update alerts and automation based on what actually slowed diagnosis. The output is a repeatable release and recovery process, not merely a configuration file for a CI server.`,
      },
      {
        key: "devops-pitfalls",
        title: "Pitfalls: unsafe automation and misleading green checks",
        excerpt: "Find operational gaps in probes, releases, credentials, backups, and metrics before they become incidents.",
        content: `# DevOps pitfalls

## Automating an unsafe process

Automation makes a procedure faster and more repeatable, including its mistakes. A pipeline with broad cloud credentials and no review boundary can consistently deploy malicious or accidental changes. Separate build, publication, and deployment permissions. Review external automation dependencies, protect environment approvals, and verify that the promoted artifact is the one that passed checks.

## Rebuilds that invalidate evidence

The same commit can resolve different packages or base images at different times. Building independently for staging and production weakens the claim that staging tested production bytes. Promote immutable artifacts and record configuration changes separately. A digest is useful evidence, but only if the build and verification path that produced it is trusted.

## Probe-induced outages

A liveness check that restarts every instance during a shared dependency outage can destroy useful warm state and increase pressure during recovery. Readiness and liveness answer different questions. Slow startup also needs an intentional allowance; otherwise a healthy but initializing process may be killed forever. Test probe behavior under realistic latency and dependency failures.

## Rollback assumptions

An older image may be incompatible with a new schema or queued event format. Blue-green traffic switching does not restore deleted records. Plan expand-and-contract migrations, document rollback limits, and prefer reversible mitigations where practical. Feature flags reduce blast radius but must have owners, expiry decisions, and tests for meaningful branches.

## Secret sprawl

Secrets copied into source, pipeline variables, image layers, or logs spread across retention systems. A later deletion from the working tree does not revoke them. Use runtime identities and a secret manager, narrow access, rotate after exposure, and check audit trails. Keep sensitive infrastructure state protected too.

## Observability without action

Large dashboards can coexist with poor incident response. Alerts need a user-impact rationale, an owner, a useful threshold, and a next step. Avoid one alert per noisy symptom when one dependency failure produces many related events. Review telemetry privacy and retention so diagnosis does not create a second problem.

## Recovery and learning

Backup success is not restore success, and a written runbook is not a rehearsed response. Exercise both in isolation and measure the actual delay. After an incident, identify technical and organizational contributing factors without scapegoating. Improvements should have a concrete owner and a testable outcome, not a vague instruction to be more careful next time.`,
      },
    ],
    roadmap: roadmap("Build a release and recovery practice", "Operate a small service with auditable artifacts, progressive rollout, and tested recovery.", [
      ["Map delivery", "Draw the current change path and agree on one user-facing reliability objective.", 3],
      ["Build reproducibly", "Create checks, immutable artifacts, digest records, and a restricted publication job.", 5],
      ["Declare runtime", "Define infrastructure, runtime configuration, secret access, probes, and resource sizing.", 6],
      ["Release safely", "Practice a canary rollout with prewritten stop criteria and a compatible schema change.", 6],
      ["Instrument and respond", "Add useful alerts and rehearse a dependency failure using a short runbook.", 4],
      ["Restore and improve", "Restore sample data in isolation, measure recovery, and fix the observed bottleneck.", 4],
    ]),
    cheatSheet: {
      title: "DevOps release safety checklist",
      content: `# DevOps quick reference

- **CI:** integrate frequently and validate combined changes. **Delivery:** keep changes ready to release. **Deployment:** qualifying changes release automatically.
- **Build once:** promote the same immutable artifact; record digest, revision, dependencies, and provenance.
- **Permissions:** separate untrusted checks from publication and production deployment identities.
- **Infrastructure:** review desired state and destructive plans; protect state and reconcile manual drift.
- **Secrets:** runtime identity or secret manager; no source, image layers, or log exposure; test rotation.
- **Containers:** shared host kernel in normal operation; minimal contents, narrow privileges, suitable patching.
- **Readiness:** traffic eligibility. **Liveness:** restart-worthy unhealthy state. **Startup:** initialization allowance.
- **Resources:** requests guide scheduling; limits constrain use; measure bursts and throttling.
- **Rollout:** rolling, blue-green, or canary according to risk and cost; define stop criteria before release.
- **Schema:** expand, migrate, verify, contract; preserve mixed-version compatibility.
- **SLO:** user-facing objective over a window. **Error budget:** explicit room for unreliability and change risk.
- **Incident:** stabilize, coordinate, communicate, preserve a timeline, then learn without blame.
- **Recovery:** restore data plus credentials, routing, and dependencies; measure actual RPO and RTO.
- **Metrics:** use lead time, release frequency, failed changes, and recovery trends together; avoid individual rankings.

A green pipeline verifies only its declared checks. It does not prove safe permissions, representative traffic, data compatibility, or recoverability unless those are intentionally tested.`,
    },
    quiz: quiz("DevOps operational judgment", [
      ["What distinguishes continuous delivery from continuous deployment?", ["Delivery never builds artifacts", "Deployment automatically releases qualifying changes", "Delivery requires manual tests only", "Deployment excludes integration checks"], 1, "Continuous delivery preserves release readiness, potentially with approval; continuous deployment automatically releases changes that meet its gates."],
      ["Which artifact practice best preserves staging evidence?", ["Rebuild the same commit in production", "Use a mutable latest tag only", "Promote the exact verified digest", "Copy source directly to running servers"], 2, "Promoting identical bytes avoids new dependency resolution or base-image differences between the artifact tested and the artifact released."],
      ["Which probe answers whether a Pod should receive service traffic?", ["Readiness", "Liveness", "Startup only", "A deployment approval gate"], 0, "Readiness controls eligibility for traffic. Liveness is for restart decisions, and startup probes allow initialization time."],
      ["A database migration deletes a field required by the previous release. What is the main rollback risk?", ["The old image becomes larger", "CPU requests stop working", "Container digests change automatically", "The previous code is incompatible with the new schema"], 3, "An old artifact cannot restore its required data contract automatically; migrations need compatibility stages and explicit rollback limits."],
      ["Which response best handles a shared dependency outage?", ["Restart every process every few seconds", "Use intentional readiness behavior and bounded retries", "Remove all deadlines", "Automatically scale retries without a cap"], 1, "Readiness and bounded retries can reduce unsafe traffic and amplification. Restarts may worsen a shared outage they cannot fix."],
      ["What is the best evidence of usable disaster recovery?", ["A backup job reported success", "A dashboard has a green icon", "A rehearsed complete restore meets stated objectives", "The deployment frequency increased"], 2, "A full rehearsal exercises data integrity and required dependencies, while a successful copy job verifies only one part of recovery."],
      ["Which SLI best captures a critical API's user experience?", ["Proportion of successful requests within the target latency", "Number of container images stored", "Count of engineers on call", "Total lines in the pipeline file"], 0, "Success and latency describe whether users can complete the journey; tooling counts do not directly measure service reliability."],
      ["What should a useful post-incident improvement include?", ["A general reminder to avoid mistakes", "An individual blame ranking", "Only a larger dashboard", "An owner and a verifiable change to contributing conditions"], 3, "Concrete, owned, testable improvements change the system that enabled the incident and support learning without scapegoating."],
    ]),
  },
  {
    slug: "aws",
    references: [
      { title: "AWS Interview Questions", url: "https://www.interviewbit.com/aws-interview-questions/", provider: "InterviewBit" },
      { title: "AWS Well-Architected Framework", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html", provider: "AWS" },
      { title: "What is Amazon S3?", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html", provider: "AWS" },
      { title: "Configuring and Managing a Multi-AZ Deployment", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html", provider: "AWS" },
    ],
    questions: questions("aws", [
      ["What is the AWS shared responsibility model?", "AWS protects the underlying cloud infrastructure, while customers remain responsible for how they configure and use services, including data, identities, and application behavior. The boundary changes by service: EC2 requires guest operating-system management, whereas a managed database offloads more infrastructure work. Managed does not mean that access policy, backups, or application security can be ignored.", "EASY"],
      ["How do Regions and Availability Zones affect availability?", "A Region is a geographic service area and Availability Zones provide distinct infrastructure locations within it. Deploying across Zones helps with some localized failures; cross-Region recovery addresses a different class of disruption and adds data, latency, and cost complexity. Confirm the chosen service's actual deployment model instead of assuming every resource is automatically multi-Zone.", "EASY"],
      ["Why prefer IAM roles over embedded access keys?", "Roles supply temporary credentials to an authorized workload or principal without distributing permanent keys in source or images. Scope the role to the operations and resources required, and distinguish trust policy from permission policy. Temporary credentials reduce credential lifetime, but excessive permissions still make a compromised workload dangerous."],
      ["How do VPC subnets and routes determine network reachability?", "A subnet's route table determines available paths, while security controls determine allowed traffic. A route to an internet gateway makes a subnet public in routing terms, but an instance also needs suitable addressing and permissions to communicate directly. Private workloads may use NAT for outbound IPv4 or service endpoints for supported AWS services; those choices have different exposure and costs."],
      ["How do security groups and network ACLs differ?", "Security groups act as stateful allow rules attached to network interfaces or supported resources, while network ACLs are stateless subnet controls with allow and deny rules. Return traffic behavior and rule ordering differ, so copying the same rules between them is unreliable. Prefer narrow resource access and use subnet controls deliberately rather than assuming they replace application authorization."],
      ["When should you choose EC2, containers, or Lambda?", "Choose by runtime needs, traffic shape, control, and operational effort. EC2 gives broad machine control; containers provide portable packaging with orchestration options; Lambda suits supported event-driven tasks within its service constraints. A long-running specialized workload may need EC2 or containers, while a short bursty event handler can benefit from Lambda despite cold-start and concurrency considerations."],
      ["How do Application and Network Load Balancers differ?", "An Application Load Balancer supports application-layer routing such as HTTP paths and hostnames, while a Network Load Balancer handles transport-layer connections for supported protocols. Select based on protocol and routing requirements rather than name familiarity. Health checks, TLS handling, client-address requirements, and target behavior still need explicit configuration."],
      ["What makes an Auto Scaling policy effective?", "Use a signal that tracks useful demand, configure minimum capacity and warmup, and check downstream bottlenecks. CPU can be appropriate for compute-heavy requests, while queue age or requests per target may better describe other workloads. Scaling API instances will not fix a saturated database, and reactive scaling needs headroom for the time required to add usable capacity."],
      ["How should you secure and organize S3 storage?", "Treat S3 as object storage, not a mounted transactional filesystem. Use appropriate bucket policies, public-access controls, encryption, versioning, and lifecycle rules for the data's needs. Keep object naming and retention intentional. Strong consistency for documented object operations does not create a multi-object transaction, and versioning alone does not isolate backups from every destructive actor."],
      ["How do S3 storage classes change cost decisions?", "Compare access frequency, retrieval latency, minimum storage duration, request costs, and data-transfer patterns. Archival storage may suit infrequently accessed backups but be unsuitable for interactive reads requiring immediate availability. Lifecycle transitions should follow measured usage and recovery objectives; a lower storage price can be offset by retrieval or early-deletion charges."],
      ["How do CloudFront and a regional load balancer complement each other?", "CloudFront can cache and deliver content through edge locations, while the regional load balancer routes origin traffic to application targets. Define cache keys and private-content behavior carefully so responses are neither over-fragmented nor shared across unauthorized users. A CDN reduces some origin traffic but does not fix an application that caches personalized data under a public key."],
      ["What is the difference between RDS Multi-AZ and read replicas?", "Multi-AZ deployment options primarily address availability, while read replicas are commonly used to scale or isolate reads and can lag. Some Multi-AZ architectures offer readable standby capacity, so inspect the selected engine and deployment type instead of making a universal claim. Read scaling, failover behavior, and consistency are separate decisions.", "HARD"],
      ["How should you design DynamoDB access patterns?", "Begin with the exact queries, partition-key distribution, item size, and throughput pattern. A suitable composite key can make a query efficient, but a hot partition key can concentrate traffic. Secondary indexes introduce their own cost and consistency behavior. Avoid substituting scans for deliberate modeling, and use conditional writes when state transitions need guarded updates.", "HARD"],
      ["When would you use SQS, SNS, or EventBridge?", "SQS buffers work for consumers, SNS distributes publications to subscribers, and EventBridge routes events using supported event-bus patterns and integrations. They can be combined; a topic can fan out into queues with independent consumers. Check the exact service and queue-type delivery contract, configure retries and dead-letter handling, and make side-effecting consumers idempotent."],
      ["What should a Lambda handler consider beyond its code?", "Configure execution role, memory, timeout, concurrency, retries, and event-source behavior. Reuse suitable clients across invocations but do not rely on process memory as durable business state. Different event sources have different failure and retry semantics, so a payment handler needs persistent idempotency rather than assuming one invocation equals one effect."],
      ["How do CloudWatch and CloudTrail support different investigations?", "CloudWatch provides monitoring capabilities such as metrics, logs, and alarms; CloudTrail records supported account and API activity for audit and investigation. A latency regression often begins with operational telemetry, while a policy change investigation uses audit events. Enable and retain the relevant trails and event categories; neither tool automatically captures every business event."],
      ["How does KMS encryption differ from authorization?", "KMS supports managed cryptographic keys and key-use controls, while service and identity policies determine who may access resources. Encrypting an object does not make an overly broad read policy safe. Design both data access and decrypt permissions, track key ownership and rotation needs, and test recovery paths so encrypted backups remain usable by authorized recovery operators."],
      ["How do you control cloud cost without harming reliability?", "Tag ownership, review utilization and transfer costs, set budgets and alerts, and right-size only after understanding workload peaks and recovery needs. Spot capacity can suit interruptible batch jobs but requires checkpointing or retry plans. Commitments may reduce eligible steady-state cost, yet buying them before measuring stable demand can lock in waste rather than eliminate it."],
      ["What does the Well-Architected Framework help you review?", "The framework organizes tradeoffs across operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability. Use it to ask evidence-based questions about a workload, not to claim that using AWS services automatically meets best practices. A cheaper single-Zone design may be acceptable for a rebuildable batch task but not for a critical availability objective."],
      ["How should an AWS disaster recovery plan be tested?", "Choose recovery time and recovery point objectives, then rehearse restoring data and the supporting identities, keys, network paths, and application configuration. Cross-Region replication alone can copy corruption and does not validate promotion. Record manual steps and conflicts between writers. A drill in an isolated account or environment can reveal gaps without risking live users.", "HARD"],
    ]),
    notes: [
      {
        key: "aws-foundations",
        title: "Foundations: boundaries, identities, and service selection",
        excerpt: "Understand responsibility and deployment scope before composing AWS services into a workload.",
        content: `# AWS foundations

## Begin with responsibility

Cloud services shift operational work; they do not remove accountability for data and access. AWS operates the underlying infrastructure, while customers configure identities, resource policies, data handling, and application behavior. EC2 includes guest operating-system responsibilities. Managed services move more of that work to AWS, but still require appropriate security, retention, monitoring, and recovery configuration.

## Understand deployment scope

A Region contains multiple Availability Zones. Distributing workload across Zones can reduce exposure to some localized failures, while a second Region introduces a separate recovery or serving strategy with additional complexity. Check each service's resource scope and selected configuration. Do not assume that a single instance, bucket access pattern, or database option has the same availability behavior as another service.

## Use identity deliberately

Prefer roles and temporary credentials for workloads. A role's trust policy defines who can assume it; permissions define allowed actions and resources. Restrict both, and account for resource policies and explicit denies in the effective authorization decision. Separate production and learning environments, review access regularly, and keep emergency access auditable. Encryption is complementary to authorization, not a substitute.

## Read the network path

A VPC groups controlled networking. Subnets, route tables, gateways, endpoints, security groups, and network ACLs together determine connectivity. A public route alone does not grant every instance internet access, and a private subnet alone does not prove a workload is secure. Draw the path for inbound application requests and outbound dependencies, including address translation and service endpoints where used.

## Match service to workload

Use EC2 for machine-level control, containers for packaged runtime workloads, and Lambda for suitable event-driven execution within its constraints. Choose S3 for objects, a relational database for relational invariants and queries, and DynamoDB when access patterns and key design fit. Product names are not enough: document latency, consistency, operational burden, and expected cost.

## Review across quality dimensions

The Well-Architected Framework helps organize questions about operations, security, reliability, performance, cost, and sustainability. A design should explain why its availability and resource use are proportionate to the workload. Keep an assumptions list, ownership map, and decision record. Revisit them after measuring real traffic rather than treating the first architecture sketch as permanent.`,
      },
      {
        key: "aws-application",
        title: "Application: a small secure asynchronous service",
        excerpt: "Combine private compute, object storage, queues, access policies, and recovery evidence for a practical AWS exercise.",
        content: `# Applying AWS to an upload-processing service

## Define the journey

An authenticated user uploads a file, requests processing, and later retrieves a result. Decide file size, retention, expected burst rate, processing time, and what the user sees while work is pending. Validate ownership and input type before creating work. Keep this exercise separate from production accounts and place a cost budget on it before provisioning resources.

## Separate storage and execution

Use S3 for the original object and processed output. Assign a stable operation identifier to the job and store its lifecycle in an appropriate database. Compute may be Lambda for short supported tasks or containers for longer specialized processing. An SQS queue buffers jobs; a failed consumer can receive the same message again, so persist completion state and make repeated execution safe.

## Scope access

Give the upload path only the intended object permissions and processing workers only the buckets, prefixes, queue operations, and key-use permissions they need. A presigned request is a temporary authorization mechanism, not input validation or proof of object ownership. Configure public-access controls and encryption intentionally, and avoid storing sensitive file contents in application logs.

## Bound failure and load

Set execution timeouts, concurrency, visibility behavior, and dead-letter handling according to the actual processing duration. Monitor queue age as well as count, and decide how an operator retries quarantined jobs. Autoscaling must account for downstream limits; unlimited workers can overwhelm a database or external API even when the queue is healthy.

## Expose progress accurately

Return pending, processing, completed, or failed states rather than treating acceptance as completion. A status lookup uses the operation identity and authorization checks. For cached result downloads, define a cache key and private-content policy so one user's result is never served to another. Track successful processing, error rate, latency, and old pending jobs.

## Test recovery and cost

Retry a job after a worker stops mid-operation, rotate a credential path, deny an expected permission, and restore sample metadata and objects in an isolated environment. Verify KMS and identity access needed during recovery. Review storage, requests, transfer, and compute costs, then remove exercise resources through the managed definitions. The final evidence is a safe repeated operation and a tested recovery path, not simply a console screenshot.`,
      },
      {
        key: "aws-pitfalls",
        title: "Pitfalls: configuration assumptions and incomplete recovery",
        excerpt: "Avoid broad credentials, misleading database labels, unsafe caching, and cost choices that ignore actual usage.",
        content: `# AWS pitfalls

## Managed does not mean fully configured

Services may handle patching or replication while leaving important access, retention, and monitoring choices to the customer. Review the chosen service and deployment option rather than relying on a general statement that AWS handles everything. Missing audit coverage or broad application permissions can remain serious problems even when the infrastructure is healthy.

## Permanent credentials and broad policies

An embedded access key can leak through source history, images, and logs. A temporary role reduces duration but still needs narrow permissions. Review who can assume a role, what it can do, and whether resource policies expand access. Explicitly consider production boundaries and emergency access. Encryption cannot compensate for granting every workload permission to read and decrypt all data.

## Database names that hide tradeoffs

Multi-AZ and read replicas are not interchangeable labels for faster or safer databases. Inspect engine-specific behavior, replication delay, readable capacity, and failover mechanics. In DynamoDB, a poor partition key can concentrate traffic, and scans can become an expensive replacement for proper access-pattern design. Consistency requirements should be attached to individual reads and writes.

## Network shortcuts

Opening broad inbound rules to make a test work can turn a temporary troubleshooting step into permanent exposure. A public subnet does not require every resource to be publicly reachable. A private subnet may still have outbound access and risky application permissions. Draw routes and control layers; distinguish security-group statefulness from network-ACL stateless rules.

## Caching and event surprises

A CDN cache key that ignores identity can leak personalized output. A queue redelivery can repeat an external effect. Lambda event-source retries vary, so read the relevant contract and record operation identity durably. Configure dead-letter handling and recovery rather than silently dropping work after repeated failure.

## Cost without context

The cheapest storage price may include unsuitable retrieval delays or other charges. Interruptible compute needs restart or checkpoint behavior. Commitments make sense only against measured eligible demand. Consider transfer, requests, retained logs, idle resources, and failure headroom along with compute rates. Set budgets, but remember an alert is not necessarily a hard spending cap.

## Recovery completeness

Cross-Region copies do not prove the application can resume safely. Restore credentials, key access, network paths, schemas, and configuration together with data. Replication can propagate a mistake; backups require isolation and retention. Rehearse promotion and avoid conflicting writers during recovery. Record what was verified and what remains an assumption.`,
      },
    ],
    roadmap: roadmap("Deploy and recover a file-processing workload", "Use an isolated learning environment with scoped permissions and explicit cleanup.", [
      ["Set boundaries", "Create a workload diagram, learning budget, cleanup plan, and responsibility checklist.", 3],
      ["Define identity and network", "Design narrowly scoped roles and draw routes, security groups, and service access paths.", 5],
      ["Build storage and processing", "Configure object storage, metadata, a work queue, and a supported compute runtime.", 6],
      ["Test failure semantics", "Exercise duplicate jobs, timeouts, denied access, and dead-letter recovery.", 5],
      ["Monitor and optimize", "Add processing indicators, audit coverage, budget alerts, and a measured cost review.", 4],
      ["Rehearse recovery", "Restore sample data with required key and role access, document results, and clean up resources.", 5],
    ]),
    cheatSheet: {
      title: "AWS workload review checklist",
      content: `# AWS quick reference

- **Responsibility:** AWS secures underlying cloud infrastructure; customers configure data, identities, resources, and application behavior.
- **Region / AZ:** geographic service area versus distinct locations within it; inspect each resource's deployment model.
- **IAM role:** temporary workload credentials. Trust controls assumption; permissions control allowed operations.
- **VPC:** routes and addressing determine paths; security groups and network ACLs control allowed traffic.
- **Security group:** stateful allow controls. **Network ACL:** stateless ordered allow/deny subnet rules.
- **EC2 / containers / Lambda:** machine control, packaged workloads, or suitable event-driven execution; compare constraints and operations.
- **ALB / NLB:** application-layer routing versus transport-layer connections for supported protocols.
- **S3:** object storage; configure public-access controls, encryption, versioning, retention, and lifecycle costs.
- **RDS:** inspect engine and Multi-AZ option; availability and read scaling are separate goals.
- **DynamoDB:** model access patterns and distributed keys first; guarded transitions may use conditional writes.
- **SQS / SNS / EventBridge:** buffering, subscriber fan-out, and event routing; verify delivery contracts and deduplicate effects.
- **CloudWatch / CloudTrail:** operational monitoring versus supported account/API audit activity.
- **KMS:** cryptographic key control complements, but does not replace, authorization.
- **Cost:** ownership tags, budgets, measured sizing, transfer charges, retrieval needs, and interruptibility.
- **Recovery:** restore data plus keys, roles, routes, configuration, and dependencies; rehearse isolated recovery.

Before choosing a service, write its required latency, consistency, availability, and operational contract. Then check the exact official documentation for the configuration you intend to deploy.`,
    },
    quiz: quiz("AWS architecture judgment", [
      ["Which credential approach is preferable for an AWS workload?", ["A permanent key in the image", "A narrowly scoped role with temporary credentials", "An administrator key shared by all services", "A key printed into deployment logs"], 1, "A role avoids distributing permanent credentials and can restrict workload permissions, though its trust and access policies still require review."],
      ["Which statement best describes S3?", ["A multi-object relational transaction engine", "A replacement for all database indexes", "An object storage service with documented object-operation consistency", "A compute scheduler for containers"], 2, "S3 is object storage. Its object consistency contract does not make arbitrary changes across multiple objects a relational transaction."],
      ["Which control is stateful?", ["Security group", "Network ACL", "Subnet route table", "Object lifecycle rule"], 0, "Security groups track connection state for their allowed traffic; network ACLs are stateless and need appropriate return-traffic rules."],
      ["Why inspect the exact RDS deployment option?", ["All replicas are always synchronous and current", "Every option has identical readable capacity", "Read replicas eliminate backups", "Availability, readable capacity, and failover behavior vary"], 3, "RDS behavior depends on engine and deployment type. Multi-AZ availability and read-replica scaling should not be treated as universal equivalents."],
      ["A queue consumer repeats a completed external action after a crash. What is most useful?", ["Disable all monitoring", "Persist operation identity and handle redelivery idempotently", "Assume a message is delivered once", "Increase worker count without limits"], 1, "A crash can occur between the side effect and acknowledgement. Durable operation identity supports deduplication and reconciliation on redelivery."],
      ["Which service is most associated with supported account/API audit activity?", ["CloudFront", "Auto Scaling", "CloudTrail", "A subnet route table"], 2, "CloudTrail supports audit investigation of account and API activity when the relevant trails and event categories are configured."],
      ["What is a risk of archival storage for an interactive download path?", ["Retrieval latency and charges may not fit the journey", "Objects automatically become public", "All objects require relational joins", "It forces an EC2 instance per object"], 0, "Archival choices must match retrieval and retention needs; a low storage price alone does not ensure an interactive workload is suitable."],
      ["Which is essential to a recovery drill for encrypted backups?", ["Only a current billing dashboard", "Only a replica's healthy status", "Removing all role restrictions permanently", "Testing authorized key access and supporting dependencies"], 3, "Recovering encrypted data requires usable key and identity permissions along with application dependencies; a data copy alone is incomplete."],
    ]),
  },
  {
    slug: "behavioral-interview",
    references: [
      { title: "Behavioral Interview Questions", url: "https://www.interviewbit.com/behavioral-interview-questions/", provider: "InterviewBit" },
      { title: "Behavioral Interview Questions and Answers", url: "https://www.geeksforgeeks.org/blogs/behavioral-interview-questions-and-answers/", provider: "GeeksforGeeks" },
    ],
    questions: questions("behavioral-interview", [
      ["How should you structure an answer about past behavior?", "Use a truthful situation-task-action-result structure, then add reflection when useful. Keep context short and explain your own decisions without taking credit for everyone else's work. Illustrative framework: describe an actual coordination problem, the options you considered, the action you took, and the observed outcome. If no exact example exists, say so and clearly separate a hypothetical approach.", "EASY"],
      ["How can you discuss conflict without blaming colleagues?", "Describe the disagreement in terms of goals, constraints, and evidence rather than another person's character. Explain how you listened, tested assumptions, and reached or escalated a decision. Illustrative framework: compare speed and reliability concerns using a shared acceptance criterion. Report unresolved parts honestly; a thoughtful process can be valuable even when consensus was incomplete."],
      ["How should you answer a question about failure?", "Choose a real setback you can discuss safely, state your responsibility, and show the change in practice that followed. Avoid a disguised success story or an invented dramatic recovery. Illustrative framework: identify an assumption that proved wrong, the resulting impact, the repair, and how you later checked that the lesson was applied. Do not manufacture metrics you never measured."],
      ["How do you demonstrate leadership without a formal title?", "Leadership can mean clarifying a problem, coordinating work, or helping others make a sound decision; it does not require claiming management authority. Illustrative framework: explain a real moment when you organized options and made ownership clearer. Distinguish your contribution from the team's outcome, and acknowledge when a decision belonged to someone else."],
      ["What makes an answer about receiving feedback credible?", "Name the feedback accurately, explain your initial understanding, and describe a concrete adjustment plus follow-up. You do not need to pretend every criticism was easy to accept or unquestionably correct. Illustrative framework: summarize an actual review comment, ask what good performance would look like, try the change, and report what you observed rather than declaring instant transformation."],
      ["How should you explain giving difficult feedback?", "Describe a specific behavior and its impact, choose an appropriate private channel, and invite the other person's perspective. Avoid presenting public humiliation as candor. Illustrative framework: connect a recurring missed handoff to an agreed team standard and discuss an improvement together. Use a real example if available, while preserving confidentiality and not revealing private personnel details."],
      ["How do you discuss competing priorities?", "Explain how you compared urgency, importance, dependencies, and stakeholder commitments, then made tradeoffs visible. Do not claim that you solved every conflict by working indefinitely. Illustrative framework: use a real planning decision to show what was deferred, who agreed, and what risk remained. If priorities changed later, describe how you revisited the decision."],
      ["How can you answer a question about ambiguity?", "Show how you converted unknowns into questions, reversible experiments, and explicit assumptions. Asking for clarification is not a weakness when it reduces wasted work. Illustrative framework: start with an uncertain requirement, define a small test or decision checkpoint, and explain how evidence narrowed the options. Be honest about the uncertainty that remained after the decision."],
      ["How should you describe a missed deadline?", "State what was promised, when you recognized the risk, and how you communicated impact and options. Accept responsibility for controllable mistakes without blaming every external dependency. Illustrative framework: explain a real scope or estimation issue, the revised plan, and the prevention mechanism. Avoid suggesting that hiding the delay until the last moment was a useful negotiation tactic."],
      ["How do you explain influencing someone without authority?", "Focus on understanding incentives, presenting evidence, and offering workable alternatives instead of pressure or manipulation. Illustrative framework: identify a real stakeholder concern, compare options against a shared goal, and describe how the decision changed or did not change. A respectful unsuccessful attempt can still demonstrate judgment when you explain what you learned."],
      ["How should you discuss an ethical concern?", "Explain the concern in observable terms, protect sensitive information, and use appropriate policy and escalation channels. Do not invent accusations or imply that loyalty means concealing harm. Illustrative framework: assess a hypothetical risky request, clarify the requirement, document the issue through authorized channels, and seek a safe alternative. Label hypothetical reasoning clearly if no real example can be shared.", "HARD"],
      ["What does ownership look like in an interview answer?", "Ownership means following an issue through resolution or a responsible handoff, not claiming sole credit or doing every task yourself. Illustrative framework: describe an actual problem, what you could control, how you coordinated missing expertise, and how completion was verified. State limits on your authority and the help others supplied so the answer remains accurate."],
      ["How should you discuss helping a teammate?", "Explain the person's need, how you offered support respectfully, and how you avoided taking over their work without agreement. Illustrative framework: use a real onboarding or debugging interaction, identify the knowledge you shared, and describe the follow-up. Do not reveal confidential performance judgments, and credit the teammate's own learning or solution."],
      ["How do you describe adapting to change?", "Name what changed and which prior assumptions or plans had to be revised. Show a concrete adjustment rather than claiming to enjoy all change automatically. Illustrative framework: discuss a real tool or scope change, how you learned the essentials, and how you managed continuity. Mention tradeoffs such as temporary slower delivery while developing competence."],
      ["How can you discuss working with diverse perspectives?", "Describe how you made participation and understanding easier without assigning stereotypes to groups. Illustrative framework: use a real collaboration example involving different expertise or communication preferences, invite asynchronous input, and verify shared expectations. Avoid claiming that one person's behavior represents an entire culture or that inclusion means everyone must agree."],
      ["How should you answer a question about pressure?", "Explain prioritization, communication, and safe decision-making under constrained time; do not glorify exhaustion or unsafe shortcuts. Illustrative framework: describe a genuine high-demand period, the boundaries you kept, and how you used help or escalation. Separate necessary temporary urgency from a chronic process problem and state what you changed afterward."],
      ["How do you explain a decision made with incomplete data?", "State the missing information, the cost of delay, and whether the decision was reversible. Use available evidence and define a review trigger instead of pretending certainty. Illustrative framework: compare two plausible options in a real decision, choose a bounded experiment where feasible, and report the later evidence. Acknowledging an imperfect outcome strengthens credibility.", "HARD"],
      ["How should you describe disagreeing with a manager?", "Explain the concern respectfully, bring evidence, and clarify who owns the final decision. For ordinary professional differences, describe how you supported an agreed direction after discussion; serious ethical or safety issues may need further escalation. Illustrative framework: present a real tradeoff discussion without personal attacks or a claim that automatic obedience is always correct."],
      ["How can you answer when you lack the requested experience?", "Say that you do not have an exact example, then offer a genuinely related experience or ask whether a hypothetical approach would be useful. Illustrative framework: distinguish a course-team conflict from a production incident instead of upgrading its stakes. Explain transferable reasoning and limitations; an honest smaller example is better than a fabricated impressive story.", "EASY"],
      ["How do you make results and reflection specific?", "Use observed evidence you can support: a verified completion, a changed process, or feedback you actually received. Numerical results are helpful only when measured or clearly identified as estimates. Illustrative framework: compare the intended result with what happened, credit collaborators, and name one practice you would repeat or change. Reflection should show learning, not a rehearsed claim of perfection."],
    ]),
    notes: [
      {
        key: "behavioral-interview-foundations",
        title: "Foundations: truthful evidence and structured reflection",
        excerpt: "Build an honest evidence bank and use structured answers without turning practice frameworks into fabricated experience.",
        content: `# Behavioral interview foundations

## Evidence, not performance fiction

Behavioral questions explore how someone has approached collaboration, uncertainty, feedback, and responsibility. Prepare from your actual experience in employment, study, volunteering, caregiving, or personal projects where relevant. Do not upgrade a classroom exercise into a production incident or claim a team result as your sole achievement. If a question asks for experience you do not have, state that limitation and offer a related example or explicitly hypothetical reasoning.

## Use a flexible structure

Situation explains the necessary context. Task identifies your responsibility and the constraint. Action describes what you personally did and why. Result states the observed outcome. Reflection adds what you learned and would change. This structure is a navigation aid, not a script that requires every example to end in a dramatic success. Spend more time on decisions and actions than on a long history of the organization.

## Build an evidence bank

List real examples covering conflict, feedback, failure, ambiguity, ownership, prioritization, and helping others. For each, record the role you held, decisions you made, collaborators, outcome evidence, and details that must remain confidential. Several themes can share an example, but do not force one story into every question. A modest authentic example with clear reasoning is often more useful than a broad unsupported claim.

## Separate observation from interpretation

Say what happened before assigning motives. A missed handoff is observable; claiming a colleague did not care may be speculation. Describe conflicting goals and constraints fairly. Use measurements only when you actually have them, and label estimates as estimates. If the outcome was mixed or still developing, explain that rather than manufacturing a neat ending.

## Protect people and information

Anonymize unnecessary identifying details and avoid disclosing customer data, internal incidents, or private personnel information. An interviewer does not need secrets to understand your reasoning. You can explain that confidentiality limits a detail and still discuss the decision process at an appropriate level.

## Illustrative practice framework

For rehearsal only, outline a disagreement about delivery speed versus verification: define the shared goal, compare risks, invite evidence, choose a decision owner, and record the outcome. This is an illustrative framework, not a claimed real interview or a ready-made personal story. Replace it with truthful evidence when answering a question about your own past.`,
      },
      {
        key: "behavioral-interview-application",
        title: "Application: practice follow-up-ready answers",
        excerpt: "Rehearse concise evidence-based responses, probe them honestly, and improve clarity without memorizing false narratives.",
        content: `# Applying behavioral preparation

## Choose two real experiences

Select one example with a positive outcome and one with a setback. Write a factual timeline for each: what you knew at the time, what you controlled, who else contributed, and what happened later. Separate retrospective insight from what was available during the decision. This prevents an answer from implying foresight you did not actually possess.

## Draft a short answer

Use a few sentences of context, identify your task, and spend most of the answer on decisions and actions. Finish with the outcome and one reflection. Keep the draft as bullet prompts rather than memorized prose. Prepare a longer version for follow-ups, including alternatives you considered and a limitation of your approach.

## Rehearse honest probing

A practice partner can ask: what did you do personally, why was that option chosen, what disagreed with your assumption, and how do you know the result? If you cannot substantiate a detail, remove it or qualify it. Do not add numbers to make an answer sound more impressive. Team credit and an imperfect outcome can make the reasoning clearer.

## Practice conflict and feedback

Explain the other perspective in a way its holder would recognize. Describe listening and shared criteria, then state how a decision was reached or escalated. For feedback, identify the behavior changed and what follow-up showed. Avoid describing every disagreement as a victory; sometimes the useful outcome is a clearer decision process or an appropriate handoff.

## Handle missing examples

Use a transparent transition: acknowledge that the exact scenario is outside your experience and offer a related context if relevant. If invited to discuss a hypothetical situation, keep it in conditional language. An illustrative framework for an ethical concern is to clarify facts, check policy, preserve confidentiality, seek an authorized channel, and propose a safe alternative. It must never be presented as an event that happened to you.

## Review communication, not acting

Record a rehearsal only with consent and appropriate privacy. Check whether the answer addresses the actual question, whether context is too long, and whether responsibility is clear. Improve pacing and specificity while preserving your natural language. Preparation should make truthful evidence easier to understand, not create a persona that cannot survive a follow-up question.`,
      },
      {
        key: "behavioral-interview-pitfalls",
        title: "Pitfalls: exaggerated outcomes and rehearsed perfection",
        excerpt: "Avoid blame, unsupported metrics, confidential details, and scripts that replace reflection with performance.",
        content: `# Behavioral interview pitfalls

## Fabricated or inflated stories

Borrowing an impressive narrative and speaking as if it happened to you undermines truthful assessment. Do not claim production ownership for a tutorial project or leadership authority you did not hold. A hypothetical framework can demonstrate reasoning only when labeled as hypothetical. If your available examples are smaller, explain their actual scope and the skills that transfer.

## Unsupported result metrics

Not every experience has a numeric outcome. A completed handoff, documented decision, or directly received feedback can be valid evidence. Invented percentages and exact time savings invite false precision. Distinguish measured results from estimates, state how an estimate was formed when relevant, and acknowledge when causation is uncertain.

## Blame disguised as candor

An answer centered on an incompetent colleague usually hides the decision process. Describe observable behavior, conflicting constraints, and your response. Do not reveal private performance or health information. You can identify a harmful action without stereotyping a person or group. For serious ethical concerns, use authorized reporting channels rather than presenting public confrontation as the default.

## Perfect endings

A failure example that contains no failure, or a weakness that is only a boast, does not show reflection. Discuss a real limitation and a practical adjustment. Avoid claiming that one conversation permanently solved all conflict. Some outcomes remain mixed, and a thoughtful account of that uncertainty can be stronger than an implausibly tidy conclusion.

## Heroic overwork

Pressure questions are not a requirement to celebrate exhaustion, skipped safety checks, or endless availability. Explain priorities, communication, help, and boundaries. A temporary urgent situation may occur, but chronic overload often calls for process improvement. Do not promise unhealthy behavior as evidence of commitment.

## Memorized scripts and irrelevant detail

A polished monologue can miss the question. Listen for the competency and choose an example that actually fits. Keep initial context brief, leave room for follow-ups, and use your own words. Avoid company secrets, customer identifiers, or lengthy technical detail that does not explain the judgment being assessed.

## Final honesty check

For every sentence ask whether it is an observation, an interpretation, an estimate, or an illustrative framework. Make the category clear when it matters. Check personal versus team credit, the real scope of responsibility, and the limits of what can be shared. Strong preparation improves clarity while preserving the facts.`,
      },
    ],
    roadmap: roadmap("Prepare an honest behavioral evidence bank", "Practice structured reflection using only real experience or clearly labeled hypothetical frameworks.", [
      ["Inventory evidence", "List genuine experiences across conflict, feedback, ownership, ambiguity, and setbacks.", 2],
      ["Check facts", "Verify role, chronology, contribution, result evidence, and confidentiality limits for each example.", 2],
      ["Structure answers", "Draft concise situation-task-action-result-reflection bullet outlines for six relevant examples.", 3],
      ["Probe reasoning", "Practice alternatives, tradeoffs, and follow-ups with a partner; remove unsupported details.", 3],
      ["Handle gaps", "Rehearse honest limits and clearly labeled illustrative approaches for unfamiliar scenarios.", 2],
      ["Review delivery", "Run a timed mock, check relevance and credit, and refine clarity without memorizing a false persona.", 2],
    ]),
    cheatSheet: {
      title: "Behavioral answer integrity checklist",
      content: `# Behavioral interview quick reference

- **Situation:** enough context to understand the problem, not the organization's full history.
- **Task:** your responsibility, constraints, and authority.
- **Action:** what you personally did, why, and which alternatives you considered.
- **Result:** an observed outcome; use numbers only if supported or explicitly estimated.
- **Reflection:** what you learned, changed, or would repeat.
- **Conflict:** explain goals and evidence fairly; avoid character judgments.
- **Feedback:** show a concrete adjustment and follow-up, not instant perfection.
- **Failure:** accept controllable responsibility and explain repair plus prevention.
- **Leadership:** clarify decisions and help coordination without claiming an unheld title.
- **Priorities:** make deferred work and remaining risk visible; do not promise endless overwork.
- **Ethics:** clarify facts, preserve confidentiality, use policy and authorized escalation.
- **Missing experience:** acknowledge the gap and offer a truthful related example.
- **Hypotheticals:** explicitly label them; never present a practice framework as personal history.
- **Credit:** distinguish individual actions from team achievements.
- **Privacy:** remove identifiers and secrets that are unnecessary for the reasoning.
- **Follow-up readiness:** know how you observed the result and what evidence challenged your assumption.

Illustrative framework, not a real story: for an unclear request, summarize the goal, name missing information, propose a reversible test, agree on a checkpoint, and reassess using evidence. An actual past-behavior answer must use your own truthful experience.`,
    },
    quiz: quiz("Behavioral answer judgment", [
      ["You lack an exact example requested by the interviewer. What is most appropriate?", ["Invent a larger version of a class project", "Acknowledge the gap and offer a truthful related example", "Claim a colleague's story as your own", "Add an unmeasured impressive outcome"], 1, "A transparent limitation preserves honesty and allows relevant transferable reasoning without fabricating experience or personal credit."],
      ["Which conflict description is strongest?", ["A colleague was simply impossible", "Everyone else lacked commitment", "The team had different goals, and shared criteria helped compare options", "Winning the argument mattered more than the outcome"], 2, "A fair account of goals and evidence explains judgment without relying on personal attacks or unsupported claims about motives."],
      ["What should action emphasize?", ["Your own decisions and contributions with appropriate team credit", "Only the final organization-wide result", "A long description of the company", "A hypothetical event described as personal history"], 0, "Action clarifies the candidate's actual behavior while preserving collaborators' contributions and the true scope of responsibility."],
      ["When is a numeric result appropriate?", ["Whenever it sounds credible", "When borrowed from a public success story", "When it makes a setback look perfect", "When supported by evidence or clearly qualified as an estimate"], 3, "Numbers require an honest basis. A qualified estimate or a nonnumeric observed result is better than fabricated precision."],
      ["What makes a feedback example useful?", ["Saying criticism never bothers you", "Explaining a concrete change and later follow-up", "Claiming the reviewer was wrong without evidence", "Replacing the feedback with a disguised compliment"], 1, "A concrete response and follow-up show learning and judgment, whereas perfection claims avoid the behavior being assessed."],
      ["How should a hypothetical ethical response be presented?", ["As a real incident to sound experienced", "With confidential accusations against named people", "As an explicitly illustrative framework with appropriate escalation", "As a promise to conceal all concerns"], 2, "Labeling the framework keeps reasoning separate from claimed history, and appropriate channels protect people and confidential information."],
      ["What is a credible pressure response?", ["Prioritize, communicate, seek help, and preserve necessary safeguards", "Promise permanent availability without limits", "Celebrate skipping all verification", "Hide the risk until work is complete"], 0, "Sound judgment under pressure includes boundaries and communication, not a promise of unhealthy overwork or unsafe shortcuts."],
      ["What belongs in reflection?", ["A claim that no improvement is possible", "Only blame for another person's behavior", "An invented perfect ending", "A specific lesson and how it informed later practice"], 3, "Reflection connects evidence to learning and a practical adjustment, including mixed outcomes or limits rather than rehearsed perfection."],
    ]),
  },
  {
    slug: "hr-interview",
    references: [
      { title: "HR Interview Questions", url: "https://www.interviewbit.com/hr-interview-questions/", provider: "InterviewBit" },
      { title: "HR Interview Questions", url: "https://www.geeksforgeeks.org/hr/hr-interview-questions/", provider: "GeeksforGeeks" },
    ],
    questions: questions("hr-interview", [
      ["How should you introduce yourself professionally?", "Give a concise truthful summary of your relevant background, current capabilities, and reason for exploring the role. Do not recite every date or add credentials you do not hold. Illustrative framework: current focus, one supported skill, a relevant learning or work context, and what you want to contribute. Tailor emphasis to the role while preserving the same facts.", "EASY"],
      ["How do you explain interest in a company?", "Connect publicly verifiable aspects of the organization or product to genuine interests and capabilities, then ask about unknowns. Generic praise is less useful than a clear reason, and an interview guide is not evidence of internal culture. Illustrative framework: identify a real product challenge, explain your relevant interest, and ask how the team measures progress."],
      ["How should you discuss why you are leaving a role?", "Describe accurate professional reasons such as scope, growth, location, or role alignment without attacking colleagues or revealing confidential matters. If the situation was difficult, use measured factual language and explain what you seek next. Illustrative framework: summarize the mismatch, acknowledge useful learning, and connect the next role to a realistic goal."],
      ["How can you present strengths without unsupported claims?", "Choose strengths relevant to the role and connect each to evidence you can explain in follow-up questions. A label such as excellent communicator is weaker than an actual example of clarifying a handoff. Illustrative framework: name the capability, provide truthful evidence, and state how it applies to the advertised responsibilities without claiming expertise beyond your experience."],
      ["What is a constructive way to discuss a weakness?", "Choose a genuine professional development area, explain its impact, and describe a specific improvement process. Avoid a disguised boast or a false claim that the issue is completely solved. Illustrative framework: identify a real skill gap, the practice or feedback you use, and the boundary of current competence. Do not disclose sensitive personal information unnecessarily."],
      ["How should you explain an employment or study gap?", "Provide a truthful concise explanation at a level you are comfortable sharing, then describe relevant preparation or current readiness. You do not need to invent freelance work or expose private health and family details. Illustrative framework: state the period accurately, explain what can appropriately be shared, and discuss verified learning or plans without fabricating activity."],
      ["How do you discuss compensation expectations without inventing numbers?", "Clarify the role's scope, location, employment arrangement, and total compensation components before giving a researched expectation if you choose to provide one. Ask whether a budgeted range can be shared. Illustrative framework: discuss base pay, variable components, benefits, and responsibilities using your own verified information; never invent an offer or cite an unverified salary as fact."],
      ["How should you communicate your availability or notice period?", "State contractual obligations and realistic timing accurately, including any uncertainty that requires checking. Do not promise an immediate start while planning to ignore an existing commitment. Illustrative framework: explain the known notice requirement, any legitimate flexibility, and when you can confirm a start date. If local rules matter, consult qualified guidance rather than guessing."],
      ["How do you answer relocation or travel questions?", "Give an honest view of your willingness and constraints, then ask about frequency, location, support, and scheduling. Do not agree to conditions you already know you cannot meet merely to progress. Illustrative framework: distinguish occasional travel from permanent relocation and clarify the practical requirements before making a commitment."],
      ["How should you discuss remote or hybrid work preferences?", "Explain the conditions under which you work effectively and ask how the team coordinates, documents decisions, and assesses outcomes. Avoid claiming remote work means unrestricted availability or that office presence proves productivity. Illustrative framework: discuss communication habits, focus needs, and genuine scheduling constraints without inventing past remote experience."],
      ["How do you express career goals realistically?", "Describe directions for skill, responsibility, and contribution rather than guaranteeing a title by an arbitrary date. Connect the role to a plausible next step while acknowledging that priorities evolve. Illustrative framework: identify one area to deepen and one responsibility to grow into, then ask about development paths instead of claiming certainty about promotion."],
      ["How should you explain a change of field?", "Connect transferable skills to the new role and state the technical or domain gaps you are still addressing. Evidence from projects or study should be described at its actual level. Illustrative framework: explain the reason for the transition, a verified preparation activity, and the support or learning needed to become effective without relabeling beginner practice as professional mastery."],
      ["How do you handle a question you do not understand?", "Ask for clarification or restate your interpretation before answering. A brief check usually produces a more relevant response than guessing the intent. Illustrative framework: distinguish whether the question concerns working style, role logistics, or a past example, then answer the clarified version. If you do not know a fact, say so instead of improvising a confident falsehood.", "EASY"],
      ["How should you respond to a potentially inappropriate personal question?", "Keep the response professional, decide what you are comfortable sharing, and redirect to job-relevant requirements where appropriate. Rules vary by jurisdiction, so do not assume one universal legal conclusion. Illustrative framework: clarify the work requirement behind the question and address your ability to meet it without unnecessary private disclosure; seek qualified advice for legal concerns.", "HARD"],
      ["How do you discuss multiple applications or offers?", "Answer truthfully at the level of detail you choose to share, respect confidentiality, and explain real timing constraints. Do not fabricate competing offers as leverage. Illustrative framework: state that you are evaluating opportunities if accurate, identify a genuine decision deadline, and ask about the process timeline without inventing company names or terms."],
      ["What questions should you ask the recruiter?", "Ask about role scope, reporting relationships, hiring stages, evaluation criteria, work arrangement, and expected timing. Questions should help both sides assess fit rather than merely perform enthusiasm. Illustrative framework: clarify what success looks like in the initial period and which details remain undecided. Do not assume public interview stories describe this employer's process."],
      ["How do you review an offer responsibly?", "Compare written responsibilities, compensation components, benefits, location, schedule, contingencies, and start obligations. Clarify ambiguity before accepting and seek qualified advice when legal or tax implications are significant. Illustrative framework: create a comparison checklist using actual written terms; a verbal impression or an invented market figure should not replace verified information."],
      ["How should you handle a counteroffer conversation?", "Revisit your original reasons for considering a move, evaluate actual written changes, and communicate professionally without making promises you cannot honor. A higher amount alone may not resolve scope or management concerns. Illustrative framework: compare verified options against your priorities and acknowledge uncertainty; do not invent another offer to force a response."],
      ["What is useful interview follow-up?", "Send a concise message through an appropriate channel, thank the interviewer, mention one genuine point of relevance, and clarify any requested material or timing. Avoid repeated pressure or sharing sensitive documents without need. Illustrative framework: refer to an actual discussion topic and ask for the next step only if it was not already stated; never imply a conversation that did not occur."],
      ["How should you handle rejection or withdraw from a process?", "Respond respectfully, request feedback if appropriate, and distinguish useful information from assumptions about the decision. If withdrawing, communicate promptly and truthfully at an appropriate level. Illustrative framework: thank the contact, state your decision or ask one focused feedback question, and preserve boundaries rather than sending accusations or inventing a competing commitment."],
    ]),
    notes: [
      {
        key: "hr-interview-foundations",
        title: "Foundations: role fit, truthful positioning, and boundaries",
        excerpt: "Prepare accurate professional information and treat the conversation as a mutual assessment rather than a scripted performance.",
        content: `# HR interview foundations

## Mutual assessment

An HR or recruiter conversation often covers motivation, communication, eligibility, practical requirements, and process expectations. It is also an opportunity to learn whether the role fits your goals and constraints. These topics vary by employer and location; no public guide proves what a specific recruiter will ask. Prepare for themes instead of memorizing supposed real interview scripts.

## Build an accurate professional summary

Use your real background, current focus, relevant skills, and reason for exploring the role. Keep credentials, dates, and project scope consistent with your submitted materials. A course project can demonstrate learning without being described as professional production work. Clarify your contribution to team achievements and be ready to explain evidence behind each capability claim.

## Connect motivation to facts

Read the job description and public product information. Separate verified facts from questions about internal culture, growth, or expectations. Genuine interest can be specific without flattery: explain which responsibilities fit your strengths and which would stretch you. A role can be attractive for practical reasons too; do not invent a lifelong passion to satisfy a presumed ideal answer.

## Prepare logistics honestly

Know your actual notice obligations, location preferences, travel constraints, work authorization facts where relevant, and possible start timing. Share only appropriate information and acknowledge uncertainty when a contract or local rule needs checking. Do not promise availability or relocation that you already know is unrealistic.

## Protect personal boundaries

You can discuss your ability to meet job requirements without unnecessary disclosure of private health or family details. Potentially inappropriate questions require judgment, and legal rules differ by jurisdiction. Redirect professionally to the relevant work requirement and seek qualified advice for legal concerns. Do not rely on an interview lesson as a universal legal determination.

## Illustrative framework

A preparation outline might be: current professional focus, supported capability, genuine role interest, practical constraints, and questions for the recruiter. This is explicitly an illustrative framework, not a claimed real interview or a personal story to copy. Fill it with your own accurate information and use your natural language.`,
      },
      {
        key: "hr-interview-application",
        title: "Application: prepare and evaluate a recruiting conversation",
        excerpt: "Use a role matrix, verified logistics, and a written-term checklist to make informed commitments without fabricated leverage.",
        content: `# Applying HR interview preparation

## Build a role matrix

List the advertised responsibilities, your relevant evidence, current gaps, and questions. Mark which facts come from the job description and which are your interpretation. For a skill gap, note actual study or practice and what you still need to learn. This supports honest positioning rather than pretending to meet every requirement.

## Prepare concise talking points

Draft a short introduction, a reason for interest, a truthful explanation of any transition or gap, and one strength plus a development area. Keep these as prompts, not fixed scripts. Use real examples and avoid sharing confidential employer details. Rehearse follow-up questions that test whether the claims are supported.

## Clarify process and logistics

Ask about hiring stages, expected timeline, work arrangement, reporting line, and what successful initial performance looks like. State realistic availability and any known constraints. If details are not finalized, ask when they can be confirmed rather than assuming a favorable interpretation. Record agreed next steps so later communication does not depend on memory alone.

## Discuss compensation carefully

Clarify scope and total compensation structure. If sharing an expectation, base it on your own research and priorities, not a made-up salary or an invented competing offer. Ask whether a budgeted range is available. Consider base pay, variable terms, benefits, location, schedule, and contingencies together. No example in this lesson supplies salary figures or claims a universal market rate.

## Review written terms

Before accepting, compare the written offer with your understanding of responsibilities, employment arrangement, compensation components, start date, and conditions. Ask for clarification of material differences. For legal, immigration, or tax implications, use qualified guidance. Do not accept conflicting commitments while assuming you can silently abandon one later.

## Follow up professionally

Send a concise message through the agreed channel, refer to a genuine discussion point, and provide requested material safely. If withdrawing, do so promptly and respectfully. If rejected, ask for focused feedback when appropriate but do not infer motives without evidence. An illustrative framework for follow-up is thanks, one accurate point of relevance, and the next-step question if still unknown; it is not a claim that any particular interview occurred.`,
      },
      {
        key: "hr-interview-pitfalls",
        title: "Pitfalls: false leverage and unrealistic commitments",
        excerpt: "Avoid invented offers, exaggerated credentials, intrusive disclosures, and assumptions about unwritten terms.",
        content: `# HR interview pitfalls

## Saying what you think must be heard

Invented enthusiasm, experience, credentials, or availability can create a mismatch that persists after hiring. Tailor relevance, not facts. If a requirement is outside your experience, explain transferable skills and the gap. A truthful statement about learning is better than a claim of mastery that cannot withstand normal work or follow-up questions.

## Fabricated negotiation leverage

Do not claim an offer, deadline, or compensation figure that does not exist. Clarify the employer's range where available and evaluate actual total compensation components. Public averages can be outdated or mismatched to location and scope, so verify the basis before using research. This lesson provides no salaries and no scripts that encourage deception.

## Overpromising logistics

An immediate start, frequent travel, or relocation promise has practical consequences. Check obligations and constraints before committing. If timing depends on an unresolved issue, say that it needs confirmation. Avoid presenting permanent overwork as a work-style advantage. Compatibility is better assessed through realistic expectations than through unlimited promises.

## Negative or confidential explanations

Reasons for leaving or a gap can be factual without blaming named colleagues or sharing private incidents. Do not reveal protected customer or employer information to establish credibility. Keep personal explanations at an appropriate level and redirect to current readiness. An interviewer does not need unrestricted access to your private life to discuss job fit.

## Treating legal guidance as universal

Notice, work eligibility, personal questions, and employment terms are governed differently across jurisdictions. A public interview guide is not qualified legal advice. Clarify the job-relevant requirement, preserve boundaries, and consult an appropriate professional for significant legal concerns. Avoid confidently repeating a rule from another location.

## Ignoring written differences

A verbal description may not capture a variable-pay condition, location requirement, or start contingency. Review the complete written offer and ask about material ambiguity before accepting. Keep a factual comparison against your priorities. Do not assume a recruiter can guarantee every future promotion or working arrangement.

## Follow-up without pressure

Repeated messages, accusations after rejection, or exaggerated references to nonexistent conversations are not useful. Use the agreed channel and timing, request feedback respectfully where suitable, and accept that some organizations cannot provide detailed feedback. Preparation should support informed choices and professional communication, not manipulation or a performance of certainty.`,
      },
    ],
    roadmap: roadmap("Prepare a truthful recruiting packet", "Clarify fit, practical requirements, and decision criteria without invented experience or compensation.", [
      ["Analyze the role", "Build a responsibility-to-evidence matrix and identify gaps plus questions.", 2],
      ["Verify your summary", "Check dates, credentials, project scope, and a concise introduction against submitted materials.", 2],
      ["Prepare sensitive topics", "Draft factual talking points for transitions, gaps, strengths, and development areas.", 2],
      ["Clarify logistics", "Check actual notice obligations, start timing, location preferences, and work constraints.", 2],
      ["Practice mutual assessment", "Run a mock conversation with follow-ups about scope, compensation structure, and process.", 3],
      ["Build a decision checklist", "Prepare written-term review criteria and respectful follow-up or withdrawal templates using only real facts.", 2],
    ]),
    cheatSheet: {
      title: "HR interview preparation and decision checklist",
      content: `# HR interview quick reference

- **Introduction:** current focus, supported skills, actual background, and genuine reason for interest.
- **Company interest:** connect public facts to your goals; ask about unknown internal details.
- **Strengths:** evidence and relevance, not broad unsupported labels.
- **Development area:** a genuine gap, practical improvement, and current limits.
- **Transition or gap:** concise truth at a comfortable privacy level; no invented employment.
- **Availability:** actual obligations, realistic dates, and uncertainty clearly stated.
- **Travel / location:** distinguish occasional travel, hybrid attendance, and permanent relocation.
- **Compensation:** clarify role scope and total components; research your own expectations; no fabricated offers or numbers.
- **Role questions:** responsibilities, reporting, success criteria, process stages, timeline, and working arrangement.
- **Personal boundaries:** address job-relevant requirements; seek qualified advice for legal concerns that vary by jurisdiction.
- **Written offer:** review duties, pay components, benefits, conditions, location, schedule, and start commitments.
- **Counteroffer:** compare real changes with your original priorities; do not invent leverage.
- **Follow-up:** concise, factual, appropriate channel, and agreed timing.
- **Withdrawal or rejection:** respectful communication and focused feedback requests without accusations.

Illustrative framework, not a real interview account: summarize fit, ask what remains uncertain, clarify practical constraints, and agree on next steps. Replace the outline with your own accurate information rather than reading it as a personal script.`,
    },
    quiz: quiz("HR conversation judgment", [
      ["What is appropriate tailoring of an introduction?", ["Changing credentials to match the role", "Emphasizing relevant truthful experience", "Inventing a leadership title", "Adding a fictional employer"], 1, "Tailoring changes emphasis and relevance, not the facts of credentials, role history, or actual responsibility."],
      ["What is a sound response about compensation?", ["Invent a competing offer", "Quote an unsupported universal salary", "Clarify scope and total components using verified information", "Promise acceptance before reading terms"], 2, "Compensation decisions need real scope and written components; fabricated leverage and unsupported figures undermine informed negotiation."],
      ["How should a candidate explain a private gap?", ["Truthfully and concisely at an appropriate level of disclosure", "By inventing freelance contracts", "By sharing all sensitive family details", "By altering dates on the resume"], 0, "An accurate concise explanation protects both honesty and privacy; there is no need to fabricate activity or disclose unnecessary details."],
      ["When should a start date be committed?", ["Before checking any obligation", "Whenever the earliest date sounds impressive", "After promising conflicting roles the same availability", "When it reflects real obligations and confirmed flexibility"], 3, "A start commitment should account for actual notice and practical constraints, with unresolved timing clearly identified."],
      ["What helps assess mutual fit?", ["Avoiding all questions", "Asking about scope, success criteria, work arrangement, and process", "Assuming public stories describe this employer", "Promising unlimited availability"], 1, "Specific role and process questions expose practical compatibility and unknowns rather than relying on assumptions or unrealistic promises."],
      ["How should a potentially inappropriate personal question be handled?", ["Assume one legal rule applies everywhere", "Disclose everything automatically", "Redirect professionally to job requirements and preserve boundaries", "Invent private circumstances"], 2, "Professional redirection can address relevant requirements while preserving privacy; significant legal concerns require jurisdiction-appropriate advice."],
      ["What is important before accepting an offer?", ["Review actual written terms and clarify material ambiguity", "Rely only on a favorable verbal impression", "Ignore contingencies and schedule", "Use a fictional salary comparison"], 0, "Written responsibilities and conditions may differ from an impression. Clarifying them supports an informed and realistic commitment."],
      ["Which follow-up is most appropriate?", ["Repeated daily pressure messages", "A claim about a discussion that never happened", "Accusations about rejection motives", "A concise factual message through the agreed channel"], 3, "Respectful factual follow-up preserves professional communication and does not invent events, pressure the contact, or assume motives."],
    ]),
  },
  {
    slug: "machine-learning",
    references: [
      { title: "Machine Learning Interview Questions", url: "https://www.interviewbit.com/machine-learning-interview-questions/", provider: "InterviewBit" },
      { title: "Machine Learning Tutorial", url: "https://www.tpointtech.com/machine-learning", provider: "JavaTpoint / TpointTech" },
      { title: "Common Pitfalls and Recommended Practices", url: "https://scikit-learn.org/stable/common_pitfalls.html", provider: "scikit-learn" },
      { title: "Cross-Validation: Evaluating Estimator Performance", url: "https://scikit-learn.org/stable/modules/cross_validation.html", provider: "scikit-learn" },
      { title: "Metrics and Scoring", url: "https://scikit-learn.org/stable/modules/model_evaluation.html", provider: "scikit-learn" },
      { title: "Model Persistence", url: "https://scikit-learn.org/stable/model_persistence.html", provider: "scikit-learn" },
      // Supplemental public URL; fetch returned 403, so not counted as verified.
      { title: "Machine Learning: Getting Started (supplemental)", url: "https://www.w3schools.com/python/python_ml_getting_started.asp", provider: "W3Schools" },
    ],
    questions: questions("machine-learning", [
      ["How do supervised, unsupervised, and reinforcement learning differ?", "Supervised learning uses labeled examples to predict a target; unsupervised learning finds structure without that target; reinforcement learning learns behavior from rewards through interaction. A spam classifier, customer clustering exercise, and simulated control policy have different evaluation needs. None automatically discovers causal truth, and reinforcement learning is not a default replacement for a labeled-data problem.", "EASY"],
      ["How do you translate a business need into a prediction task?", "Define the unit of prediction, decision time, target, and action taken from the output. For an illustrative support-routing model, specify what information exists when a ticket arrives and which later routing outcome becomes the label. Compare against a simple rule baseline, account for error costs, and check whether prediction is actually more useful than improving the workflow."],
      ["What is data leakage, and how can you prevent it?", "Leakage occurs when training or evaluation uses information unavailable at the real prediction boundary or transfers holdout information into fitting. A refund outcome recorded after a purchase cannot be used to predict risk at purchase time. Fit imputers, scalers, feature selection, and resampling only on training partitions, preferably within a pipeline evaluated inside each fold."],
      ["How should you choose training, validation, and test splits?", "Training fits model parameters, validation supports choices such as hyperparameters and thresholds, and the final test estimates performance after choices are frozen. Match the split to deployment: preserve time order for forecasting and keep the same person or device out of both sides when independence requires it. A random split is not universally realistic, and repeated test-set tuning contaminates evaluation."],
      ["What does cross-validation estimate, and where can it mislead?", "Cross-validation estimates performance across multiple held-out folds and can expose sensitivity to a particular split. The entire learned preprocessing pipeline must be fitted inside each training fold. Use grouped or time-aware folds when samples are related; ordinary shuffled folds can leak near-duplicate entities or future observations. Nested evaluation helps separate tuning from an unbiased outer assessment.", "HARD"],
      ["How do bias and variance guide model improvement?", "High bias can indicate a model or feature set too limited for the pattern, while high variance reflects sensitivity to the training sample. Compare training and validation behavior instead of assuming a larger model will always help. For a noisy tabular task, regularization, better features, or more representative data may improve generalization more than adding complexity."],
      ["What does regularization do?", "Regularization penalizes or constrains complexity to reduce overfitting, trading some training fit for improved generalization. L2 often shrinks weights smoothly; L1 can encourage sparse coefficients. Feature scaling affects many penalized models, so tune preprocessing and penalty strength together within training-only validation. Excessive regularization can underfit rather than improve every dataset."],
      ["When is a linear model a good baseline?", "A linear or logistic model is interpretable, efficient, and often competitive when suitable features express the relevant relationship. Logistic regression models a classification probability through a link function; it is not ordinary regression rounded into labels. Check scaling, correlated predictors, and regularization, and compare measured performance rather than discarding the baseline because a nonlinear model sounds more advanced."],
      ["How do trees and ensembles change the tradeoff?", "Trees capture nonlinear feature interactions with limited scaling requirements, but a deep single tree can overfit. Random forests average diverse trees to reduce variance, while boosting sequentially improves an objective and can require careful tuning. Ensembles may increase memory, latency, and explanation difficulty. Benchmark them on representative data and operational constraints rather than assuming they always dominate."],
      ["How should you evaluate a regression model?", "Choose metrics aligned with the cost of errors. MAE summarizes absolute deviations and is less dominated by very large errors than squared-error measures; RMSE emphasizes large misses. R-squared is relative to a baseline and can be negative on held-out data. Inspect residuals and important slices, and avoid percentage metrics when targets near zero make them unstable."],
      ["How do precision, recall, and classification thresholds interact?", "Precision asks how many predicted positives are correct; recall asks how many actual positives are found. A lower threshold often raises recall while increasing false positives, but the exact tradeoff depends on score distribution. Choose a threshold using validation data and real error costs, then report a confusion matrix and performance on relevant slices instead of optimizing accuracy alone."],
      ["Why can accuracy hide problems with class imbalance?", "If only a small fraction of cases are positive, predicting negative for every case can produce high accuracy while finding none of the positives. Use class-specific recall, precision-recall analysis, and cost-aware evaluation. Class weights or resampling can help learning, but apply them only inside training folds and evaluate on a holdout that reflects the intended deployment prevalence."],
      ["How do ROC-AUC and precision-recall analysis differ?", "ROC-AUC measures ranking through true-positive versus false-positive rates across thresholds, while precision-recall analysis emphasizes positive predictions and recovered positives. With rare positives, a small false-positive rate can still generate many false alerts. Compare PR behavior against the positive prevalence baseline and select an operating threshold; a strong AUC alone does not guarantee useful decisions.", "HARD"],
      ["What is probability calibration, and why does it matter?", "Calibration concerns whether predicted probabilities correspond to observed frequencies, while discrimination concerns ranking positives above negatives. A model can rank well yet be overconfident. If an action depends on an expected cost or risk probability, evaluate calibration and fit any calibrator without using the final test labels. Calibration does not remove fairness concerns or guarantee stable probabilities after population change."],
      ["How do missing values and feature scaling affect evaluation?", "Choose missing-value handling based on meaning and model behavior, and learn imputation values from training data only. Scaling can strongly affect distance-based and penalized models, while trees often need less of it. Include transformations in the persisted pipeline so serving does the same work as training. A training-only convenience that changes at inference creates skew."],
      ["How should you evaluate clustering without known labels?", "Use internal measures cautiously and also inspect stability, interpretability, and whether the groups support a useful action. A high silhouette score can favor geometry that is irrelevant to the business. Scale features deliberately, compare multiple seeds or samples, and avoid treating discovered clusters as natural or causal categories without domain evidence."],
      ["When should you use a neural network?", "Neural networks are valuable for tasks with complex representations and sufficient suitable data, such as many language or vision problems. They introduce training, compute, tuning, and deployment complexity and may not beat a strong tabular baseline. Use validation, regularization, and controlled early stopping, and consider pretrained representations when their provenance and domain fit are appropriate."],
      ["How do data drift and concept drift differ?", "Data drift changes the input distribution, while concept drift changes the relationship between inputs and the target. A feature distribution shift does not by itself prove accuracy declined, and unchanged inputs do not guarantee the target relationship stayed stable. Monitor inputs, predictions, delayed labels, and important slices; investigate before blindly retraining on recent data.", "HARD"],
      ["What is required to deploy a model reliably?", "Version the model, feature schema, preprocessing, dependencies, and decision threshold together. Validate inputs, measure latency and memory, protect artifacts, and load only trusted persistence formats or sources because some deserialization can execute code. Use shadow or staged rollout, monitor delayed outcomes, and retain a rollback or fallback path; an offline score is not a serving reliability guarantee.", "HARD"],
      ["How should fairness and reproducibility enter model review?", "Document data provenance, intended use, split logic, seeds, code, dependencies, and slice-level performance with appropriate privacy controls. Evaluate error consequences across relevant groups without assuming one metric defines fairness in every context. Small slices need uncertainty-aware interpretation, and sensitive attributes require careful governance. Reproducibility supports review but does not make a harmful objective acceptable.", "HARD"],
    ]),
    notes: [
      {
        key: "machine-learning-foundations",
        title: "Foundations: valid evaluation before model complexity",
        excerpt: "Define a prediction boundary, prevent leakage, and choose splits and metrics that reflect the intended decision.",
        content: `# Machine learning foundations

## Define the decision first

A model should support a concrete action. Identify the prediction unit, when it occurs, information available at that time, and how the target is observed later. In an illustrative ticket-routing task, arrival-time text may be available but the eventual resolution code is not. Decide whether errors cause wasted effort, missed urgent cases, or another consequence. Compare against a simple policy or constant baseline before investing in complexity.

## Separate learning from evaluation

Training fits parameters. Validation supports choices about features, hyperparameters, and thresholds. A final untouched test evaluates the frozen process. There is no universal split ratio: sample size, label delay, rare events, and deployment setting matter. For future predictions use time-aware separation; for multiple records from the same entity, use grouped separation when the intended generalization is to unseen entities.

## Prevent leakage at every learned step

Imputation, scaling, feature selection, target encoding, and resampling can leak information if fitted on the whole dataset. Fit them on training partitions only and repeat that fitting within each cross-validation fold. A pipeline helps enforce this boundary. Also inspect raw features for post-outcome information and duplicated records; a correct pipeline cannot repair a label leaked directly into an input field.

## Match metrics to consequences

For regression, compare absolute and squared-error measures and inspect residuals. For classification, use a confusion matrix, precision, recall, ranking measures, and calibration where probabilities drive decisions. Accuracy can be misleading for rare positives. Threshold choice belongs to validation and should reflect cost, capacity, and acceptable error tradeoffs. Evaluate the final holdout at that chosen operating point.

## Control complexity

Start with a strong simple baseline. Compare training and validation behavior to investigate underfitting or overfitting. Regularization, representative data, better features, and controlled early stopping can matter more than an elaborate model. Cross-validation reveals variability only under its split assumptions; correlated or temporal records require suitable folds.

## Report limitations

Document provenance, label quality, split method, tuning process, and uncertainty. A high held-out score does not establish causality or guarantee future performance. Include meaningful slice checks with appropriate privacy controls and enough sample context. The first goal is an honest evaluation of the intended decision, not the largest number on an unsuitable benchmark.`,
      },
      {
        key: "machine-learning-application",
        title: "Application: a leakage-resistant model lifecycle",
        excerpt: "Build a baseline, tune only within training boundaries, and package inference with monitoring and rollback.",
        content: `# Applying machine learning end to end

## Audit the dataset

Choose a lawful, appropriately licensed dataset and record its source, target definition, timestamp semantics, and known limitations. Check duplicates, missingness, class prevalence, and feature availability at prediction time. Keep identifiers needed for grouping separate from features unless their predictive use is justified. Plan privacy and retention before exporting data into notebooks or logs.

## Freeze an evaluation plan

Reserve a test partition that matches intended deployment. Use temporal or grouped splitting when needed rather than automatically shuffling every row. Within the remaining data, choose appropriate cross-validation for tuning. Write the target metric and threshold-selection rule before examining test results. If the test becomes part of repeated tuning, acknowledge contamination and obtain fresh evaluation evidence.

## Fit a complete pipeline

Combine learned preprocessing and a baseline estimator. For imbalanced classification, compare class weights or training-only resampling with an unchanged holdout prevalence. Never balance the entire dataset before splitting. Tune complexity and regularization in the inner evaluation boundary, then fit the selected process on the allowed training data.

## Inspect errors

Compare performance to a simple baseline and report a confusion matrix or regression residual analysis. Review slice behavior and calibration if probabilities drive decisions. Examine errors without rewriting the target to hide them. Rare slices may need more data or cautious confidence statements rather than strong conclusions from a handful of observations.

## Package the inference contract

Version model bytes, preprocessing, feature names and types, missing-value policy, dependencies, and threshold together. Validate inputs and define fallback behavior when data is unavailable or out of range. Persist artifacts through a trusted path; some formats can execute code when loaded. Benchmark representative latency, memory, and concurrency before choosing a serving runtime.

## Roll out and monitor

Use shadow evaluation or limited exposure where appropriate, keeping privacy and operational cost in view. Monitor feature distributions, prediction distributions, latency, errors, and delayed labels. Data drift is not automatically concept drift, so investigate before retraining. Define who approves new models, what evidence qualifies a release, and how to return to a prior model or a safe rule-based fallback.`,
      },
      {
        key: "machine-learning-pitfalls",
        title: "Pitfalls: leakage, metric shortcuts, and deployment skew",
        excerpt: "Recognize evaluation errors and operational risks that a high offline score cannot reveal.",
        content: `# Machine learning pitfalls

## Leakage before and after splitting

A future outcome field can leak directly into the feature set. Global scaling or imputation can expose holdout information to training. Feature selection performed before cross-validation can bias every fold. Resampling the full dataset can also contaminate evaluation. Check both the raw prediction-time contract and the fitting boundary for each learned transformation.

## Random splits with related records

Repeated users, devices, or near-duplicate documents can make shuffled train and test rows deceptively similar. Time series can expose the future through shuffling. Choose grouping and chronology based on what the deployed model must generalize to. A fixed seed makes a flawed split repeatable; it does not make the split valid.

## Test-set shopping

Trying many models, thresholds, or features against the final test turns it into a tuning set. Keep selection within validation or inner folds and preserve a separate final assessment. Report the actual process honestly. If evaluation has been contaminated, obtain fresh evidence rather than presenting the best selected test score as unbiased.

## Accuracy and imbalance

A majority-class predictor can look accurate while missing every rare positive. Precision, recall, PR behavior, and an operating threshold reveal different consequences. ROC-AUC may summarize ranking well while a chosen threshold produces too many false alerts. Evaluate on deployment-relevant prevalence and state costs or capacity constraints explicitly.

## Calibration, fairness, and uncertainty

Good ranking is not the same as reliable probabilities. A single average score can hide errors concentrated in a group or workflow. Use appropriate slice analysis and uncertainty, avoid unsupported claims from tiny samples, and govern sensitive attributes carefully. No metric makes the objective or data collection automatically ethical.

## Serving skew and unsafe artifacts

A model trained with one imputation or feature order can fail when inference uses another. Package preprocessing with the estimator and validate schema. Treat model files as software artifacts, not harmless data; some loaders can execute code. Verify provenance, supported formats, and dependencies, and test rollback alongside normal serving.

## Drift without a response plan

An input shift may reflect seasonality, instrumentation changes, or a true population change. Concept drift concerns the input-target relationship and often requires delayed labels to assess. Blind retraining can amplify bad recent data. Establish investigation, approval, monitoring, and fallback procedures before promising continuous automatic improvement.`,
      },
    ],
    roadmap: roadmap("Build and review a dependable ML baseline", "Use a suitable public dataset and document the complete evaluation and serving contract.", [
      ["Define task and audit data", "Record provenance, prediction time, target meaning, duplicate groups, privacy, and a rule baseline.", 4],
      ["Design splits", "Create an untouched temporal or grouped test where appropriate and a training-only tuning plan.", 4],
      ["Fit and compare", "Build preprocessing pipelines and compare a simple model with one justified alternative using cross-validation.", 7],
      ["Evaluate decisions", "Tune thresholds on validation, assess imbalance, calibration, residuals or confusion matrices, and meaningful slices.", 5],
      ["Package deployment", "Version schema, preprocessing, model, dependencies, and threshold; test trusted loading, latency, and fallback.", 6],
      ["Monitor and review", "Simulate data shift, define delayed-label checks and rollback criteria, and write a limitations-focused model review.", 4],
    ]),
    cheatSheet: {
      title: "ML evaluation and deployment checklist",
      content: `# Machine learning quick reference

- **Task:** prediction unit, decision time, available features, target delay, action, and error costs.
- **Split:** train fits; validation chooses; final test evaluates a frozen process. Match time and entity structure.
- **Leakage:** future information, duplicate entities, globally fitted transforms, and resampling outside training boundaries.
- **Cross-validation:** fit the whole learned pipeline within folds; use grouped or temporal folds as needed.
- **Baseline:** simple rule or model before additional complexity; compare realistic operational costs too.
- **Regularization:** control complexity; tune strength and scaling together; too much can underfit.
- **Regression:** MAE for absolute error, RMSE for stronger large-error emphasis, residuals and slice checks.
- **Classification:** precision = TP / (TP + FP); recall = TP / (TP + FN). Handle zero denominators intentionally.
- **Imbalance:** accuracy can hide zero positive recall; inspect PR behavior and deployment prevalence.
- **Threshold:** choose on validation using costs and capacity, not by repeatedly optimizing the final test.
- **Calibration:** probability reliability differs from ranking; assess when decisions use expected risk.
- **Fairness:** relevant slice errors, uncertainty, privacy, and consequences; no universal single metric.
- **Deployment:** version preprocessing, schema, dependencies, artifact, and threshold together; load only trusted artifacts.
- **Drift:** input distribution change differs from input-target relationship change; use delayed labels when available.
- **Recovery:** staged release, monitored outcomes, rollback, and a documented fallback.

A repeatable high score is not proof of a valid split, ethical objective, causal effect, or reliable production inference. Record limitations and the evidence behind every important decision.`,
    },
    quiz: quiz("ML evaluation judgment", [
      ["When should an imputer be fitted during cross-validation?", ["Once on all records before splitting", "Within each fold's training partition", "On each fold's held-out partition", "Once on the full training pool before making folds"], 1, "Fitting inside each training fold prevents held-out values from influencing learned preprocessing and preserves the evaluation boundary."],
      ["Repeated records from one patient appear in a dataset intended to generalize to new patients. Which split is most appropriate?", ["Shuffle all rows without grouping", "Stratify by outcome but ignore patient identity", "Keep each patient in a single side of the split", "Balance classes by duplicating records before splitting"], 2, "Grouping by patient prevents related records from leaking across evaluation boundaries when the goal is performance on unseen patients."],
      ["A rare-event classifier predicts negative for every case. Which metric exposes the missed positives most directly?", ["Positive-class recall", "Overall accuracy", "Negative-class specificity", "Negative predictive value"], 0, "Positive recall is zero when no real positives are found, even though accuracy may appear high because negatives dominate the dataset."],
      ["Where should a decision threshold be selected?", ["By repeatedly optimizing the final test", "At 0.5 for every classifier regardless of costs", "By maximizing training-set accuracy alone", "On validation data using explicit decision costs or constraints"], 3, "Threshold selection is a tuning decision and belongs in validation with stated tradeoffs, preserving the final test for assessment."],
      ["What does a well-calibrated probability address?", ["Whether all positives rank above all negatives", "Whether predicted risks correspond to observed frequencies", "Whether every group has the same false-positive rate", "Whether the chosen threshold maximizes accuracy"], 1, "Calibration concerns probability reliability, not perfect ranking, universal fairness, or an optimal classification threshold."],
      ["Which change most directly describes concept drift?", ["A shift in input frequencies with an unchanged target relationship", "A different feature serialization order", "A change in the relationship between inputs and target", "Higher serving latency with identical predictions"], 2, "Concept drift changes the predictive relationship. Input distribution drift and operational failures are distinct signals that need investigation."],
      ["What should be versioned for reliable inference?", ["Model, preprocessing, feature schema, dependencies, and threshold together", "Model weights alone because preprocessing can be inferred", "Model and runtime while leaving feature order undocumented", "Feature names and metric while rebuilding transforms independently"], 0, "The inference contract depends on all these components; mismatches can cause serving skew even when the estimator itself is unchanged."],
      ["Why is loading an untrusted model artifact dangerous?", ["Only prediction quality can be affected because artifacts are passive data", "All model formats safely ignore embedded executable objects", "Matching the library version guarantees harmless deserialization", "Some persistence mechanisms can execute code during loading"], 3, "Model persistence can carry software-execution risk. Trusted provenance and appropriate loading mechanisms are required before serving."],
    ]),
  },
];
