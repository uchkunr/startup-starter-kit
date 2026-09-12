import type { AuthJwtPayload } from "../lib/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
    }
  }
}
