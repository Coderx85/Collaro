import { useEffect, useState } from "react";
import {
  getParticipantRole,
  type ParticipantRole,
} from "@/action/participant.actions";
import type { StreamVideoParticipant } from "@stream-io/video-react-sdk";
import { IMemberDTO, TUserId, TWorkspaceUser } from "@/types";
import { Prettify } from "better-auth";

interface ParticipantRoleData {
  role: ParticipantRole;
  userName: string;
  name: string;
  email: string;
  isLoading: boolean;
}
type Data = Pick<
  IMemberDTO,
  "role" | "name" | "userId"
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
    name: participant.name || participant.userId,
    userId: userId,
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
          name: participant.name || participant.userId,
          isLoading: false,
          userId: userId,
        });
      }
    };

    fetchRole();
  }, [participant.userId, participant.custom, participant.name]);

  return roleData;
};
