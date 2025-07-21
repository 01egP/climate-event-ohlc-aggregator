import WebSocket from 'ws';
import { startWebSocketClient } from './client';
import { WeatherEvent } from '../types/types';

jest.mock('ws');

describe('startWebSocketClient', () => {
  let wsInstance: jest.Mocked<WebSocket>;

  beforeEach(() => {
    // Cast to jest.MockingClass
    const WebSocketMock = WebSocket as jest.MockedClass<typeof WebSocket>;

    wsInstance = {
      on: jest.fn().mockReturnThis()
    } as unknown as jest.Mocked<WebSocket>;

    WebSocketMock.mockImplementation(() => wsInstance);
  });

  it('should connect and listen to events', () => {
    const mockHandler = jest.fn();

    startWebSocketClient(mockHandler);

    expect(WebSocket).toHaveBeenCalledWith('ws://localhost:8765');
    expect(wsInstance.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(wsInstance.on).toHaveBeenCalledWith('message', expect.any(Function));
    expect(wsInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(wsInstance.on).toHaveBeenCalledWith('close', expect.any(Function));
  });

  it('should call handler with parsed weather event', () => {
    const mockHandler = jest.fn();
    const mockEvent: WeatherEvent = {
      city: 'Tokyo',
      temperature: 23,
      timestamp: new Date().toISOString()
    };

    let messageCallback: ((data: WebSocket.RawData) => void) | undefined;

    wsInstance.on.mockImplementation((event, cb) => {
      if (event === 'message') {
        messageCallback = cb as (data: WebSocket.RawData) => void;
      }
      return wsInstance;
    });

    startWebSocketClient(mockHandler);

    messageCallback?.(Buffer.from(JSON.stringify(mockEvent)));

    expect(mockHandler).toHaveBeenCalledWith(mockEvent);
  });
});
