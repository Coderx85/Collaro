import { useEffect, useState } from "react";
import {
  getParticipantRole,
  type ParticipantRole,
} from "@/action/participant.actions";
import type { StreamVideoParticipant } from "@stream-io/video-react-sdk";
import { TUserId, TWorkspaceMember, TWorkspaceUser } from "@/types";
import { Prettify } from "better-auth";

interface ParticipantRoleData {
  role: ParticipantRole;
  userName: string;
  name: string;
  email: string;
  isLoading: boolean;
}
type Data = Pick<
  TWorkspaceMember,
  "role" | "userName" | "name" | "email" | "userId"
> & {
  isLoading: boolean;
};

/**
 * Custom hook to get participant role with hybrid approach:
 * 1. First check if role is in participant custom data (passed during join)
 * 2. If not available, fetch from database
 * 3. Cache the result to avoid repeated lookups
 */
export const useParticipantRole = (
  participant: StreamVideoParticipant,
  workspaceSlug: string,
): Data => {
  const userId = participant.userId as unknown as TUserId;
  const [roleData, setRoleData] = useState<Data>({
    role: "member",
    userName: participant.name || participant.userId,
    name: participant.name || participant.userId,
    userId: userId,
    email: "",
    isLoading: true,
  });

  useEffect(() => {
    const fetchRole = async () => {
      // Step 1: Check if role is already in custom data (fastest)
      try {
        const fetchRole = await getParticipantRole(userId, workspaceSlug);
      } catch (error) {
        console.error("Error fetching participant role:", error);
        setRoleData({
          role: "member",
          userName: participant.name || participant.userId,
          name: participant.name || participant.userId,
          email: "",
          isLoading: false,
          userId: userId,
        });
      }
    };

    fetchRole();
  }, [participant.userId, participant.custom, participant.name]);

  return roleData;
};
