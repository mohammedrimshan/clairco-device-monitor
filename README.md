# Clairco Device Monitor

An L1 IoT device monitoring prototype built as a technical assignment for the Fullstack Developer role at Clairco.

## Overview

The application allows operations users to register IoT devices and monitor their MQTT communication in real time. When a device stops sending heartbeat messages within its configured interval, the system marks it offline, notifies the assigned email address, and updates the dashboard instantly via Socket.IO — without requiring a page refresh.

---

## Features

- **Device management** — create, update, and delete monitored devices via a React dashboard
- **MQTT monitoring** — backend subscribes to each device's topic and processes incoming heartbeat messages
- **Per-device expected interval** — each device has its own configured communication window (in seconds)
- **Offline detection** — a background monitoring loop compares `lastSeenAt` against `expectedInterval` to identify silent devices
- **Email alerts** — a Nodemailer alert is sent to the device's configured `alertEmail` when it goes offline
- **Duplicate alert prevention** — `alertSent` flag ensures only one email is sent per offline period
- **Realtime status updates** — Socket.IO pushes device state changes to connected dashboards instantly
- **Dynamic MQTT subscriptions** — adding or removing a device updates MQTT subscriptions at runtime; no backend restart required
- **MQTT test simulator** — a development script that discovers registered devices via the API and publishes mock heartbeats
- **Device search and status filtering** — frontend supports filtering by name, device ID, and ONLINE/OFFLINE status
- **Live form validation** — Zod-powered client-side validation with per-field inline errors

---

## Tech Stack

### Frontend
- React 19, Vite, TypeScript
- Tailwind CSS v4, shadcn/ui components
- TanStack Query (server state, caching, cache invalidation)
- Socket.IO Client (realtime updates)
- Zod (schema validation and live form feedback)
- Sonner (toast notifications)
- React Router v7

### Backend
- Node.js, Express 5, TypeScript
- Prisma ORM (database access)
- MQTT.js (broker client)
- Socket.IO (WebSocket server)
- Nodemailer (email alerts)
- Zod (request validation)
- Helmet, CORS, Morgan

### Database
- PostgreSQL

### Messaging / Realtime
- MQTT broker (any standard broker, e.g. HiveMQ, Mosquitto)
- Socket.IO

---

## Architecture

```
Frontend (React)
      │
      │  REST API (CRUD)           Socket.IO (realtime push)
      │◄────────────────────────────────────────────────────┐
      ▼                                                     │
 Express API                                               │
  Controller → Service → Repository → PostgreSQL           │
                                                           │
IoT Device / MQTT Simulator                                │
      │                                                    │
      │  MQTT heartbeat                                    │
      ▼                                                    │
 MQTT Broker                                              │
      │                                                    │
      ▼                                                    │
 MQTT Service (validates payload, updates lastSeenAt)──────┤
      │                                                    │
 Monitoring Service (background interval)──────────────────┘
  → detects offline devices
  → triggers email alerts
  → emits Socket.IO events
```

**Backend layer responsibilities:**
- **Controller** — parses and validates HTTP requests, delegates to service
- **Service** — business logic: duplicate checks, MQTT lifecycle, AppError throwing
- **Repository** — all Prisma/database queries
- **MQTT Service** — broker connection, topic subscriptions, heartbeat processing
- **Monitoring Service** — periodic offline detection loop
- **Alert Service** — Nodemailer email dispatch with `alertSent` deduplication
- **Socket Service** — broadcasts `device:updated` events to connected clients

---

## Project Structure

