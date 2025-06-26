import { Router, Request, Response } from 'express';
import { SignupService } from '../application/SignupService';
import { SigninService } from '../application/SigninService';
import { SignupInput } from '../dto/SignupInput';
import { SigninInput } from '../dto/SigninInput';

export function AuthController(
  signupService: SignupService,
  signinService: SigninService
): Router {
  const router = Router();

  router.post('/signup', async (req: Request, res: Response) => {
    try {
      const input: SignupInput = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      const output = await signupService.execute(input);
      res.status(201).json(output);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already in use') {
        res.status(400).json({ error: 'Email already in use' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  router.post('/signin', async (req: Request, res: Response) => {
    try {
      const input: SigninInput = {
        email: req.body.email,
        password: req.body.password,
      };

      const output = await signinService.execute(input);
      res.status(200).json(output);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ error: 'Invalid credentials' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  return router;
} 