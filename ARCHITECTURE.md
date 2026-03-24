# BarManager Architecture Guide

This document is the technical onboarding guide for engineers joining the BarManager project.

It explains:

- repository structure
- backend and frontend responsibilities
- request and data flows
- code ownership boundaries
- scalability direction
- team conventions for safe changes

---

## 1) System overview

BarManager is a full-stack QR ordering platform for bars/restaurants.

High-level architecture:

```text
Customer/Staff Browser (Next.js)
            |
            v
      Express REST API
            |
            v
       PostgreSQL
```

Primary business flow:

1. Venue onboarding (bar setup + menu + tables)
2. Customer menu access by bar slug and table query
3. Order creation and tracking
4. Bartender dashboard operations (serve items, close table, stock updates)
5. Service requests (waiter / bill)

---

## 2) Repository structure

```text
barManager/
  README.md
  ARCHITECTURE.md
  backend/
    index.js
    package.json
    src/
      README.md
      app.js
      config/
        env.js
      db/
        pool.js
      middleware/
        validation.js
      controllers/
      services/
      repositories/
      routes/
        dashboard.routes.js
        health.routes.js
        menu.routes.js
        onboarding.routes.js
        orders.routes.js
        requests.routes.js
  admin-panel/
    app/
      dashboard/[slug]/page.tsx
      menu/[slug]/page.tsx
      onboarding/page.tsx
      layout.tsx
      providers.tsx
  docker/
    docker-compose.yml
```

Notes:

- `frontend/` exists but current active web app is `admin-panel/`.
- Backend runtime entrypoint remains `backend/index.js`.

---

## 3) Backend architecture (current)

The backend has been refactored toward SRP at module level.

### 3.1 Composition layers

1. `backend/index.js` (bootstrap)
   - loads env
   - creates app
   - starts HTTP server
2. `backend/src/app.js` (HTTP composition)
   - configures middleware
   - registers route modules
3. `backend/src/middleware/*.js` (cross-cutting HTTP concerns)
   - request validation and request-shape guards
4. `backend/src/routes/*.routes.js` (transport layer)
   - route path/method binding to middleware + controllers
5. `backend/src/controllers/*.js` (HTTP orchestration)
   - converts HTTP inputs to service calls and maps responses
6. `backend/src/services/*.js` (domain logic)
   - business rules and transaction orchestration
7. `backend/src/repositories/*.js` (persistence)
   - SQL and DB interaction only
8. `backend/src/db/pool.js` (data access primitive)
   - shared PostgreSQL pool
9. `backend/src/config/env.js` (runtime config)
   - env loading and diagnostics

### 3.2 Backend responsibility map

- `config/env.js`
  - owns env loading and required variable checks
  - must stay free of route/business logic
- `db/pool.js`
  - owns DB client pool creation
  - must not register routes or business behavior
- `middleware/validation.js`
  - owns payload and params shape validation
  - rejects invalid input early with 400 responses
- `routes/*.routes.js`
  - own HTTP transport binding only
  - delegate to middleware and controllers
- `controllers/*.js`
  - own request/response orchestration
  - should not contain SQL
- `services/*.js`
  - own domain behavior and use-case orchestration
  - should not depend on Express req/res
- `repositories/*.js`
  - own SQL and persistence details
  - return data primitives to services

### 3.3 Route domains

- `menu.routes.js`
  - menu read endpoints
  - category/product creation endpoints
- `onboarding.routes.js`
  - full setup transaction for bar + menu + tables
- `orders.routes.js`
  - order creation, status updates, table history, serving, table close
- `dashboard.routes.js`
  - dashboard summary and stock toggle
- `requests.routes.js`
  - table service request creation/completion
- `health.routes.js`
  - DB readiness endpoint (`GET /health/db`)

### 3.4 Validation middleware coverage

Critical endpoint guards are centralized in `backend/src/middleware/validation.js`:

- `POST /onboarding/full-setup`
  - required `bar_name`, `slug`, `menu[]` structure
- `POST /orders`
  - required numeric ids, non-empty items, positive totals/prices
- `POST /requests`
  - required ids and request type
- `PATCH /products/:productId/toggle`
  - valid `productId` and boolean `is_available`

---

## 4) Frontend architecture (current)

`admin-panel` is a Next.js App Router application containing both setup/admin and operational pages.

Current major pages:

- `app/onboarding/page.tsx`
  - bar setup wizard and payload creation
- `app/menu/[slug]/page.tsx`
  - customer menu experience, cart handling, order submission
- `app/dashboard/[slug]/page.tsx`
  - bartender operations and live view

