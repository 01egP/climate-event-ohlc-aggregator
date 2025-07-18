# 🌡 Climate Event OHLC Aggregator

This repository contains a real-time system that connects to a climate WebSocket event stream, aggregates temperature data into hourly OHLC (Open, High, Low, Close) format, and exposes it via a local API. The UI visualizes this data using candlestick charts and a table.

---

## ✨ Features

### Backend
- Connects to a local or remote WebSocket server streaming temperature data
- Aggregates data per city in OHLC format per hour
- Persists aggregated OHLC data to disk (`/data`)
- REST API to access:
  - All OHLC data: `GET /ohlc`
  - City-specific data: `GET /ohlc/:city`
- Middleware:
  - Request rate limiting with `express-rate-limit`
  - Request timeout using `connect-timeout`
  - Logging HTTP requests via `morgan`
- Optional event simulator for testing
- Authentication & Authorization points shown in code comments

### Frontend
- React UI with Plotly.js candlestick chart
- City selector and toggle between real and mock data
- Side-by-side chart and table view of OHLC data
- Graceful error handling and responsive layout

---

## 🏗 Project Structure

```
climate-event-ohlc-aggregator/
├── backend/                # Node.js + Express backend
│   ├── data/               # File-based OHLC storage (gitignored)    
│   ├── src/    
│   │   ├── scripts/        # Script to simulate weather events for development/testing
│   │   │   └── weather-simulator.ts    
│   │   ├── types/types.ts  # Shared domain models (WeatherEvent, OHLCData, etc.)
│   │   ├── index.ts        # Main server entry point       
│   │   ├── ws-client.ts    # WebSocket client for incoming weather data
│   │   └── ohlcAggregator.ts # Aggregates weather data into OHLC format    
│   ├── utils/fileStorage.ts  # Handles reading/writing OHLC data to disk              
│   ├── package.json
│   ├── tsconfig.json       # TypeScript config
│   ├── .eslint.config.js   # ESLint config (Flat config)
│   └── .prettierrc          
├── frontend/               # React frontend with Plotly.js charts
│   ├── public/
│   ├── src/
│   │   ├── App.tsx         # Main UI component 
│   │   ├── index.tsx       # React entry point
│   │   ├── App.test.tsx    # Unit + integration tests for main UI behavior 
│   │   ├── react-app-env.d.ts # React global types 
│   │   ├── setupTests.ts   # Test setup with Jest + react-testing-library 
│   │   └── utils/mock.ts   # Generates mock OHLC data for demo mode
│   ├── tsconfig.json       # TypeScript config
│   ├── package.json
│   └── .prettierrc          
└── README.md
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
- **Other:** WebSocket, File persistence, Prettier, ESLint, Jest

---

## 📁 Notes

- All data is stored in `/backend/data/ohlc.json` (excluded via `.gitignore`)
- Backend and frontend use TypeScript in strict mode
- Prettier is used for consistent code formatting
- Unit tests are written with React Testing Library and Jest

---

## ⚖️ Trade-offs & Scaling Ideas (for Discussion)

- Aggregation is performed in-memory per city per hour for speed and simplicity.
- In a production environment, consider:
  - Moving state to Redis or a persistent DB
  - Using queues (Kafka, SQS) to buffer WebSocket events
  - Sharding cities across workers for scalability
  - Eviction strategies to avoid unbounded memory growth

---

## ✅ Ready for Review

All core functionality implemented. Ready for evaluation.