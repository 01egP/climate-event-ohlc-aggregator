import { errorHandler } from './errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('errorHandler middleware', () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    headersSent: false
  } as unknown as Response;
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore?.();
    (console.warn as jest.Mock).mockRestore?.();
    jest.clearAllMocks();
  });

  it('should return 500 for generic errors', () => {
    const error = new Error('Something went wrong');
    errorHandler(error, mockReq, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Internal server error'
    });
  });

  it('should return 503 for timeout errors', () => {
    const timeoutError = new Error('Request timed out') as any;
    const timeoutReq = { ...mockReq, timedout: true } as any;

    errorHandler(timeoutError, timeoutReq, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(503);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Request timed out' });
  });

  it('should call next if headers already sent', () => {
    const error = new Error('already sent');
    const resWithHeadersSent = { ...mockRes, headersSent: true };

    errorHandler(error, mockReq, resWithHeadersSent as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