Current frontend SRP status:

- page files are still large and mix UI + state + network concerns
- next planned step is feature-level decomposition into hooks/components/api modules

---

## 5) Data and request flow

### 5.1 Onboarding flow

1. Frontend sends `POST /onboarding/full-setup`
2. Backend starts SQL transaction
3. Creates bar, categories, products, and tables
4. Commits or rolls back as a unit

### 5.2 Ordering flow

1. Customer opens menu by bar slug
2. Frontend reads full menu (`GET /menu-complete/:slug`)
3. Customer sends `POST /orders`
4. Dashboard reads active/pending data
5. Staff marks items served and closes table when paid

### 5.3 Operational support flow

1. Customer sends waiter/bill request (`POST /requests`)
2. Dashboard summary includes pending requests
3. Staff completes request (`PATCH /requests/:id/complete`)

---

## 6) API surface (grouped)

### Onboarding and catalog

- `POST /onboarding/full-setup`
- `GET /menu/:slug`
- `GET /menu-complete/:slug`
- `POST /categories`
- `POST /products`

### Orders and table lifecycle

- `POST /orders`
- `GET /orders/:barId`
- `PATCH /orders/:orderId/status`
- `GET /table-history/:tableId`
- `PATCH /order-items/:itemId/serve`
- `PATCH /tables/:tableId/close`

### Dashboard and service requests

- `GET /dashboard/summary/:barId`
- `PATCH /products/:productId/toggle`
- `POST /requests`
- `PATCH /requests/:id/complete`

Validation notes:

- invalid payloads return `400` with `{ error, details }`
- controllers/services run only after middleware passes

### Health

- `GET /health/db`

---

## 7) Runtime and environment

### 7.1 Services and ports

- Backend API: `http://localhost:3001`
- Frontend UI: `http://localhost:3000`
- PostgreSQL: containerized via `docker/docker-compose.yml`

### 7.2 Required backend env vars

- `DATABASE_URL` (required)
- `PORT` (optional, defaults to 3001)

---

## 8) Team conventions (important)

These conventions keep the codebase maintainable as the team scales.

### 8.1 Responsibility boundaries

- `index.js`: startup only
- `app.js`: middleware + route registration only
- `config/`: runtime config only
- `db/`: connection primitives only
- `routes/`: HTTP transport only (target state)
- `middleware/`: shared request guards and cross-cutting concerns
- `controllers/`: request/response orchestration
- `services/`: domain logic + orchestration
- `repositories/`: SQL and DB queries only

### 8.2 Change strategy

- prefer small, vertical slices over big rewrites
- keep endpoint contracts stable unless explicitly versioning
- avoid mixing refactor + feature + schema changes in one PR
- add/update docs in the same PR when boundaries change

### 8.3 Error handling standards

- always return JSON errors from API handlers
- include clear operational messages for client and logs
- use health checks for environment/db issues before debugging business logic

### 8.4 Naming standards

- files: lowercase with domain suffixes (`orders.routes.js`)
- folders: singular purpose (`config`, `db`, `routes`)
- endpoints: resource-based naming and consistent params

---

## 9) Known technical debt

Current technical debt to address in upcoming refactors:

1. Some controllers still duplicate error-status resolution helper logic
2. Frontend pages remain large and multi-responsibility
3. Automated backend tests are still limited
4. Validation rules are centralized but can be expanded per endpoint

---

## 10) Roadmap to scalable architecture

Suggested staged migration:

### Phase A (done)

- split backend bootstrap/config/db/routes modules
- add DB health check endpoint

### Phase B (next)

- standardize shared error response helpers across controllers
- expand automated tests for critical transactional flows
- add stricter per-endpoint validation rules where needed

### Phase C

- frontend feature modularization (`menu`, `dashboard`, `onboarding`)
- shared frontend API client with env-safe base URL

### Phase D

- test coverage for critical business flows
- auth, rate limiting, and stronger API hardening

---

## 11) New engineer onboarding checklist

1. Read `README.md` and this file
2. Start PostgreSQL, backend, and frontend locally
3. Verify `GET /health/db` returns `status: ok`
4. Walk through core user journey:
   - create a bar
   - open menu
   - create order
   - serve item
   - close table
5. Before coding, identify which layer your change belongs to
6. Keep PR scope aligned to one concern whenever possible

---

## 12) Ownership suggestion

As the team grows, assign owners by domain:

- onboarding + catalog
- orders + table lifecycle
- dashboard + requests
- platform (infra/config/dev tooling)

This reduces merge conflicts and clarifies accountability.
