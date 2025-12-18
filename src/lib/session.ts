import "server-only";

/**
 * Session Management
 * This file provides compatibility with the old session interface
 * but now delegates to better-auth's session management
 */

export { verifySession, getCurrentUser, getSession } from "./dal";

// Re-export the Session type
export type { Session } from "./dal";
