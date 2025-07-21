import { Request, Response, NextFunction } from 'express';
import { TimeoutRequest } from '../types/types';

export const timeoutHandler = (
  req: Request | TimeoutRequest,
  res: Response,
  next: NextFunction
) => {
  if ('timedout' in req && req.timedout) {
    console.warn(`[WARN] Timeout on: ${req.originalUrl}`);
    if (!res.headersSent) {
      return res.status(503).json({ error: 'Request timed out' });
    }
  }
  next();
};
