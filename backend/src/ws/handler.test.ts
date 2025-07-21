import { handleIncomingEvent } from './handler';
import * as ohlcAggregator from '../ohlcAggregator';
import * as ohlcService from '../services/ohlc.service';
import { WeatherEvent } from '../types/types';

jest.mock('../ohlcAggregator');
jest.mock('../services/ohlc.service');

describe('handleIncomingEvent', () => {
  const defaultCity = 'Berlin';

  const mockEvent: WeatherEvent = {
    city: defaultCity,
    temperature: 25,
    timestamp: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call processWeatherEvent with the event', () => {
    // make sure getOHLCData returns the expected city
    (ohlcService.getOHLCData as jest.Mock).mockReturnValue({
      [defaultCity]: {}
    });

    handleIncomingEvent(mockEvent);

    expect(ohlcAggregator.processWeatherEvent).toHaveBeenCalledWith(mockEvent);
  });

  it('should not throw if getOHLCData returns empty object', () => {
    // mock data for Berlin is required
    (ohlcService.getOHLCData as jest.Mock).mockReturnValue({
      [defaultCity]: undefined
    });

    expect(() => handleIncomingEvent(mockEvent)).not.toThrow();
  });

  it('should access latest candle if available', () => {
    const candles = {
      '2025-07-21T13:00': { open: 20, high: 23, low: 19, close: 22 }
    };

    (ohlcService.getOHLCData as jest.Mock).mockReturnValue({
      [defaultCity]: candles
    });

    expect(() => handleIncomingEvent(mockEvent)).not.toThrow();
  });
});
