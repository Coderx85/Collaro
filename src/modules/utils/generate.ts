import { TMeetingId, TParticipantId, TWorkspaceId } from "@collaro/meeting";
import { TMemberId } from "@collaro/member";
import { TUserId } from "@collaro/user";
import { v7 } from "uuid";

function generateId<T>(): T {
  const createdAt = new Date().getTime();
  const str = v7({ msecs: createdAt });
  return str as unknown as T;
}

export class ID {
  static userId(): TUserId {
    const prefix = "usr_";
    const id = generateId<TUserId>();
    const result = `${prefix}${id}`.slice(0, 32);
    return result as unknown as TUserId;
  }

  static workspaceId(): TWorkspaceId {
    const prefix = "wks_";
    const id = generateId<TWorkspaceId>();
    const result = `${prefix}${id}`.slice(0, 32);
    return result as unknown as TWorkspaceId;
  }

  static memberId(): TMemberId {
    const prefix = "mbr_";
    const id = generateId<TMemberId>();
    const result = `${prefix}${id}`.slice(0, 32);
    return result as unknown as TMemberId;
  }

  static meetingId(): TMeetingId {
    const prefix = "mtg_";
    const id = generateId<TMeetingId>();
    const result = `${prefix}${id}`.slice(0, 32);
    return result as unknown as TMeetingId;
  }
  
  static participantId(): TParticipantId {
    const prefix = "prt_";
    const id = generateId<TParticipantId>();
    const result = `${prefix}${id}`.slice(0, 32);
    return result as unknown as TParticipantId;
  }
}

export function generateWorkspaceSlug(input: string): string {
  return input.toLowerCase().replace(/\s+/g, '-');
}

export function generateUserName(input: string): string {
  return input.toLowerCase().replace(/\s+/g, '');
}
