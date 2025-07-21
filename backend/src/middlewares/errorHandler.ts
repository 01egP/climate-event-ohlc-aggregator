import { Response, NextFunction } from 'express';
import { TimeoutRequest } from '../types/types';

export const errorHandler = (
  err: any,
  req: TimeoutRequest,
  res: Response,
  next: NextFunction
) => {
  console.error('[ERROR]', err);

  if (req.timedout || err?.timeout) {
    console.warn(`[WARN] Timeout on: ${req.originalUrl}`);
    if (!res.headersSent) {
      return res.status(503).json({ error: 'Request timed out' });
    }
    return;
  }

  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    next(err);
  }
};