```
Clairco Device Monitor/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/          # env.ts, database.ts
│       ├── constants/       # http-status.ts, messages.ts
│       ├── enums/           # device-status.enum.ts
│       ├── errors/          # app.error.ts
│       ├── middleware/      # error.middleware.ts, not-found.middleware.ts
│       ├── modules/
│       │   ├── alert/       # Nodemailer email alerts
│       │   ├── device/      # CRUD — controller, service, repository, schema, routes
│       │   ├── monitoring/  # Background offline detection loop
│       │   ├── mqtt/        # Broker client, topic subscriptions, heartbeat handling
│       │   └── socket/      # Socket.IO server and event emission
│       ├── scripts/
│       │   └── mqtt-publisher.ts   # Development MQTT simulator
│       ├── app.ts
│       └── server.ts
├── frontend/
│   └── src/
│       ├── components/      # UI components (DeviceCard, DeviceForm, layout, dashboard)
│       ├── hooks/           # useDevices, useCreateDevice, useDeviceSocket, etc.
│       ├── pages/           # Dashboard.tsx, Devices.tsx
│       ├── schemas/         # Zod validation schemas
│       ├── services/        # Axios API client, Socket.IO connection
│       ├── types/           # TypeScript types derived from Zod schemas
│       └── lib/             # Utilities (error message extraction)
└── README.md
```

---

## Prerequisites

- **Node.js** v18 or later
- **npm**
- **PostgreSQL** — a running instance with a database created
- **MQTT broker** — a running MQTT broker accessible by the backend.
  For local development, Mosquitto can be used at `mqtt://localhost:1883`.
- **SMTP server** — for email alerts (e.g. Gmail with an App Password)

---

## Environment Variables

Create `backend/.env` with the following variables:

```env
# Server
PORT=5000

# Database
DATABASE_URL=<your-postgresql-connection-string>

# MQTT Broker
MQTT_BROKER_URL=<your-mqtt-broker-url>      # e.g. mqtts://broker.example.com:8883
MQTT_USERNAME=<your-mqtt-username>
MQTT_PASSWORD=<your-mqtt-password>

# Email Alerts (SMTP / Nodemailer)
SMTP_HOST=<your-smtp-host>
SMTP_PORT=<587-or-465>
SMTP_USER=<your-smtp-username>
SMTP_PASSWORD=<your-smtp-password>
SMTP_FROM=<sender-email-address>

# Monitoring interval (optional, default: 5000ms)
MONITORING_INTERVAL_MS=5000

# MQTT Simulator (optional, defaults shown)
API_URL=http://localhost:5000/api
MQTT_TEST_INTERVAL_MS=10000
MQTT_DEVICE_REFRESH_INTERVAL_MS=10000
```

---

## Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd "Clairco Device Monitor"

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

---

## Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Apply migrations to your PostgreSQL database
npx prisma migrate deploy
```

> The `DATABASE_URL` in `backend/.env` must point to a valid PostgreSQL database before running these commands.

---

## Running the Application

### Backend

```bash
cd backend
npm run dev
```

The API server starts on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm run dev
```

The dashboard is available at `http://localhost:5173`.

### MQTT Simulator (development / demo)

```bash
cd backend
npm run mqtt:test
```

The simulator is a **development utility only** — it does not create database records. It:

- calls `GET /api/devices` to discover registered devices
- publishes a `{"deviceId": "..."}` heartbeat to each device's MQTT topic
- refreshes the device list every `MQTT_DEVICE_REFRESH_INTERVAL_MS` milliseconds, so newly registered devices are picked up automatically
- stops publishing for devices that are deleted
- uses a single persistent MQTT connection
- shuts down cleanly on `Ctrl+C`

---

## Demo / Testing Flow

1. Start PostgreSQL and your MQTT broker.
2. Start the backend: `npm run dev` (inside `backend/`).
3. Start the frontend: `npm run dev` (inside `frontend/`).
4. Open `http://localhost:5173/devices` and create a device:
   - **Device ID**: `AC-001`
   - **MQTT Topic**: `devices/AC-001/data`
   - **Expected Interval**: `30` (seconds)
   - **Alert Email**: your email address
