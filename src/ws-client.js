const WebSocket = require('ws');

const WS_URL = 'ws://localhost:8765';

/**
 * Connects to the WebSocket server and listens for events.
 * @param {(event: { city: string, timestamp: string, temperature: number }) => void} onEvent
 */
function startWebSocketClient(onEvent) {
  const ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    console.log(`✅ Connected to ${WS_URL}`);
  });

  ws.on('message', (data) => {
    try {
      const event = JSON.parse(data);
      if (onEvent) {
        onEvent(event);
      }
    } catch (err) {
      console.error('Failed to parse message:', err.message);
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });

  ws.on('close', () => {
    console.warn('Connection closed');
  });
}

module.exports = { startWebSocketClient };
