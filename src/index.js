const { startWebSocketClient } = require('./ws-client');
const { processWeatherEvent, getOHLCData } = require('./ohlcAggregator');

/**
 * Handles each incoming weather event and updates OHLC data.
 */
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

startWebSocketClient(handleIncomingEvent);
