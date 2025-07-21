# 🌡 Climate Event OHLC Aggregator

This repository contains a real-time system that connects to a climate WebSocket event stream, aggregates temperature data into hourly OHLC (Open, High, Low, Close) format, and exposes it via a local API. The UI visualizes this data using candlestick charts and a table.

---

## ✨ Features

### Backend
- Connects to a WebSocket server streaming temperature data
- Aggregates data per city in OHLC format per hour
- Persists aggregated OHLC data to disk (`/data`)
- REST API:
  - `GET /ohlc` - all cities
  - `GET /ohlc/:city` - specific city
- Middleware:
  - Rate limiting (`express-rate-limit`)
  - Timeout handling (`connect-timeout`)
  - Logging (`morgan`)
- Graceful error handling
- Optional event simulator for development

### Frontend
- React UI with Plotly.js candlestick chart
- City selector and toggle between real and mock data
- Side-by-side chart and table view of OHLC data
- Graceful error handling and responsive layout

---

## 🏗 Project Structure

```
climate-event-ohlc-aggregator/
├── backend/                     # Node.js + Express backend
│   ├── data/                    # File-based OHLC storage
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── e2e/                 # Supertest integration tests
│   │   ├── middlewares/        # Error and timeout handlers
│   │   ├── routes/             # Express route definitions
│   │   ├── scripts/            # Event simulator
│   │   ├── services/           # OHLC service logic
│   │   ├── types/              # TypeScript type definitions
│   │   ├── ws/                 # WebSocket client & handler
│   │   ├── app.ts              # Express app instance
│   │   └── index.ts            # Server bootstrap
│   ├── utils/                  # File storage logic
│   └── test configs            # Jest, TS config
├── frontend/                   # React frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── utils/              # Mock data generator
│   │   ├── types/              # Type declarations
│   │   └── components & tests  # Main UI & tests
└── README.md
```

---

## 🧪 Test Coverage

### Unit Tests
- `src/services/ohlc.service.test.ts`
- `src/controllers/ohlc.controller.test.ts`
- `src/middlewares/errorHandler.test.ts`
- `src/middlewares/timeoutHandler.test.ts`
- `src/ws/handler.test.ts`
- `src/ws/client.test.ts`

### Integration Tests
- `src/e2e/ohlc.e2e.test.ts` (REST API with Supertest)

### Frontend Tests
- `frontend/src/App.test.tsx` (React component behavior)

Run all tests:
```bash
npm run test
```

---

## 🔧 Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```env
NODE_ENV=development     # use 'production' for live deployment
DATA_MODE=real           # use real weather API (requires API_KEY)
# DATA_MODE=mock         # use mock data (no API key needed)
API_KEY=your_api_key     # Required if using the real weather API (e.g., WeatherAPI.com)
```

> 📝 **Note:** Due to frequent downtime from the Open-Meteo API, the app was updated to use an alternative provider. Make sure to provide a valid API key to access real-time weather data.

---

## 🚀 Getting Started

### Backend

```bash
cd backend
npm install
npm start
```

> Starts the Express server on `http://localhost:3000` and connects to the WebSocket stream.

To simulate WebSocket events run in the `backend/` directory:
```bash
npm run simulate
```

### Frontend

```bash
cd frontend
npm install
npm start
```

> Starts the React app on `http://localhost:3001` and connects to the backend API.

---

## 🧪 Manual Verification

- WebSocket stream processed at 10–20 events/sec
- OHLC data aggregates correctly
- City selection and mock mode behave as expected (covered by unit tests)
- Candlestick and table render correctly for all cities
- File-based persistence works across restarts

---

## 🔐 AuthN & AuthZ (Outlined in Code Only)

- `Authorization` headers shown in comments
- Role-based access (admin / city-specific) explained
- No implementation for brevity, but extendable to support secure access via JWT, scopes, and RBAC

---

## 📦 Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Frontend:** React, TypeScript, Plotly.js
- **Testing:** Jest, Supertest, React Testing Library
- **Other:** WebSockets, File storage, Prettier, ESLint

---

## 📁 Notes

- All data is stored in `/backend/data/ohlc.json` (excluded via `.gitignore`)
- Backend and frontend use TypeScript in strict mode
- Prettier is used for consistent code formatting
- Unit and integration tests are written using Jest, Supertest, and React Testing Library

---

## ⚖️ Trade-offs & Scaling Ideas (for Discussion)

- Aggregation is performed in-memory per city per hour for speed and simplicity.
- In a production environment, consider:
  - Moving state to Redis or a persistent DB
  - Using queues (Kafka, SQS) to buffer WebSocket events
  - Sharding cities across workers for scalability
  - Eviction strategies to avoid unbounded memory growth

