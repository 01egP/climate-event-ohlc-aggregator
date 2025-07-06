# OHLC Weather Viewer (Frontend)

This is the frontend React application for viewing OHLC (Open, High, Low, Close) weather data aggregated in real-time.

## 🚀 Getting Started

### Installation

```
npm install
```

### Development

```
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).  
Make sure the backend is also running and available at `http://localhost:3000`.

### Production Build

```
npm run build
```

Builds the app for production to the `build/` directory.

## 🧩 Project Structure

- `src/` – React components and main app logic
- `public/` – Static assets
- `README.md` – This file

## 🔗 Backend API

Make sure your backend is running on port `3000` or configure accordingly.

Available endpoints:

- `GET /ohlc` – All cities' OHLC data
- `GET /ohlc/:city` – OHLC data for a specific city

## 📝 Notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
