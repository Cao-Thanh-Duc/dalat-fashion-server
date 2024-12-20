import { Users } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare module 'express' {
  export interface Request {
    user?: Users;
  }
}
