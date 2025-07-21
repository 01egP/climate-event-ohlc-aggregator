import { processWeatherEvent, getOHLCData } from '../ohlcAggregator';
import { WeatherEvent } from '../types/types';

export function handleIncomingEvent(event: WeatherEvent): void {
  processWeatherEvent(event);

  if (process.env.NODE_ENV !== 'production') {
    const ohlc = getOHLCData();
    const city = event.city;

    if (ohlc[city]) {
      const candles = ohlc[city];
      const latestHour = Object.keys(candles).sort().pop();

      if (latestHour) {
        console.log(`[DEBUG] ${city} ${latestHour}:`, candles[latestHour]);
      }
    }
  }
}
