import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import timeout from 'connect-timeout';
import dotenv from 'dotenv';
import { startWebSocketClient } from './ws-client';
import { processWeatherEvent, getOHLCData } from './ohlcAggregator';
import { WeatherEvent, OHLCData, TimeoutRequest } from './types/types';

dotenv.config();

const app = express();
const PORT = 3000;

/** Middleware **/
app.use(morgan('combined'));

if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests. Please try again later.',
    skip: (req: Request) => req.ip === '::1' || req.ip === '127.0.0.1'
  });

  app.use('/ohlc', limiter);
}

app.get('/test-timeout', timeout('5s'), async (req: TimeoutRequest, res: Response) => {
  if (req.timedout) return;

  await new Promise((resolve) => setTimeout(resolve, 6000));

  if (!req.timedout) {
    res.json({ message: 'still alive' });
  }
});

app.use(timeout('10s'));

/** WebSocket Event Handler **/

function handleIncomingEvent(event: WeatherEvent) {
  processWeatherEvent(event);

  const ohlc = getOHLCData();
  const city = event.city;

  if (ohlc[city]) {
    const candles = ohlc[city];
    const latestHour = Object.keys(candles).sort().pop();

    if (latestHour) {
      // console.log(`${city} ${latestHour}:`, candles[latestHour]);
    }
  }
}

/** Routes **/

app.get('/ohlc', (req: Request, res: Response) => {
  const data: OHLCData = getOHLCData();
  res.json(data);
});

app.get('/ohlc/:city', (req: Request, res: Response) => {
  const city = req.params.city;
  const data: OHLCData = getOHLCData();

  if (!data[city]) {
    return res.status(404).json({ error: `No data found for city "${city}"` });
  }

  res.json(data[city]);
});

/** Timeout-aware middleware **/
app.use((req: TimeoutRequest, res: Response, next: NextFunction) => {
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
app.use((err: Error, req: TimeoutRequest, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err);

  if (req.timedout) {
    console.warn(`[WARN] Timeout on: ${req.originalUrl}`);
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
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
  process.exit(1);
});

/** Start server **/
app.listen(PORT, () => {
  console.log(`📡 OHLC API is available at http://localhost:${PORT}`);
});

startWebSocketClient(handleIncomingEvent);
