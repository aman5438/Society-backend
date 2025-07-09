import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  role: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
