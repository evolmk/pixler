# Architecture Review Guide

A guide for reviewing whether the architecture and design of code under review are sound.

## SOLID Principle Checklist

### S — Single Responsibility (SRP)

**What to check:**

- Does this class/module have only one reason to change?
- Do the methods in the class all serve the same purpose?
- Can you describe this class to a non-technical person in one sentence?

**Smells in a review:**

```
⚠️ Class name contains generic words: "And", "Manager", "Handler", "Processor"
⚠️ Class exceeds 200–300 lines
⚠️ Class has more than 5–7 public methods
⚠️ Different methods operate on completely different data
```

**Questions to ask:**

- "What responsibilities does this class hold? Could it be split?"
- "If requirement X changes, which methods change? What about requirement Y?"

### O — Open/Closed (OCP)

**What to check:**

- Does adding new functionality require modifying existing code?
- Can new behavior be added via extension (inheritance, composition)?
- Are there long if/else or switch chains handling different types?

**Smells in a review:**

```
⚠️ switch/if-else chain handling different types
⚠️ Adding a new feature requires modifying a core class
⚠️ Type checks (instanceof, typeof) scattered through the code
```

**Questions to ask:**

- "If we add a new X type, which files have to change?"
- "Will this switch grow every time a new type is added?"

### L — Liskov Substitution (LSP)

**What to check:**

- Can a subclass be used wherever the parent is used?
- Does the subclass change the parent's expected behavior?
- Does a subclass throw exceptions the parent didn't declare?

**Smells in a review:**

```
⚠️ Explicit type casting
⚠️ Subclass methods throw NotImplementedException
⚠️ Subclass methods are empty or only `return`
⚠️ Callers need to check the concrete type when using the base class
```

**Questions to ask:**

- "If a subclass replaces the parent, does caller code need to change?"
- "Does this subclass method conform to the parent's contract?"

### I — Interface Segregation (ISP)

**What to check:**

- Are interfaces small and focused?
- Are implementers forced to implement methods they don't need?
- Do clients depend on methods they don't use?

**Smells in a review:**

```
⚠️ Interface has more than 5–7 methods
⚠️ Implementers have empty methods or throw NotImplementedException
⚠️ Interface name is too broad (IManager, IService)
⚠️ Different clients only use part of the interface
```

**Questions to ask:**

- "Are all methods of this interface used by every implementer?"
- "Could this large interface be split into smaller, purpose-specific ones?"

### D — Dependency Inversion (DIP)

**What to check:**

- Do high-level modules depend on abstractions instead of concretions?
- Is dependency injection used instead of direct `new`?
- Are abstractions defined by the high-level module rather than the low-level one?

**Smells in a review:**

```
⚠️ High-level module directly `new`s low-level concrete classes
⚠️ Imports concrete implementations instead of interfaces/abstract classes
⚠️ Config and connection strings are hardcoded inside business logic
⚠️ It is difficult to unit-test the class
```

**Questions to ask:**

- "Can this class's dependencies be mocked in tests?"
- "If we swap the database/API implementation, how many places change?"

---

## Architecture Anti-Patterns

### Critical anti-patterns

| Anti-pattern        | Smell                                                                   | Impact                               |
| ------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| **Big Ball of Mud** | No clear module boundaries; any code may call any other code            | Hard to understand, modify, or test  |
| **God Object**      | A single class with too many responsibilities — knows and does too much | High coupling; hard to reuse or test |
| **Spaghetti code**  | Tangled control flow, gotos or deep nesting; hard to trace              | Hard to understand and maintain      |
| **Lava Flow**       | Ancient code no one dares change, lacking docs and tests                | Tech-debt accumulation               |

### Design anti-patterns

| Anti-pattern                       | Smell                                                                   | Suggestion                                  |
| ---------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------- |
| **Golden Hammer**                  | Using the same tech/pattern for every problem                           | Pick the right tool for the problem         |
| **Gas Factory** (over-engineering) | Simple problem solved with complex solution; overuse of design patterns | YAGNI — start simple, evolve as needed      |
| **Boat Anchor**                    | Unused code written "in case we need it later"                          | Delete unused code; add it back when needed |
| **Copy-Paste Programming**         | Same logic in many places                                               | Extract a shared method or module           |

### Review comments

```markdown
🔴 [blocking] "This class is 2000 lines — suggest splitting into focused classes."
🟡 [important] "This logic is repeated in 3 places — consider extracting a shared helper?"
💡 [suggestion] "This switch could be replaced with a strategy pattern for easier extension."
```

---

## Coupling and Cohesion

### Coupling types (best → worst)

| Type                    | Description                                         | Example                                      |
| ----------------------- | --------------------------------------------------- | -------------------------------------------- |
| **Message coupling** ✅ | Passing data via parameters                         | `calculate(price, quantity)`                 |
| **Data coupling** ✅    | Sharing simple data structures                      | `processOrder(orderDTO)`                     |
| **Stamp coupling** ⚠️   | Sharing complex data structures but only using part | Passing entire User but only using `name`    |
| **Control coupling** ⚠️ | Passing a control flag that changes behavior        | `process(data, isAdmin=true)`                |
| **Common coupling** ❌  | Sharing global state                                | Many modules reading/writing the same global |
| **Content coupling** ❌ | Directly accessing another module's internals       | Reaching into another class's private fields |

