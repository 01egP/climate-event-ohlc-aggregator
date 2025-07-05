const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/ohlc.json');

/**
 * Loads OHLC data from disk if it exists.
 * @returns {Object} Parsed OHLC data or empty object.
 */
function loadOHLCFromFile() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to read OHLC data from file:', err.message);
    }
  }
  return {};
}

/**
 * Persists OHLC data to disk.
 * @param {Object} data - Aggregated OHLC data
 */
function saveOHLCToFile(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write OHLC data to file:', err.message);
  }
}

module.exports = {
  loadOHLCFromFile,
  saveOHLCToFile
};
