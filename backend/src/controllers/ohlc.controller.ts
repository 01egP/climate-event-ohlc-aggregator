import { Request, Response } from 'express';
import { getOHLCData } from '../services/ohlc.service';

export const getAllOhlc = (req: Request, res: Response) => {
  const data = getOHLCData();
  res.json(data);
};

export const getCityOhlc = (req: Request, res: Response) => {
  const city = req.params.city;
  const data = getOHLCData();

  if (!data[city]) {
    return res.status(404).json({ error: `No data for city "${city}"` });
  }
  console.log(`[API] Returning OHLC for city: ${city}`);
  res.json(data[city]);
};