### Cohesion types (best → worst)

| Type                | Description                           | Quality       |
| ------------------- | ------------------------------------- | ------------- |
| **Functional**      | All elements complete a single task   | ✅ Best       |
| **Sequential**      | Output of one step feeds the next     | ✅ Good       |
| **Communicational** | Operates on the same data             | ⚠️ Acceptable |
| **Temporal**        | Tasks executed at the same time       | ⚠️ Weak       |
| **Logical**         | Related logic but different functions | ❌ Poor       |
| **Coincidental**    | No clear relationship                 | ❌ Worst      |

### Metric reference

```yaml
Coupling metrics:
  CBO (Coupling Between Objects):
    good: < 5
    warning: 5–10
    danger: > 10

  Ce (Efferent coupling):
    description: how many external classes this depends on
    good: < 7

  Ca (Afferent coupling):
    description: how many classes depend on this
    high values mean: changes ripple widely; needs to be stable

Cohesion metrics:
  LCOM4 (Lack of Cohesion of Methods):
    1: single responsibility ✅
    2–3: may need to split ⚠️
    >3: should split ❌
```

### Questions to ask

- "How many other modules does this module depend on? Can it be reduced?"
- "How many other places does a change here affect?"
- "Do the methods of this class all operate on the same data?"

---

## Layered Architecture Review

### Clean Architecture layer check

```
┌─────────────────────────────────────┐
│         Frameworks & Drivers        │ ← outer: web, DB, UI
├─────────────────────────────────────┤
│         Interface Adapters          │ ← controllers, gateways, presenters
├─────────────────────────────────────┤
│          Application Layer          │ ← use cases, application services
├─────────────────────────────────────┤
│            Domain Layer             │ ← entities, domain services
└─────────────────────────────────────┘
          ↑ dependencies point inward only ↑
```

### Dependency rule check

**Core rule: source dependencies point inward only**

```typescript
// ❌ Violates dependency rule: Domain layer depends on Infrastructure
// domain/User.ts
import { MySQLConnection } from '../infrastructure/database';

// ✅ Correct: Domain defines the interface, Infrastructure implements it
// domain/UserRepository.ts (interface)
interface UserRepository {
  findById(id: string): Promise<User>;
}

// infrastructure/MySQLUserRepository.ts (implementation)
class MySQLUserRepository implements UserRepository {
  findById(id: string): Promise<User> {
    /* ... */
  }
}
```

### Checklist

**Layer boundary checks:**

- [ ] Does the Domain layer have external dependencies (DB, HTTP, filesystem)?
- [ ] Does the Application layer touch the DB or external APIs directly?
- [ ] Does the Controller contain business logic?
- [ ] Are there cross-layer calls (UI calling a Repository directly)?

**Separation of concerns:**

- [ ] Is business logic separated from presentation logic?
- [ ] Is data access encapsulated in a dedicated layer?
- [ ] Are config and environment-specific code centralized?

### Review comments

```markdown
🔴 [blocking] "Domain entity imports a database connection — violates the dependency rule."
🟡 [important] "Controller contains business calculation — move it to the Service layer."
💡 [suggestion] "Consider dependency injection to decouple these components."
```

---

## Design Pattern Use

### When to apply patterns

| Pattern       | Good fit                                                              | Bad fit                                        |
| ------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| **Factory**   | Need to create different types decided at runtime                     | Only one type, or the type never changes       |
| **Strategy**  | Algorithm needs to switch at runtime; multiple interchangeable        | Only one algorithm or it won't change          |
| **Observer**  | One-to-many dependency; state change must notify many objects         | A simple direct call would suffice             |
| **Singleton** | Truly need a single global instance (e.g. config manager)             | Object can be passed via dependency injection  |
| **Decorator** | Need to add responsibilities dynamically; avoid inheritance explosion | Fixed responsibilities; no dynamic composition |

### Over-engineering warning signs

```
⚠️ "Patternitis" symptoms:

1. A simple if/else replaced by strategy + factory + registry
2. Interfaces with only one implementation
3. Abstractions added "in case we need them later"
4. Line count balloons due to pattern application
5. New hires take a long time to understand the code structure
```

### Review principles

```markdown
✅ Good pattern use:

- Solves a real extensibility problem
- Makes code easier to understand and test
- Makes adding new features easier

❌ Pattern overuse:

- Pattern used for its own sake
- Adds unnecessary complexity
- Violates YAGNI
```

### Questions to ask

- "What concrete problem does this pattern solve?"
- "What would go wrong without this pattern?"
- "Is the value this abstraction adds worth the complexity?"

---

## Extensibility

### Checklist

**Feature extensibility:**

