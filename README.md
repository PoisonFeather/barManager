# 🍺 BarManager SaaS - Seamless QR Ordering

Soluție SaaS de tip "White-Label" pentru digitalizarea meniurilor și eficientizarea procesului de comandă în baruri și restaurante.

## 🚀 Misiunea
Eliminarea timpilor de așteptare și creșterea bonului mediu prin oferirea unei experiențe de comandă direct de pe telefon, fără instalare de aplicații, păstrând în același timp identitatea vizuală a locației.

## 🛠 Tech Stack
- **Frontend:** Next.js 15+ (App Router), Tailwind CSS, TypeScript.
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL (Dockerized).
- **Communication:** REST API (JSON Aggregation).

## 📂 Structura Proiectului
- `/admin-panel` - Interfața Next.js pentru onboarding și management bar.
- `/backend` - API-ul centralizat (Node.js).
- `/docker` - Configurația bazei de date.
- `/scripts` - Tool-uri de automatizare (Import/Export).

## 🔧 Setup Rapid
1. **DB:** `cd docker && docker-compose up -d`
2. **Backend:** `npm install && npm run dev` (Port 3001)
3. **Frontend:** `cd admin-panel && npm install && npm run dev` (Port 3000)

## 🏗 Roadmap Realizat
- [x] Arhitectură Bază de Date Multi-tenant.
- [x] Endpoint Onboarding "Bulk Import" (Bar + Meniu + Mese).
- [x] Client View cu design premium și branding dinamic.
- [x] Sistem de coș de cumpărături (Local State).