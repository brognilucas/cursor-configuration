import { Request, Response, NextFunction, RequestHandler } from 'express';

export interface FakeUser {
  userId: string;
  email?: string;
}

export function fakeAuth(user: FakeUser = { userId: 'test-user' }): RequestHandler {
  return (req: Request & { user?: FakeUser }, _res: Response, next: NextFunction) => {
    req.user = user;
    next();
  };
} 