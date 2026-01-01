import { useEffect, useState } from "react";
import {
  getParticipantRole,
  type ParticipantRole,
} from "@/action/participant.action";
import type { StreamVideoParticipant } from "@stream-io/video-react-sdk";
import { TWorkspaceMember, TWorkspaceUser } from "@/types";

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
  workspaceSlug: string
): Data => {
  const [roleData, setRoleData] = useState<Data>({
    role: "member",
    userName: participant.name || participant.userId,
    name: participant.name || participant.userId,
    userId: participant.userId,
    email: "",
    isLoading: true,
  });

  useEffect(() => {
    const fetchRole = async () => {
      // Step 1: Check if role is already in custom data (fastest)
      try {
        const fetchRole = await getParticipantRole(
          participant.userId,
          workspaceSlug
        );
      } catch (error) {
        console.error("Error fetching participant role:", error);
        setRoleData({
          role: "member",
          userName: participant.name || participant.userId,
          name: participant.name || participant.userId,
          email: "",
          isLoading: false,
          userId: participant.userId,
        });
      }
    };

    fetchRole();
  }, [participant.userId, participant.custom, participant.name]);

  return roleData;
};
