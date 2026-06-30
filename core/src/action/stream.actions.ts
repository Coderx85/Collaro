"use server";

import { StreamClient } from "@stream-io/node-sdk";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth-server";
import { IMemberDTO, IUserDTO, IWorkspaceDTO, TUserId, TUserRole } from "@/types";
import tryCatch from "@/lib/try-catch-wrapper";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

if (!STREAM_API_KEY) throw new Error("Stream API key is missing");
if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

/**
 * Generates a Stream token for the authenticated user.
 * @returns A promise that resolves to a Stream token string.
 * @throws An error if the user is not authenticated or if token generation fails.
 */
export const tokenProvider = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) throw new Error("User is not authenticated");

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;
  const token = streamClient.generateUserToken({
    user_id: session.user.id,
    exp: expirationTime,
    iat: issuedAt,
  });

  return token;
};

type TUpdateStreamUserInput = {
  member: IMemberDTO,
  workspace: IWorkspaceDTO
}

// Map application-level roles to Stream call-level roles
const roleToCallRole: Record<IMemberDTO["role"], string> = {
  owner: "admin",
  admin: "moderator",
  member: "user",
};

/**
 * Updates the user's role in Stream based on their role in the workspace.
 * @param input An object containing the user, member, and workspace information.
 * @returns A promise that resolves when the user's role has been updated in Stream.
 * @throws An error if the user is not authenticated or if the update operation fails.
 */
export async function updateStreamUser(input: TUpdateStreamUserInput) {
  if (!STREAM_API_KEY) throw new Error("Stream API key is missing");
  if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

  tryCatch({
    ctx: async () => {
      await streamClient.updateUsers({
        users: {
          [String(input.member.userId)]: {
            id: String(input.member.userId),
            name: input.member.name,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(input.member.name)}&background=random`,
            role: input.member.role,
            teams: [input.workspace.slug],
          },
        },
      });
    }
  })
}