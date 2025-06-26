import { Response, NextFunction } from 'express';
import { AuthMiddleware, AuthenticatedRequest } from '../../api/AuthMiddleware';
import { FakeJwtGenerator } from '../fakes/FakeJwtGenerator';

describe('AuthMiddleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jwtGenerator: FakeJwtGenerator;
  let authMiddleware: AuthMiddleware;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jwtGenerator = new FakeJwtGenerator();
    authMiddleware = new AuthMiddleware(jwtGenerator);
  });

  it('returns 401 when no authorization header is provided', () => {
    authMiddleware.authenticate(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Authorization header required' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('returns 401 when authorization header does not start with Bearer', () => {
    mockRequest.headers = { authorization: 'InvalidToken' };

    authMiddleware.authenticate(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid authorization format' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', () => {
    mockRequest.headers = { authorization: 'Bearer invalid-token' };

    authMiddleware.authenticate(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('adds user context to request and calls next when token is valid', () => {
    const userPayload = { userId: 'user-123', email: 'test@example.com' };
    const validToken = jwtGenerator.generate(userPayload);
    mockRequest.headers = { authorization: `Bearer ${validToken}` };

    authMiddleware.authenticate(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

    expect(mockRequest.user).toEqual(userPayload);
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
}); 