import { UserType } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userType: UserType;
      };
    }
  }
}
