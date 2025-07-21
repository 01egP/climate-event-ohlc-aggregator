import { loadOHLCFromFile, saveOHLCToFile } from '../utils/fileStorage';
import { WeatherEvent, OHLCData } from './types/types';

// In-memory OHLC data store
const ohlcData: OHLCData = loadOHLCFromFile();

/**
 * Floors ISO timestamp to the nearest hour (00 minutes, 00 seconds).
 */
function getHourTimestamp(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  date.setMinutes(0, 0, 0);
  return date.toISOString();
}

/**
 * Processes an incoming weather event and updates the OHLC data.
 */
export function processWeatherEvent({
  city,
  timestamp,
  temperature
}: WeatherEvent): void {
  const hour = getHourTimestamp(timestamp);

  if (!ohlcData[city]) {
    ohlcData[city] = {};
  }

  const cityData = ohlcData[city];

  if (!cityData[hour]) {
    cityData[hour] = {
      open: temperature,
      high: temperature,
      low: temperature,
      close: temperature
    };
  } else {
    const candle = cityData[hour];
    candle.high = Math.max(candle.high, temperature);
    candle.low = Math.min(candle.low, temperature);
    candle.close = temperature;
  }

  saveOHLCToFile(ohlcData);
}

/**
 * Returns the current OHLC data.
 */
export function getOHLCData(): OHLCData {
  return ohlcData;
}
