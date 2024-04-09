import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (new RegExp('/signin|signup').test(req.baseUrl)) {
      next();
    } else {
      const token = req.cookies?.jwt;
      if (!token) return res.redirect('/signin');

      const verfiedUser = await this.authService.verifyToken(token);

      if (!verfiedUser) return res.redirect('/signin');

      next();
    }
  }
}
