import { Request, Response, NextFunction } from 'express';
import { JwtGenerator } from '../application/JwtGenerator';

export interface AuthenticatedRequest extends Request {
  user?: object;
}

export class AuthMiddleware {
  constructor(private readonly jwtGenerator: JwtGenerator) {}

  authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header required' });
      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid authorization format' });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const payload = this.jwtGenerator.verify(token);
      req.user = payload;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
} 