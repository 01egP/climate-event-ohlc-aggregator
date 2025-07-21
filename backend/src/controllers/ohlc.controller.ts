import { Request, Response } from 'express';
import { getOHLCData } from '../services/ohlc.service';

/**
 * GET /ohlc
 * Returns all aggregated OHLC data
 *
 * Authentication:
 * Expect an Authorization header (e.g., Bearer token).
 * Example:
 *   const token = req.headers.authorization?.split(' ')[1];
 *
 * Authorization:
 * Decode the token and check admin-level access.
 * Example:
 *   const user = jwt.verify(token, secret);
 *   if (!user.roles.includes('admin')) {
 *     return res.status(403).json({ error: 'Forbidden' });
 *   }
 */

export const getAllOhlc = (req: Request, res: Response) => {
  const data = getOHLCData();
  res.json(data);
};

/**
 * GET /ohlc/:city
 * Returns OHLC data for a specific city
 *
 * Authentication:
 * Expect an Authorization header (e.g., Bearer token).
 * Example:
 *   const token = req.headers.authorization?.split(' ')[1];
 *
 * Authorization:
 * Decode the token to extract user identity and scopes.
 * Example:
 *   const user = jwt.verify(token, secret);
 *   const scopes = user?.scopes || [];
 *
 * Role-based Access Control:
 * Ensure the user is allowed to access this city's data.
 * Example:
 *   if (!scopes.includes('read:weather') || !user.allowedCities.includes(req.params.city)) {
 *     return res.status(403).json({ error: 'Forbidden' });
 *   }
 */

export const getCityOhlc = (req: Request, res: Response) => {
  const city = req.params.city;
  const data = getOHLCData();

  if (!data[city]) {
    return res.status(404).json({ error: `No data for city "${city}"` });
  }
  console.log(`[API] Returning OHLC for city: ${city}`);
  res.json(data[city]);
};
