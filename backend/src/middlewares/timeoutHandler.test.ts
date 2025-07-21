import { timeoutHandler } from './timeoutHandler';
import { Request, Response, NextFunction } from 'express';

describe('timeoutHandler middleware', () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    headersSent: false
  } as unknown as Response;
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.warn as jest.Mock).mockRestore?.();
  });

  it('should return 503 if request is timed out and headers are not sent', () => {
    const req = { timedout: true, originalUrl: '/test' } as Request;

    timeoutHandler(req, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(503);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Request timed out' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should do nothing if headers were already sent', () => {
    const req = { timedout: true, originalUrl: '/test' } as Request;
    const res = { ...mockRes, headersSent: true };

    timeoutHandler(req, res as Response, next);

    expect(mockRes.status).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if request is not timed out', () => {
    const req = { timedout: false } as Request;

    timeoutHandler(req, mockRes, next);

    expect(next).toHaveBeenCalled();
  });
});
