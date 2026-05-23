# Performance Review Guide

Performance review guide covering frontend, backend, database, algorithmic complexity, and API performance.

## Contents

- [Frontend Performance (Core Web Vitals)](#frontend-performance-core-web-vitals)
- [JavaScript Performance](#javascript-performance)
- [Memory Management](#memory-management)
- [Database Performance](#database-performance)
- [API Performance](#api-performance)
- [Algorithmic Complexity](#algorithmic-complexity)
- [Performance Review Checklist](#performance-review-checklist)

---

## Frontend Performance (Core Web Vitals)

### 2024 Core Metrics

| Metric  | Full name                 | Target  | Meaning                                           |
| ------- | ------------------------- | ------- | ------------------------------------------------- |
| **LCP** | Largest Contentful Paint  | ≤ 2.5s  | Largest content paint time                        |
| **INP** | Interaction to Next Paint | ≤ 200ms | Interaction responsiveness (replaced FID in 2024) |
| **CLS** | Cumulative Layout Shift   | ≤ 0.1   | Cumulative layout shift                           |
| **FCP** | First Contentful Paint    | ≤ 1.8s  | First content paint                               |
| **TBT** | Total Blocking Time       | ≤ 200ms | Main-thread blocking time                         |

### LCP Optimization

```javascript
// ❌ Lazy-loading the LCP image delays the most critical content
<img src="hero.jpg" loading="lazy" />

// ✅ Load the LCP image with high priority
<img src="hero.jpg" fetchpriority="high" />

// ❌ Unoptimized image format
<img src="hero.png" />  // PNG is often too large

// ✅ Modern image formats + responsive
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero" />
</picture>
```

**Review points:**

- [ ] Is the LCP element set to `fetchpriority="high"`?
- [ ] Are WebP/AVIF formats used?
- [ ] Is there SSR or static generation?
- [ ] Is the CDN configured correctly?

### FCP Optimization

```html
<!-- ❌ Render-blocking CSS -->
<link rel="stylesheet" href="all-styles.css" />

<!-- ✅ Inline critical CSS + async-load the rest -->
<style>
  /* Critical above-the-fold styles */
</style>
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />

<!-- ❌ Render-blocking font -->
@font-face { font-family: 'CustomFont'; src: url('font.woff2'); }

<!-- ✅ Font-display optimization -->
@font-face { font-family: 'CustomFont'; src: url('font.woff2'); font-display: swap; /* show system font first, swap in
when loaded */ }
```

### INP Optimization

```javascript
// ❌ A long task blocks the main thread
button.addEventListener('click', () => {
  // 500ms synchronous work
  processLargeData(data);
  updateUI();
});

// ✅ Split the long task
button.addEventListener('click', async () => {
  // Yield the main thread
  (await scheduler.yield?.()) ?? new Promise((r) => setTimeout(r, 0));

  // Process in chunks
  for (const chunk of chunks) {
    processChunk(chunk);
    await scheduler.yield?.();
  }
  updateUI();
});

// ✅ Heavy computation in a Web Worker
const worker = new Worker('heavy-computation.js');
worker.postMessage(data);
worker.onmessage = (e) => updateUI(e.data);
```

### CLS Optimization

```css
/* ❌ Media without size hints */
img {
  width: 100%;
}

/* ✅ Reserve space */
img {
  width: 100%;
  aspect-ratio: 16 / 9;
}

/* ❌ Dynamic content insertion causes layout shift */
.ad-container {
}

/* ✅ Reserve a fixed height */
.ad-container {
  min-height: 250px;
}
```

**CLS checklist:**

- [ ] Do images/videos have `width`/`height` or `aspect-ratio`?
- [ ] Does font loading use `font-display: swap`?
- [ ] Is space reserved for dynamic content?
- [ ] Avoid inserting content above existing content?

---

## JavaScript Performance

### Code splitting and lazy-loading

```javascript
// ❌ Load all code upfront
import { HeavyChart } from './charts';
import { PDFExporter } from './pdf';
import { AdminPanel } from './admin';

// ✅ Load on demand
const HeavyChart = lazy(() => import('./charts'));
const PDFExporter = lazy(() => import('./pdf'));

// ✅ Route-level code splitting
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard')),
  },
  {
    path: '/admin',
    component: lazy(() => import('./pages/Admin')),
  },
];
```

### Bundle size

```javascript
// ❌ Import the whole library
import _ from 'lodash';
import moment from 'moment';

// ✅ Import only what you need
import debounce from 'lodash/debounce';
import { format } from 'date-fns';

// ❌ Tree-shaking unfriendly
export default {
  fn1() {},
  fn2() {}, // unused but bundled
};

// ✅ Named exports support tree-shaking
export function fn1() {}
export function fn2() {}
```

**Bundle checklist:**

- [ ] Dynamic `import()` used for code splitting?
- [ ] Large libraries imported on demand?
- [ ] Bundle size analyzed (e.g. webpack-bundle-analyzer)?
- [ ] Any unused dependencies?

### List rendering

```javascript
// ❌ Render a huge list directly
function List({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  ); // 10000 items = 10000 DOM nodes
}

// ✅ Virtualized list — render only visible items
// Use react-window or @tanstack/react-virtual

// React example with @tanstack/react-virtual:
// const virtualizer = useVirtualizer({
//   count: items.length,
//   getScrollElement: () => parentRef.current,
//   estimateSize: () => 35,
// });
// {virtualizer.getVirtualItems().map(virtualRow => (
//   <div key={virtualRow.key}>{items[virtualRow.index].name}</div>
// ))}
```

**Large-data review points:**

- [ ] Lists over 100 items use virtual scrolling?
- [ ] Tables paginated or virtualized?
- [ ] Any unnecessary full re-renders?

---

## Memory Management

### Common memory leaks

#### 1. Uncleaned event listeners

```javascript
// ❌ Listener stays attached after component unmounts
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ Remove the listener
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

#### 2. Uncleaned timers

```javascript
// ❌ Timer never cleared
useEffect(() => {
  setInterval(fetchData, 5000);
}, []);

// ✅ Clear the timer
useEffect(() => {
  const timer = setInterval(fetchData, 5000);
  return () => clearInterval(timer);
}, []);
```

#### 3. Closure references

```javascript
// ❌ Closure holds a reference to a large object
function createHandler() {
  const largeData = new Array(1000000).fill('x');

  return function handler() {
    // largeData is captured and can't be collected
    console.log(largeData.length);
  };
}

// ✅ Keep only what you need
function createHandler() {
  const largeData = new Array(1000000).fill('x');
  const length = largeData.length; // capture only the value

  return function handler() {
    console.log(length);
  };
}
```

#### 4. Uncleaned subscriptions

```javascript
// ❌ WebSocket / EventSource not closed
useEffect(() => {
  const ws = new WebSocket('wss://...');
  ws.onmessage = handleMessage;
}, []);

// ✅ Close the connection
useEffect(() => {
  const ws = new WebSocket('wss://...');
  ws.onmessage = handleMessage;
  return () => ws.close();
}, []);
```

### Memory checklist

```markdown
- [ ] Every useEffect has a cleanup return?
- [ ] Event listeners removed on unmount?
- [ ] Timers cleared?
- [ ] WebSocket/SSE connections closed?
- [ ] Large objects released promptly?
- [ ] No global variables accumulating data?
```

### Detection tools

| Tool                   | Use                         |
| ---------------------- | --------------------------- |
| Chrome DevTools Memory | Heap snapshot analysis      |
| MemLab (Meta)          | Automated leak detection    |
| Performance Monitor    | Real-time memory monitoring |

---

## Database Performance

### N+1 Queries

```javascript
// TypeORM example
// ❌ N+1 problem
const users = await userRepository.find();
for (const user of users) {
  const posts = await user.posts; // a query per iteration
}

// ✅ Eager loading
const users = await userRepository.find({
  relations: ['posts'],
});
```

```typescript
// ORM example (e.g. Prisma, Drizzle, TypeORM)
// ❌ N+1 problem
const users = await db.user.findMany();
for (const user of users) {
  const posts = await db.post.findMany({ where: { userId: user.id } });
}

// ✅ Use eager loading / includes
const users = await db.user.findMany({
  include: { posts: true },
});
```

### Index optimization

```sql
-- ❌ Full table scan
SELECT * FROM orders WHERE status = 'pending';

-- ✅ Add an index
CREATE INDEX idx_orders_status ON orders(status);

-- ❌ Index unusable: function on column
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- ✅ Range query can use the index
SELECT * FROM users
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- ❌ Index unusable: leading wildcard in LIKE
SELECT * FROM products WHERE name LIKE '%phone%';

-- ✅ Prefix match can use the index
SELECT * FROM products WHERE name LIKE 'phone%';
```

### Query optimization

```sql
-- ❌ SELECT * pulls columns you don't need
SELECT * FROM users WHERE id = 1;

-- ✅ Select only what you need
SELECT id, name, email FROM users WHERE id = 1;

-- ❌ Large table without LIMIT
SELECT * FROM logs WHERE type = 'error';

-- ✅ Paginated
SELECT * FROM logs WHERE type = 'error' LIMIT 100 OFFSET 0;
```

```javascript
// ❌ Query inside a loop
for (const id of userIds) {
  await db.user.findUnique({ where: { id } });
}

// ✅ Batch query
await db.user.findMany({ where: { id: { in: userIds } } });
```

### Database checklist

```markdown
🔴 Must check:

- [ ] Any N+1 queries?
- [ ] WHERE clause columns indexed?
- [ ] Avoided SELECT \*?
- [ ] LIMIT on large-table queries?

🟡 Should check:

- [ ] Did you EXPLAIN the query plan?
- [ ] Composite-index column order correct?
- [ ] Any unused indexes?
- [ ] Slow-query log monitoring in place?
```

---

## API Performance

### Pagination

```javascript
// ❌ Return everything
app.get('/users', async (req, res) => {
  const users = await User.findAll(); // could be 100,000 rows
  res.json(users);
});

// ✅ Paginate + cap the page size
app.get('/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // max 100
  const offset = (page - 1) * limit;

  const { rows, count } = await User.findAndCountAll({
    limit,
    offset,
    order: [['id', 'ASC']],
  });

  res.json({
    data: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  });
});
```

### Caching

```javascript
// ✅ Redis cache example
async function getUser(id) {
  const cacheKey = `user:${id}`;

  // 1. Check the cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Query the database
  const user = await db.users.findById(id);

  // 3. Write to cache with a TTL
  await redis.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
}

// ✅ HTTP cache headers
app.get('/static-data', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=86400', // 24h
    ETag: 'abc123',
  });
  res.json(data);
});
```

### Response compression

```javascript
// ✅ Enable Gzip/Brotli
const compression = require('compression');
app.use(compression());

// ✅ Return only necessary fields
// Request: GET /users?fields=id,name,email
app.get('/users', async (req, res) => {
  const fields = req.query.fields?.split(',') || ['id', 'name'];
  const users = await User.findAll({
    attributes: fields,
  });
  res.json(users);
});
```

### Rate limiting

```javascript
// ✅ Rate limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests max
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api/', limiter);
```

### API checklist

```markdown
- [ ] List endpoints paginated?
- [ ] Max page size capped?
- [ ] Hot data cached?
- [ ] Response compression enabled?
- [ ] Rate limiting in place?
- [ ] Returning only the fields needed?
```

---

## Algorithmic Complexity

### Common complexities

| Complexity | Name         | 10 items | 1,000 items | 1M items   | Example             |
| ---------- | ------------ | -------- | ----------- | ---------- | ------------------- |
| O(1)       | Constant     | 1        | 1           | 1          | Hash lookup         |
| O(log n)   | Logarithmic  | 3        | 10          | 20         | Binary search       |
| O(n)       | Linear       | 10       | 1,000       | 1,000,000  | Array traversal     |
| O(n log n) | Linearithmic | 33       | 10,000      | 20,000,000 | Quicksort           |
| O(n²)      | Quadratic    | 100      | 1,000,000   | 1 trillion | Nested loops        |
| O(2ⁿ)      | Exponential  | 1024     | ∞           | ∞          | Recursive Fibonacci |

### Spotting issues in review

```javascript
// ❌ O(n²) — nested loops
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// ✅ O(n) — use a Set
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    }
    seen.add(item);
  }
  return [...duplicates];
}
```

```javascript
// ❌ O(n²) — includes() inside a loop
function removeDuplicates(arr) {
  const result = [];
  for (const item of arr) {
    if (!result.includes(item)) {
      // includes is O(n)
      result.push(item);
    }
  }
  return result;
}

