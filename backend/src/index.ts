import app from './app';
import { startWebSocketClient } from './ws/client';
import { handleIncomingEvent } from './ws/handler';

const PORT = process.env.PORT || 3000;

/** Start WebSocket listener **/
startWebSocketClient(handleIncomingEvent);

/** Graceful error handling **/
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
  process.exit(1);
});

/** Start HTTP server **/
app.listen(PORT, () => {
  console.log(`📡 OHLC API is available at http://localhost:${PORT}`);
});
