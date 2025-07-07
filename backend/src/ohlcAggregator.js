const { loadOHLCFromFile, saveOHLCToFile } = require('../utils/fileStorage');
const ohlcData = loadOHLCFromFile();

// Floors ISO timestamp to the nearest hour
function getHourTimestamp(isoTimestamp) {
  const date = new Date(isoTimestamp);
  date.setMinutes(0, 0, 0);
  return date.toISOString();
}

// Handles incoming weather event and updates OHLC data
function processWeatherEvent({ city, timestamp, temperature }) {
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

function getOHLCData() {
  return ohlcData;
}

module.exports = {
  processWeatherEvent,
  getOHLCData
};
