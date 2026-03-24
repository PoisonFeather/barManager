# BarManager

BarManager is a full-stack QR ordering MVP for bars and restaurants.

Core flow:

**Scan -> View menu -> Add to cart -> Send order -> Serve**

## What it does

- Creates a bar with full onboarding (bar + categories + products + tables)
- Exposes a customer-facing QR menu
- Accepts and tracks orders in real time for staff
- Provides bartender dashboard actions (serve items, close tables, stock toggle)
- Supports table service requests (waiter / bill)

## Architecture

```text
Next.js Admin + Client Views
        |
        v
Node.js + Express REST API
        |
        v
PostgreSQL (Docker)
```

## Tech stack

- Backend: Node.js, Express, pg, dotenv, cors
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Database: PostgreSQL 15 (Docker)

## Project structure

```text
barManager/
  backend/
    index.js
    src/
      app.js
      config/
      db/
      routes/
  admin-panel/
  docker/
  README.md
```

## Backend SRP structure

The backend was refactored toward Single Responsibility Principle (SRP):

- `backend/index.js`: process bootstrap only (load env, create app, start server)
- `backend/src/config/`: environment loading and startup diagnostics
- `backend/src/db/`: database connection pool
- `backend/src/app.js`: express middleware + route composition
- `backend/src/routes/`: domain-focused route modules

This layout improves scalability, maintainability, and safer domain evolution.

## Local setup

### 1) Start PostgreSQL (Docker)

Use the compose file under `docker/` (example):

```bash
cd docker
docker compose up -d
```

### 2) Configure backend environment

Create `backend/.env`:

```env
DATABASE_URL=postgres://user:password@localhost:5432/barmanager
```

Optional:

```env
PORT=3001
```

### 3) Run backend

```bash
cd backend
npm install
npm run dev
```

### 4) Run frontend

```bash
cd admin-panel
npm install
npm run dev
```

Default ports:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

## Health checks

- `GET /health/db`  
  Checks API readiness and database connectivity.

Example:

```bash
curl http://localhost:3001/health/db
```

## API overview (main endpoints)

### Onboarding and menu

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

### Dashboard and requests

- `GET /dashboard/summary/:barId`
- `PATCH /products/:productId/toggle`
- `POST /requests`
- `PATCH /requests/:id/complete`

## Example onboarding payload

```json
{
  "bar_name": "Sunset Pub",
  "slug": "sunset-pub",
  "primary_color": "#ff5500",
  "bar_number_tables": 12,
  "menu": [
    {
      "category": "Cocktails",
      "products": [
        {
          "name": "Mojito",
          "price": 28,
          "description": "Rum, lime, mint, soda"
        }
      ]
    }
  ]
}
```

## Roadmap

- Auth and role-based access
- Request validation middleware
- Rate limiting and API hardening
- Real-time updates (WebSocket or SSE)
- QR generation per table
- Analytics and payments
