import * as fs from 'fs';
import * as path from 'path';
import { OHLCData } from '../src/types/types';

const DATA_FILE = path.join(__dirname, '../data/ohlc.json');

/**
 * Loads OHLC data from disk if it exists.
 * @returns Parsed OHLC data or empty object.
 */
export function loadOHLCFromFile(): OHLCData {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw) as OHLCData;
    } catch (err) {
      console.error(
        'Failed to read OHLC data from file:',
        (err as Error).message
      );
    }
  }
  return {};
}

/**
 * Persists OHLC data to disk.
 * @param data Aggregated OHLC data
 */
export function saveOHLCToFile(data: OHLCData): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write OHLC data to file:', (err as Error).message);
  }
}
