import express, { Request, Response } from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import timeout from 'connect-timeout';
import dotenv from 'dotenv';

import ohlcRoutes from './routes/ohlc.routes';
import { errorHandler } from './middlewares/errorHandler';
import { timeoutHandler } from './middlewares/timeoutHandler';
import { startWebSocketClient } from './ws/client';
import { handleIncomingEvent } from './ws/handler';
import { TimeoutRequest } from './types/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

/** Test-only endpoint for timeout simulation **/
app.get(
  '/test-timeout',
  timeout('5s'),
  async (req: TimeoutRequest, res: Response) => {
    if (req.timedout) return;

    await new Promise((resolve) => setTimeout(resolve, 6000));

    if (!req.timedout) {
      res.json({ message: 'still alive' });
    }
  }
);

/** Routes **/
app.use('/ohlc', ohlcRoutes);

/** Global timeout middleware (after routes) **/
app.use(timeout('10s'));

/** Timeout-aware handler **/
app.use(timeoutHandler);

/** Global error handler **/
app.use(errorHandler);

/** Graceful error handling **/
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
  process.exit(1);
});

/** Start WebSocket listener **/
startWebSocketClient(handleIncomingEvent);

/** Start HTTP server **/
app.listen(PORT, () => {
  console.log(`📡 OHLC API is available at http://localhost:${PORT}`);
});
