import { IMemberDTO, IWorkspaceDTO, TCreateMeetingAuthResponse, TMeetingId, TUserId } from "@/types";
import { IMeetingDTO } from "../meeting";
import { IStreamContext, StreamClientConfig } from "./interface";
import tryCatch from "@/lib/try-catch-wrapper";
import { Call, GetOrCreateCallRequest, JoinCallResponse, StreamVideoClient } from "@stream-io/video-react-sdk";
import { updateStreamUser } from "@/action";

type TMeetingType = "personal" | "team";

const meetingTypeMap: Record<string, TMeetingType> = {
  personal: "personal",
  team: "team"
};
  
// Map application-level roles to Stream call-level roles
const roleToCallRole: Record<IMemberDTO["role"], string> = {
  owner: "admin",
  admin: "moderator",
  member: "user",
};

type TSreamMemberDTO = {
  user_id: string;
  role: string;
  custom: {
    memberId: string;
    name: string;
  }
}

type TCallData = GetOrCreateCallRequest & { 
  data: {
    team: string;
    custom: {
      title: string;
      agenda: string;
      workspaceName: string;
      workspaceId: string;
    },
    starts_at: string,
    members: TSreamMemberDTO[]
  }
};

type TJoinCallData = {}

type TPersonalCallData = GetOrCreateCallRequest & {
  data: {
    custom: {
      title: string;
      agenda: string;
    },
    starts_at: string,
  }
};

const DEFAULT_CALL_SETTINGS = {
  ring: true,
  video: true,
}

type TCreateTeamMeetingInput = TCreateMeetingAuthResponse

type TJoinTeamMeetingInput = {
  id: TMeetingId;
  data: {
    callerDetail: IMemberDTO;
    workspace: IWorkspaceDTO;
  }
}

export class StreamClient implements IStreamContext {
  private client: StreamVideoClient;

  private static instance: StreamClient;

  public static getInstance(): StreamClient {
    if (!StreamClient.instance) {
      throw new Error("StreamClient is not initialized. Please initialize it before using the initialize method.");
    }
    return StreamClient.instance;
  }

  public static initialize(config: StreamClientConfig): StreamVideoClient {
    if (!StreamClient.instance) {
      StreamClient.instance = new StreamClient(config);
    } else {
      StreamClient.instance.initialize(config);
    }
    return StreamClient.instance.client;
  }

  private constructor(config: StreamClientConfig) {
    this.client = this.initialize(config);
  }

  private initialize(config: StreamClientConfig){
    const client = StreamVideoClient.getOrCreateInstance({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY || "",
      tokenProvider: config.tokenProvider,
      user: {
        id: String(config.user.id),
        name: config.user.name,
        image: config.user.userName,
        custom: {
          email: config.user.email,
          userName: config.user.userName,
          createdAt: config.user.createdAt.toISOString(),
        },
        invisible: false,
        type: 'authenticated'
      }
    })

    this.client = client;

    return client;
  }

  createPersonalMeeting(input: IMeetingDTO<TUserId>): void {
    const call = this.client.call(meetingTypeMap["personal"], String(input.id));
    
    call.getOrCreate({

    })
  }

  async createTeamMeeting(input: TCreateTeamMeetingInput): Promise<Call> {
    return tryCatch({
      ctx: async () => {
        const call = await this.client.call(meetingTypeMap["team"], String(input.id), {
          reuseInstance: true,
        });
    
        await updateStreamUser({
          member: input.hostData,
          workspace: input.workspace,
        })

        const data: TCallData = {
          data: {
            channel_cid: `ch_${input.workspace.name}`,
            team: input.workspace.slug,
            starts_at: input.startTime.toISOString(),
            custom: {
              workspaceId: String(input.workspace.id),
              workspaceName: input.workspace.name,
              agenda: input.description,
              title: input.title
            },
            members: [{
              custom: {
                memberId: String(input.hostData.id),
                name: input.workspace.name,
              },
              role: roleToCallRole[input.hostData.role] || "user",
              user_id: String(input.hostData.userId),
            }]
          },
          ...DEFAULT_CALL_SETTINGS,
        }

        const res = await call.getOrCreate(data);
        if (!res) {
          throw new Error("Failed to create the meeting.", {
            cause: "No response from getOrCreate call method"
          });
        }

        return call;
      },

      errorMessage: "Failed to create or get the call instance for team meeting",
    })
  }

  async joinTeamMeeting(input: TJoinTeamMeetingInput): Promise<JoinCallResponse> {
    return tryCatch({
      ctx: async () => {
        const call = await this.client
          .call(meetingTypeMap["team"], String(input.id))
          .doJoinRequest({
            create: false,
            data: {
              team: input.data.workspace.slug,
              channel_cid: `ch_${input.data.workspace.slug}`,
              members: [
                {
                  user_id: String(input.data.callerDetail.userId),
                  role: roleToCallRole[input.data.callerDetail.role] || "user",
                  custom: {
                    memberId: String(input.data.callerDetail.id),
                    name: input.data.callerDetail.name,
                  }
                },
              ]
            }
          });

        return call;
      },
      errorMessage: "Failed to join the team meeting",
    })
  }
}