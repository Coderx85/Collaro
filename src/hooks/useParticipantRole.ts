import { useEffect, useState } from "react";
import {
  getParticipantRole,
  type ParticipantRole,
} from "@/action/participant.actions";
import type { StreamVideoParticipant } from "@stream-io/video-react-sdk";
import { IMemberDTO, TUserId } from "@/types";

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
      try {
        const res = await getParticipantRole(userId, workspaceSlug);
        if (!res.success || !res.data) {
          throw new Error("Role not found");
        }
        setRoleData({
          role: res.data.role as ParticipantRole,
          name: participant.name || participant.userId,
          userId: userId,
          isLoading: false,
        });
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
