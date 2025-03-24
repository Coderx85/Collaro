interface UserPublicMetadata {
  role?: string;
}

declare namespace Clerk {
  interface User {
    publicMetadata: UserPublicMetadata;
  }
}