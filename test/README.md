This folder contains the project's test files.

Layout:
- `*.route.test.js` — Active route-level API tests. These are the only tests included by Vitest by default.
- `routeMocks.js` — Shared helper used by route tests.
- `archived/` — Legacy or service-level tests moved here for reference. These are not executed by default.

To run only active route tests locally:

```bash
npm test
```

To run archived tests (not recommended in CI), you can update `vitest.config.ts` `include` pattern or run explicitly:

```bash
npx vitest run test/archived/*.test.js
```

If you want archived tests removed, confirm and I'll delete them.