5. Start the MQTT simulator: `npm run mqtt:test` (inside `backend/`).
6. Watch the device status change to **ONLINE** on the dashboard in real time.
7. Stop the simulator (`Ctrl+C`).
8. Wait ~30 seconds (the configured interval).
9. The device status changes to **OFFLINE** automatically.
10. Check the configured alert email — an offline notification should arrive.
11. Start the simulator again — the device returns to **ONLINE**.
12. Create a second device from the UI — the simulator discovers and starts publishing for it within the next refresh cycle (default 10 seconds), **without restarting the backend**.

---

## Offline Detection

Each device stores:
- `lastSeenAt` — timestamp of the most recent MQTT heartbeat
- `expectedInterval` — the maximum allowed silence period (in seconds), configured per device

A background monitoring loop runs every `MONITORING_INTERVAL_MS` (default 5 seconds). For each device, it calculates:

```
elapsed = (now - lastSeenAt) / 1000
isOffline = elapsed > expectedInterval
```

When a device is offline, the loop updates its status to `OFFLINE` in the database and emits a Socket.IO event to update the dashboard. If the device was previously online and `alertSent` is `false`, an email alert is dispatched and `alertSent` is set to `true`.

---

## Email Alerts

- Each device has a dedicated `alertEmail` field set at registration time.
- When offline detection fires, **one email** is sent to that address using Nodemailer.
- The `alertSent` boolean prevents repeated notifications while the device remains offline.
- `alertSent` is reset to `false` when the next heartbeat arrives and the device is marked `ONLINE` again.

---

## Realtime Updates

Socket.IO is used exclusively for **server-to-client** state change broadcasts. When either the MQTT service (heartbeat received → ONLINE) or the monitoring loop (interval exceeded → OFFLINE) updates a device, it emits a `device:updated` event. The frontend `useDeviceSocket` hook listens for this event and patches the TanStack Query cache in place — the dashboard updates instantly without polling or page refresh.

---

## Key Technical Decisions

| Decision | Reason |
|---|---|
| **Controller → Service → Repository** | Keeps HTTP parsing, business logic, and database access independently testable and maintainable |
| **MQTT for device communication** | Industry-standard IoT protocol; lightweight and broker-decoupled |
| **`expectedInterval` per device** | Different device types have different check-in rates; a global timeout would cause false alarms |
| **`lastSeenAt` timestamp** | Mathematical proof of the last transmission; works with devices that connect-publish-disconnect aggressively |
| **`alertSent` flag** | Prevents a flood of repeated emails while a device stays offline |
| **Socket.IO for realtime updates** | Avoids unnecessary API polling; the backend pushes only when state actually changes |
| **Dynamic MQTT subscriptions** | New devices are monitored immediately; no backend restart required |
| **Zod validation on both sides** | Backend is the authoritative security boundary; frontend uses the same rules for instant UX feedback |
| **Separate MQTT simulator** | Keeps the production backend clean; enables full end-to-end testing without physical hardware |
| **`{ message, data }` API response shape** | Backend is the source of truth for user-facing messages; frontend reads `response.message` directly into Sonner toasts |

---

## Error Handling

- **API validation** — Zod parses all request bodies; invalid input returns `400` with field-level error details
- **Centralized error middleware** — `AppError` instances return the configured status code; unexpected errors return `500`
- **MQTT errors** — connection errors and malformed payloads are logged; the `mqtt` library handles automatic reconnection
- **Email failures** — Nodemailer errors are caught and logged; `alertSent` is not set to `true` if the send fails, so the next monitoring tick will retry

---

## Limitations / Future Improvements

**Current implementation:**
- No authentication or authorization on the API
- Monitoring loop queries the full device table on every tick
- No historical uptime/downtime records — only current status is stored
- MQTT broker must be configured and accessible externally

**Potential future improvements:**
- JWT-based API authentication
- Distributed monitoring workers (e.g. BullMQ) for large device fleets
- Time-series storage for historical uptime metrics
- Structured logging (e.g. Pino)
- Docker Compose setup for easier local environment configuration

---

## Assignment Notes

This project was built as a technical assignment for the Fullstack Developer role at Clairco.
