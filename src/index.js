const express = require('express');
const { startWebSocketClient } = require('./ws-client');
const { processWeatherEvent, getOHLCData } = require('./ohlcAggregator');

const app = express();
const PORT = 3000;

/**
 * Handles each incoming weather event and updates OHLC data.
 */
function handleIncomingEvent(event) {
  processWeatherEvent(event);

  const ohlc = getOHLCData();
  const city = event.city;

  if (ohlc[city]) {
    const candles = ohlc[city];
    const latestHour = Object.keys(candles).sort().pop();

    if (latestHour) {
      console.log(`${city} ${latestHour}:`, candles[latestHour]);
    }
  }
}

/**
 * GET /ohlc
 * Returns all aggregated OHLC data
 */
app.get('/ohlc', (req, res) => {
  res.json(getOHLCData());
});

/**
 * Exposes OHLC data for a specific city via REST API.
 */
app.get('/ohlc/:city', (req, res) => {
  const city = req.params.city;
  const data = getOHLCData();

  if (!data[city]) {
    return res.status(404).json({ error: `No data found for city "${city}"` });
  }

  res.json(data[city]);
});

app.listen(PORT, () => {
  console.log(`📡 OHLC API available at http://localhost:${PORT}`);
});

// Start receiving WebSocket events
startWebSocketClient(handleIncomingEvent);
