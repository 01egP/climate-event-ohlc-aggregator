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
├── backend/                 # Node.js + Express server
│   ├── src/
│   │   ├── index.js         # Main server entry point
│   │   ├── ws-client.js     # Connects to climate event WebSocket
│   │   └── ohlcAggregator.js# OHLC aggregation logic
│   ├── scripts/
│   │   └── simulator.js     # (Optional) Simulates weather events for testing
│   ├── data/                # File-based OHLC storage (ignored by Git)
│   ├── package.json
│   ├── .eslint.config.js    # ESLint config (Flat config)
│   └── .prettierrc          # Prettier config
├── frontend/                # React frontend with Plotly.js
│   ├── public/
│   ├── src/
│   │   ├── App.js           # Main UI
│   │   └── utils/mock.js    # Generates mock OHLC data
│   ├── package.json
│   ├── .prettierrc          # Prettier config
└── README.md
```

---

## 🔧 Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```env
DATA_MODE=real     # use to real weather API (requires API_KEY)
# DATA_MODE=mock       # switch mock data (no API key needed)
API_KEY=your_api_key  # Required if using the real weather API (e.g., WeatherAPI.com)
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
- City toggle and mock mode behave as expected
- Candlestick and table render correctly for all cities
- File-based persistence works across restarts

---

## 🔐 AuthN & AuthZ (Outlined in Code Only)

- `Authorization` headers shown in comments
- Role-based access (admin / city-specific) explained
- No implementation for brevity, but extendable

---

## 📦 Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** React, Plotly.js
- **Other:** WebSocket, File persistence, Prettier, ESLint

---

## 📁 Notes

- All data is stored in `/backend/data/ohlc.json` (excluded via `.gitignore`)
- Backend and frontend code format enforced with Prettier

---

## ✅ Ready for Review

All core functionality implemented. Ready for evaluation.
