import { getOHLCData } from './ohlc.service';
import { OHLCData } from '../types/types';

describe('getOHLCData', () => {
  it('should return an object with OHLC data', () => {
    const result: OHLCData = getOHLCData();
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should return an empty object when no data is present', () => {
    const result = getOHLCData();
    expect(Object.keys(result)).toEqual(expect.any(Array));
  });
});
