# LocalTown — Smart Town Community Platform (MERN)

Full-stack community platform built with **React + Tailwind** (frontend) and **Node.js + Express + MongoDB** (backend).

## Folder structure

- `frontend/` React UI (Tailwind, React Router, Axios)
- `backend/` Express API (JWT auth, Mongoose models, Socket.IO notifications)

## Quick start (local)

### 1) Backend

Create `backend/.env` from `backend/.env.example` and set:

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN` (default `http://localhost:5173`)

Run:

```bash
cd backend
npm install
npm run dev
```

Backend health check: `GET http://localhost:4000/health`

### 2) Frontend

Run:

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

## Key features included

- **Auth**: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
- **Rentals**: CRUD + text search (`/api/rentals`)
- **Workers**: profiles + admin verify (`/api/workers`)
- **Offers / Events / Alerts**: admin create + user feed (`/api/offers`, `/api/events`, `/api/alerts`)
- **Service requests**: cleaning & waste (`/api/services`)
- **Emergency help**: request + admin status (`/api/emergencies`)
- **Real-estate**: listings (`/api/real-estate`)
- **Materials**: orders (`/api/materials/orders`)
- **Reviews & favourites**: (`/api/reviews`, `/api/favorites`)
- **Real-time notifications**: Socket.IO emits `notification:new`
- **Payments**:
  - Stripe intent: `POST /api/payments/stripe/intent` (requires `STRIPE_SECRET_KEY`)
  - QR code payments (UPI URL + QR data URL): `POST /api/payments/qr`
- **AI assistant**: `POST /api/ai/chat` (local smart-search based recommendations)

