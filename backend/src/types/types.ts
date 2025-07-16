import { Request } from 'express';

export interface TimeoutRequest extends Request {
  timedout: boolean;
}

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

export type OHLCData = Record<string, Record<string, Candle>>;

export interface WeatherEvent {
  city: string;
  timestamp: string;
  temperature: number;
}