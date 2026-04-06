import { TMeetingId, TParticipantId, TWorkspaceId } from "@collaro/meeting";
import { TMemberId } from "@collaro/member";
import { TUserId } from "@collaro/user";
import { v7 } from "uuid";

function generateId<T>(prefix: string): T {
  const createdAt = new Date().getTime();
  const str = v7({ msecs: createdAt });

  const result = `${prefix || ""}${str}`.slice(0, 32);
  return result as unknown as T;
}

export class ID {
  static userId(): TUserId {
    const prefix = "usr_";
    const id = generateId<TUserId>(prefix);
    return id;
  }

  static workspaceId(): TWorkspaceId {
    const prefix = "wks_";
    const id = generateId<TWorkspaceId>(prefix);
    return id;
  }

  static memberId(): TMemberId {
    const prefix = "mbr_";
    const id = generateId<TMemberId>(prefix);
    return id;
  }

  static meetingId(): TMeetingId {
    const prefix = "mtg_";
    const id = generateId<TMeetingId>(prefix);
    return id;
  }
  
  static participantId(): TParticipantId {
    const prefix = "prt_";
    const id = generateId<TParticipantId>(prefix);
    return id;
  }
}

export function generateWorkspaceSlug(input: string): string {
  return input.toLowerCase().replace(/\s+/g, '-');
}

export function generateUserName(input: string): string {
  return input.toLowerCase().replace(/\s+/g, '');
}
