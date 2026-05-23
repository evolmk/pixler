# Common Bugs Checklist

Language-specific bugs and issues to watch for during code review.

## Universal Issues

### Logic Errors

- [ ] Off-by-one errors in loops and array access
- [ ] Incorrect boolean logic (De Morgan's law violations)
- [ ] Missing null/undefined checks
- [ ] Race conditions in concurrent code
- [ ] Incorrect comparison operators (== vs ===, = vs ==)
- [ ] Integer overflow/underflow
- [ ] Floating point comparison issues

### Resource Management

- [ ] Memory leaks (unclosed connections, listeners)
- [ ] File handles not closed
- [ ] Database connections not released
- [ ] Event listeners not removed
- [ ] Timers/intervals not cleared

### Error Handling

- [ ] Swallowed exceptions (empty catch blocks)
- [ ] Generic exception handling hiding specific errors
- [ ] Missing error propagation
- [ ] Incorrect error types thrown
- [ ] Missing finally/cleanup blocks

## TypeScript/JavaScript

### Type Issues

```typescript
// ❌ Using any defeats type safety
function process(data: any) {
  return data.value;
}

// ✅ Use proper types
interface Data {
  value: string;
}
function process(data: Data) {
  return data.value;
}
```

### Async/Await Pitfalls

```typescript
// ❌ Missing await
async function fetch() {
  const data = fetchData(); // Missing await!
  return data.json();
}

// ❌ Unhandled promise rejection
async function risky() {
  const result = await fetchData(); // No try-catch
  return result;
}

// ✅ Proper error handling
async function safe() {
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}
```

### TypeScript/JavaScript Common Mistakes

- [ ] `==` instead of `===`
- [ ] Modifying array/object during iteration
- [ ] `this` context lost in callbacks
- [ ] Closure capturing loop variable
- [ ] parseInt without radix parameter
- [ ] `any` used where a real type or `unknown` would do
- [ ] Non-null assertion (`!`) hiding a real undefined path

## React (project specifics)

Common review hits for React 19 + Zustand + TanStack Query:

- [ ] `useEffect` missing cleanup (event listeners, subscriptions, timers not cleaned up on unmount)
- [ ] `useEffect` with missing or incorrect dependency array (stale closures)
- [ ] `React.memo` / `useMemo` / `useCallback` misuse (premature optimization or missing where needed)
- [ ] Missing `key` prop on list items, or using array index as key when list is reordered
- [ ] Stale closure over state/props inside event handlers or callbacks
- [ ] Component re-renders caused by inline object/array/function literals as props
- [ ] Zustand selector not using shallow comparison for object selectors (unnecessary re-renders)
- [ ] TanStack Query `queryKey` not including all dependencies (stale cache)
- [ ] One-off hardcoded Tailwind values instead of design tokens or design system primitives
- [ ] State that should live in the URL (filters, pagination) stored in component state instead

## NestJS (project specifics)

- [ ] Controller route missing auth decision — public routes should be explicitly marked, protected routes must require authentication
- [ ] Public route that doesn't strictly validate inputs
- [ ] Missing role / permission guard for non-public route
- [ ] Write path that skips existing safety patterns where the repo already uses them
- [ ] DTO drift: shared types in `packages/` not updated alongside controller/service
- [ ] Service depends on transport-layer concerns it shouldn't know about
- [ ] Catch block that swallows the original error stack
- [ ] Logging that includes secrets / PII / tokens

## Database

### ORM queries

- [ ] Missing field selection — fetching entire rows/documents when only a few fields are needed
- [ ] N+1 patterns (loop over results, query inside)
- [ ] Unbounded queries without pagination / limit
- [ ] Write path that skips existing safety wrappers where the repo uses them
- [ ] Filter on a column/field that has no index
- [ ] Raw query that bypasses ORM typing without justification

### Common mistakes

- [ ] Trusting client-supplied IDs without ownership check
- [ ] Missing migration for a schema change
- [ ] Soft-delete vs hard-delete inconsistency across services
- [ ] Date stored as string (timezone bugs) vs proper Date/timestamp type
- [ ] No transaction across writes that must succeed together
- [ ] Sort on an unindexed column — in-memory sort blow-up on large tables

## API Design

### REST Issues

- [ ] Inconsistent resource naming
- [ ] Wrong HTTP methods (POST for idempotent operations)
- [ ] Missing pagination for list endpoints
- [ ] Incorrect status codes
- [ ] Missing rate limiting

### Data Validation

- [ ] Missing input validation
- [ ] Incorrect data type validation
- [ ] Missing length/range checks
- [ ] Not sanitizing user input
- [ ] Trusting client-side validation

## Testing

### Test Quality Issues

- [ ] Testing implementation details instead of behavior
- [ ] Missing edge case tests
- [ ] Flaky tests (non-deterministic)
- [ ] Tests with external dependencies
- [ ] Missing negative tests (error cases)
- [ ] Overly complex test setup