- [ ] Does adding a new feature require modifying core code?
- [ ] Are extension points provided (hooks, plugins, events)?
- [ ] Is configuration externalized (config files, env vars)?

**Data extensibility:**

- [ ] Does the data model support new fields?
- [ ] Are growth scenarios considered?
- [ ] Are queries appropriately indexed?

**Load extensibility:**

- [ ] Can it scale horizontally (more instances)?
- [ ] Are there state dependencies (session, local cache)?
- [ ] Are DB connections pooled?

### Extension-point design

```typescript
// ✅ Good extension design: events/hooks
class OrderService {
  private hooks: OrderHooks;

  async createOrder(order: Order) {
    await this.hooks.beforeCreate?.(order);
    const result = await this.save(order);
    await this.hooks.afterCreate?.(result);
    return result;
  }
}

// ❌ Bad extension design: every behavior hardcoded
class OrderService {
  async createOrder(order: Order) {
    await this.sendEmail(order); // hardcoded
    await this.updateInventory(order); // hardcoded
    await this.notifyWarehouse(order); // hardcoded
    return await this.save(order);
  }
}
```

### Review comments

```markdown
💡 [suggestion] "If we need to support new payment methods later, is this easy to extend?"
🟡 [important] "This logic is hardcoded — consider config or a strategy pattern?"
📚 [learning] "Event-driven architecture would make this easier to extend."
```

---

## Code Structure Best Practices

### Directory organization

**By feature/domain (recommended):**

```
src/
├── user/
│   ├── User.ts           (entity)
│   ├── UserService.ts    (service)
│   ├── UserRepository.ts (data access)
│   └── UserController.ts (API)
├── order/
│   ├── Order.ts
│   ├── OrderService.ts
│   └── ...
└── shared/
    ├── utils/
    └── types/
```

**By technical layer (not recommended):**

```
src/
├── controllers/     ← mixes unrelated domains
│   ├── UserController.ts
│   └── OrderController.ts
├── services/
├── repositories/
└── models/
```

### Naming conventions

| Kind            | Convention                | Example                          |
| --------------- | ------------------------- | -------------------------------- |
| Class names     | PascalCase, noun          | `UserService`, `OrderRepository` |
| Method names    | camelCase, verb           | `createUser`, `findOrderById`    |
| Interface names | `I` prefix or no prefix   | `IUserService` or `UserService`  |
| Constants       | UPPER_SNAKE_CASE          | `MAX_RETRY_COUNT`                |
| Private fields  | underscore prefix or none | `_cache` or `#cache`             |

### File-size guidance

```yaml
Suggested limits:
  single file: < 300 lines
  single function: < 50 lines
  single class: < 200 lines
  function parameters: < 4
  nesting depth: < 4

When exceeded:
  - Consider splitting into smaller units
  - Prefer composition over inheritance
  - Extract helper functions or classes
```

### Review comments

```markdown
🟢 [nit] "This 500-line file could be split by responsibility."
🟡 [important] "Prefer organizing by feature domain rather than technical layer."
💡 [suggestion] "Function name `process` is unclear — consider `calculateOrderTotal`?"
```

---

## Quick Reference

### 5-minute architecture review

```markdown
□ Are dependencies pointing the right way? (outer → inner)
□ Any circular dependencies?
□ Is core business logic decoupled from framework / UI / database?
□ Are SOLID principles being followed?
□ Any obvious anti-patterns?
```

### Red flags (must address)

```markdown
🔴 God Object — single class over 1000 lines
🔴 Circular dependency — A → B → C → A
🔴 Domain layer pulls in framework dependencies
🔴 Hardcoded config or secrets
🔴 External services called without an interface
```

### Yellow flags (consider addressing)

```markdown
🟡 CBO (coupling) > 10
🟡 Method has more than 5 parameters
🟡 Nesting depth exceeds 4
🟡 Duplicated block > 10 lines
🟡 Interface with only one implementation
```

---

## Tooling

| Tool          | Use                                     | Languages             |
| ------------- | --------------------------------------- | --------------------- |
| **SonarQube** | Code quality, coupling analysis         | Multi-language        |
| **NDepend**   | Dependency analysis, architecture rules | .NET                  |
| **JDepend**   | Package dependency analysis             | Java                  |
| **Madge**     | Module dependency graphs                | JavaScript/TypeScript |
| **ESLint**    | Style and complexity checks             | JavaScript/TypeScript |
| **CodeScene** | Tech debt and hotspot analysis          | Multi-language        |

---

## Further Reading

- [Clean Architecture — Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles in Code Review — JetBrains](https://blog.jetbrains.com/upsource/2015/08/31/what-to-look-for-in-a-code-review-solid-principles-2/)
- [Software Architecture Anti-Patterns](https://medium.com/@christophnissle/anti-patterns-in-software-architecture-3c8970c9c4f5)
- [Coupling and Cohesion in System Design](https://www.geeksforgeeks.org/system-design/coupling-and-cohesion-in-system-design/)
- [Design Patterns — Refactoring Guru](https://refactoring.guru/design-patterns)
