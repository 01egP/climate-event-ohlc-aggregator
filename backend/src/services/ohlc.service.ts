import { getOHLCData as rawGetOHLCData } from '../ohlcAggregator';
import { OHLCData } from '../types/types';

export const getOHLCData = (): OHLCData => {
  return rawGetOHLCData();
};
