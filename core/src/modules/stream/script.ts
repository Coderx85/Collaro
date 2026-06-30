import { StreamClient } from "@stream-io/node-sdk";
import { IMemberDTO } from "@/types";
import tryCatch from "@/lib/try-catch-wrapper";
import { MeetingType } from "../meeting";

export type TStreamClientParams = ConstructorParameters<typeof StreamClient>;

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || "STREAM_API_KEY_NOT_SET";
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY || process.env.STREAM_API_SECRET;

const config: TStreamClientParams = [STREAM_API_KEY, STREAM_API_SECRET!];

const streamClient = new StreamClient(...config);

type TRoles = IMemberDTO["role"];
const roles: TRoles[] = ["owner", "admin", "member"];

for (const role of roles) {
  tryCatch({
    ctx: async () => {
      const roleData = await streamClient.listRoles();
      if (roleData.roles.some(r => r.name === role)) {
        console.log(`Role "${role}" already exists.`);
        return;
      }
      await streamClient.createRole({ name: role });  
      console.log(`Role "${role}" created successfully.`);
    },
    errorMessage: "Error ensuring role exists: ",
  });

}

type TCallType = (keyof typeof MeetingType)[]

const callTypes: TCallType = ["team", "private"];

// Creating call types for team and private meetings
tryCatch({
  ctx: async () => {
    // Check if the call type already exists
    const callTypeData = await streamClient.video.listCallTypes();

    const value = Object.values(callTypeData.call_types)

    for (const callType of callTypes) {
      const existingCallType = value.find(ct => ct.name === callType);
      
      const grants = {
        user: [
          "create-call",
          "join-call",
          "read-call",
          "send-audio",
          "send-video",
          "screenshare",
          "end-call",
          "update-call",
        ],
        moderator: [
          "create-call",
          "join-call",
          "read-call",
          "send-audio",
          "send-video",
          "screenshare",
          "end-call",
          "update-call",
          "mute-users",
          "remove-call-member",
        ],
        admin: [
          "create-call",
          "join-call",
          "read-call",
          "send-audio",
          "send-video",
          "screenshare",
          "end-call",
          "update-call",
          "update-call-settings",
          "update-call-permissions",
          "mute-users",
        ],
      };

      if (existingCallType) {
        // Update existing call type with proper permissions
        await streamClient.video.updateCallType({
          name: callType,
          grants
        });
        console.log(`Call type "${callType}" updated with proper permissions.`);
      } else {
        // Create new call type with permissions
        await streamClient.video.createCallType({
          name: callType,
          grants,
        });
        console.log(`Call type "${callType}" created successfully.`);
      }
    }
  }
})