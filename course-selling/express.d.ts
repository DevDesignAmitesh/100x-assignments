import type { TokenPayload } from "./types";

declare global {
  namespace Express {
    interface Request {
      user: TokenPayload;
    }
  }
}
