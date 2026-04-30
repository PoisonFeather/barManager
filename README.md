# BarManager SaaS

BarManager is a modern, real-time, full-stack QR ordering and bar management SaaS platform. It streamlines the ordering process for customers while providing powerful tools for waitstaff, kitchen staff, and bar owners.

## 🌟 Core Features

- **Customer QR Menu**: Scan a table's QR code to view a dynamic, beautiful menu and place orders instantly without waiting for a waiter.
- **Real-Time Staff Dashboard**: Waiters and bartenders receive orders instantly. Drag-and-drop table management, merging tables, and grouping by zones (e.g., Terrace, Interior).
- **Kitchen Display System (KDS)**: Dedicated view for kitchen staff to track and complete food orders, notifying waitstaff instantly when food is ready to be delivered.
- **Smart "My Share" Split Bill**: Customers at the same table can order independently from their own devices and easily track their personal contribution to the total table bill.
- **Automated AI Menu Import**: Built-in pipeline to convert PDF menus into structured database entries using AI (Groq/OpenAI).

## 🏗️ Architecture

```text
Next.js (Admin, Customer Views)
        |
    Socket.IO (Real-time sync)
        |
Node.js + Express REST API
        |
PostgreSQL (Database)
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16+, React, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend**: Node.js, Express, Socket.IO, pg, dotenv
- **Database**: PostgreSQL (Docker)

## 📁 Project Structure

```text
barManager/
  admin-panel/     # Next.js Frontend (Customer Menu, Dashboard, KDS, Landing)
  backend/         # Node.js Express API & Socket.IO Server
  docker/          # PostgreSQL Docker Compose
  import-menu/     # Standalone AI PDF parsing script
```

## 🚀 Local Setup

### 1. Start PostgreSQL (Docker)

```bash
cd docker
docker compose up -d
```

### 2. Configure Backend

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/barmanager
PORT=3001
JWT_SECRET=your_super_secret_key
```

Run the backend:
```bash
cd backend
npm install
npm run dev
```

### 3. Configure Frontend

Create `admin-panel/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

Run the frontend:
```bash
cd admin-panel
npm install
npm run dev
```

### Access Points:
- **Landing Page**: `http://localhost:3000`
- **Customer Menu**: `http://localhost:3000/menu/[slug]`
- **Staff Dashboard**: `http://localhost:3000/dashboard/[slug]`
- **Kitchen KDS**: `http://localhost:3000/dashboard/[slug]/kitchen`
- **Backend API**: `http://localhost:3001`

## 🔌 API Overview (Main Endpoints)

- **Auth**: `/auth/login`, `/auth/register`
- **Orders**: `/orders`, `/orders/staff`, `/orders/:orderId/status`
- **Tables**: `/tables/:tableId/close`, `/dashboard/merge-tables`, `/dashboard/tables/:tableId/zone`
- **Products**: `/dashboard/products`, `/categories`
- **Real-time**: Handled via Socket.IO events (`new-data`, `table-updated`, `menu-updated`)

## 📈 Recent Updates

- **Kitchen-to-Waitstaff Workflow**: Real-time notifications when food is ready to be delivered.
- **Smart Zones & History**: Tables are dynamically grouped by physical zones. History modal allows staff to edit/delete past items from a bill.
- **Premium Theming**: Updated SaaS landing page with dark mode and Framer Motion micro-animations.