// ✅ O(n) — Set
function removeDuplicates(arr) {
  return [...new Set(arr)];
}
```

```javascript
// ❌ O(n) lookup — traverse every time
const users = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, ...];

function getUser(id) {
  return users.find(u => u.id === id);  // O(n)
}

// ✅ O(1) lookup — Map
const userMap = new Map(users.map(u => [u.id, u]));

function getUser(id) {
  return userMap.get(id);  // O(1)
}
```

### Space complexity

```javascript
// ⚠️ O(n) space — creates a new array
const doubled = arr.map((x) => x * 2);

// ✅ O(1) space — in-place mutation (if allowed)
for (let i = 0; i < arr.length; i++) {
  arr[i] *= 2;
}

// ⚠️ Deep recursion may blow the stack
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // O(n) stack space
}

// ✅ Iterative — O(1) stack space
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
```

### Complexity review comments

```markdown
💡 "This nested loop is O(n²) — could be a problem at scale."
🔴 "Array.includes() inside a loop makes this O(n²) — use a Set."
🟡 "This recursion depth could blow the stack — consider iteration or tail recursion."
```

---

## Performance Review Checklist

### 🔴 Must check (blocking)

**Frontend:**

- [ ] LCP image lazy-loaded? (it shouldn't be)
- [ ] Any `transition: all`?
- [ ] Animating width/height/top/left?
- [ ] Lists >100 items virtualized?

**Backend:**

- [ ] Any N+1 queries?
- [ ] List endpoints paginated?
- [ ] SELECT \* on large tables?

**General:**

- [ ] Any O(n²) or worse nested loops?
- [ ] useEffect / event listeners cleaned up?

### 🟡 Should check (important)

**Frontend:**

- [ ] Code splitting used?
- [ ] Large libraries imported on demand?
- [ ] Images served as WebP/AVIF?
- [ ] Unused dependencies?

**Backend:**

- [ ] Hot data cached?
- [ ] WHERE columns indexed?
- [ ] Slow-query monitoring?

**API:**

- [ ] Response compression enabled?
- [ ] Rate limiting?
- [ ] Returning only the fields needed?

### 🟢 Nice to have

- [ ] Bundle size analyzed?
- [ ] CDN used?
- [ ] Performance monitoring in place?
- [ ] Performance benchmark run?

---

## Performance Thresholds

### Frontend

| Metric           | Good    | Needs work | Poor    |
| ---------------- | ------- | ---------- | ------- |
| LCP              | ≤ 2.5s  | 2.5–4s     | > 4s    |
| INP              | ≤ 200ms | 200–500ms  | > 500ms |
| CLS              | ≤ 0.1   | 0.1–0.25   | > 0.25  |
| FCP              | ≤ 1.8s  | 1.8–3s     | > 3s    |
| Bundle Size (JS) | < 200KB | 200–500KB  | > 500KB |

### Backend

| Metric         | Good    | Needs work | Poor    |
| -------------- | ------- | ---------- | ------- |
| API response   | < 100ms | 100–500ms  | > 500ms |
| Database query | < 50ms  | 50–200ms   | > 200ms |
| Page load      | < 3s    | 3–5s       | > 5s    |

---

## Tooling

### Frontend performance

| Tool                                                                                   | Use                           |
| -------------------------------------------------------------------------------------- | ----------------------------- |
| [Lighthouse](https://developer.chrome.com/docs/lighthouse/)                            | Core Web Vitals testing       |
| [WebPageTest](https://www.webpagetest.org/)                                            | Detailed performance analysis |
| [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)  | Bundle analysis               |
| [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/) | Runtime profiling             |

### Memory detection

| Tool                                                  | Use                      |
| ----------------------------------------------------- | ------------------------ |
| [MemLab](https://github.com/facebookincubator/memlab) | Automated leak detection |
| Chrome Memory Tab                                     | Heap snapshot analysis   |

### Backend performance

| Tool                                                                       | Use                               |
| -------------------------------------------------------------------------- | --------------------------------- |
| EXPLAIN                                                                    | Database query-plan analysis      |
| [pganalyze](https://pganalyze.com/)                                        | PostgreSQL performance monitoring |
| [New Relic](https://newrelic.com/) / [Datadog](https://www.datadoghq.com/) | APM monitoring                    |

---

## Further Reading

- [Core Web Vitals — web.dev](https://web.dev/articles/vitals)
- [Optimizing Core Web Vitals — Vercel](https://vercel.com/guides/optimizing-core-web-vitals-in-2024)
- [MemLab — Meta Engineering](https://engineering.fb.com/2022/09/12/open-source/memlab/)
- [Big O Cheat Sheet](https://www.bigocheatsheet.com/)
- [N+1 Query Problem — Stack Overflow](https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm-object-relational-mapping)
- [API Performance Optimization](https://algorithmsin60days.com/blog/optimizing-api-performance/)
