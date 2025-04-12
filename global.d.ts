export {};
import { UserRoleType } from "@/types/database";

interface UserPublicMetadata {
  role?: UserRoleType;
}

declare global {
  declare namespace Clerk {
    interface User {
      publicMetadata: UserPublicMetadata;
    }
  }

  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
