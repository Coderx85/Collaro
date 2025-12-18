import "server-only";

import { getCurrentUser } from "./dal";

/**
 * Data Transfer Objects (DTOs) for controlling what data is exposed
 * Only return necessary, safe data from user objects
 */

// Publicly safe user DTO
export type PublicUserDTO = {
  id: string;
  name: string;
  userName: string | null | undefined;
  createdAt: Date;
};

// Private user DTO for authenticated users
export type PrivateUserDTO = {
  id: string;
  name: string;
  email: string;
  userName: string | null | undefined;
  createdAt: Date;
};

// User type from better-auth
type UserType = {
  id: string;
  name: string;
  email: string;
  userName?: string | null;
  createdAt: Date;
};

/**
 * Get public user profile (safe for exposure to anyone)
 */
export async function getPublicUserDTO(user: UserType): Promise<PublicUserDTO> {
  return {
    id: user.id,
    name: user.name,
    userName: user.userName,
    createdAt: user.createdAt,
  };
}

/**
 * Get private user profile (for authenticated users only)
 * Always verify session before calling this
 */
export async function getPrivateUserDTO(
  user: UserType,
): Promise<PrivateUserDTO> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    userName: user.userName,
    createdAt: user.createdAt,
  };
}

/**
 * Get current authenticated user as DTO
 */
export async function getCurrentUserDTO(): Promise<PrivateUserDTO | null> {
  try {
    const user = await getCurrentUser();
    return await getPrivateUserDTO(user);
  } catch {
    return null;
  }
}
