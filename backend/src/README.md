# Backend SRP Architecture

This directory contains the backend runtime split by responsibility to support maintainability and scaling.

## Module Responsibilities

- `config/`
  - Environment loading and startup diagnostics.
  - No route or database domain logic.
- `db/`
  - Shared PostgreSQL connection primitives.
  - No HTTP concerns.
- `routes/`
  - HTTP transport layer: route definitions + request/response handling.
  - Should stay thin; business logic should move to services in future phases.
- `app.js`
  - Express app composition (middleware + route registration).
  - No direct SQL logic.

## Runtime Composition

`index.js` is the only process entrypoint and should only:

1. Load environment
2. Build app
3. Start server

## Next Scalability Steps

1. Introduce `controllers/` to remove business logic from route files.
2. Introduce `services/` for domain rules and transaction orchestration.
3. Introduce `repositories/` for SQL isolation and query reuse.
4. Add request validation middleware per domain endpoint.

Keeping these boundaries strict reduces change-collision and supports independent domain evolution.
