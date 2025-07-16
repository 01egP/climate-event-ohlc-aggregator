import WebSocket from 'ws';
import { WeatherEvent } from './types/types';

const WS_URL = 'ws://localhost:8765';

/**
 * Connects to the WebSocket server and listens for events.
 * @param onEvent Callback to handle incoming weather events.
 */
export function startWebSocketClient(onEvent: (event: WeatherEvent) => void): void {
  const ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    console.log(`Connected to ${WS_URL}`);
  });

  ws.on('message', (data: WebSocket.RawData) => {
    try {
      const event: WeatherEvent = JSON.parse(data.toString());
      onEvent(event);
    } catch (err) {
      console.error('Failed to parse message:', (err as Error).message);
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', (err as Error).message);
  });

  ws.on('close', () => {
    console.warn('Connection closed');
  });
}
