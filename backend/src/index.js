const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const timeout = require('connect-timeout');
const { startWebSocketClient } = require('./ws-client');
const { processWeatherEvent, getOHLCData } = require('./ohlcAggregator');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000;

/** Middleware **/

// Logs all HTTP requests in common Apache format
app.use(morgan('combined'));

// Apply rate limiting only in production
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests. Please try again later.',
    skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1' // exclude localhost
  });

  app.use('/ohlc', limiter); // applies also to /ohlc/:city
}

// Define test route BEFORE global timeout middleware
app.get('/test-timeout', timeout('5s'), async (req, res) => {
  if (req.timedout) return;

  // Simulate long processing
  await new Promise((resolve) => setTimeout(resolve, 6000));

  if (!req.timedout) {
    res.json({ message: 'still alive' });
  }
});

// Apply global timeout to all routes after this point
app.use(timeout('10s'));

/** WebSocket Event Handler **/

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

/** Routes **/

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

/** Timeout-aware middleware **/
app.use((req, res, next) => {
  if (req.timedout) {
    console.warn(`[WARN] Timeout on: ${req.originalUrl}`);
    if (!res.headersSent) {
      res.status(503).json({ error: 'Request timed out' });
    }
  } else {
    next();
  }
});

/** Error handling middleware **/
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);

  if (req.timedout) {
    console.warn(`[WARN] Timeout on: ${req.originalUrl}`);

    // If the request has timed out, we should not send a response
    // because the client has already stopped waiting.
    // However, we can log the error.
    if (!res.headersSent) {
      res.status(503).json({ error: 'Request timed out' });
    }

    return;
  }

  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    next(err);
  }
});

/** Graceful error handling **/

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1); // Exit the process to avoid inconsistent state
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
  process.exit(1); // Exit to prevent silent failures
});

/** Start server **/

app.listen(PORT, () => {
  console.log(`📡 OHLC API is available at http://localhost:${PORT}`);
});

// Start WebSocket stream processing
startWebSocketClient(handleIncomingEvent);
