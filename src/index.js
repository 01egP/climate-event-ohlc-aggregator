const express = require('express');
const { startWebSocketClient } = require('./ws-client');
const { processWeatherEvent, getOHLCData } = require('./ohlcAggregator');

const app = express();
const PORT = 3000;

//Handles each incoming weather event and updates OHLC data.
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
 *
 * Authentication:
 * Expect an Authorization header (e.g., Bearer token).
 * Example:
 *   const token = req.headers.authorization?.split(' ')[1];
 *
 * Authorization:
 * Decode the token and check admin-level access.
 * Example:
 *   const user = jwt.verify(token, secret);
 *   if (!user.roles.includes('admin')) {
 *     return res.status(403).json({ error: 'Forbidden' });
 *   }
 */
app.get('/ohlc', (req, res) => {
  res.json(getOHLCData());
});

/**
 * GET /ohlc/:city
 * Returns OHLC data for a specific city
 *
 * Authentication:
 * Expect an Authorization header (e.g., Bearer token).
 * Example:
 *   const token = req.headers.authorization?.split(' ')[1];
 *
 * Authorization:
 * Decode the token to extract user identity and scopes.
 * Example:
 *   const user = jwt.verify(token, secret);
 *   const scopes = user?.scopes || [];
 *
 * Role-based Access Control:
 * Ensure the user is allowed to access this city's data.
 * Example:
 *   if (!scopes.includes('read:weather') || !user.allowedCities.includes(req.params.city)) {
 *     return res.status(403).json({ error: 'Forbidden' });
 *   }
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
