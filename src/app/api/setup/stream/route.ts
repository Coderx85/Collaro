import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";
import tryCatch from "@/lib/try-catch-wrapper";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY || process.env.STREAM_API_SECRET;

export async function POST() {
  try {
    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      return NextResponse.json(
        { error: "Stream API key or secret is missing" },
        { status: 500 }
      );
    }

    const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

    // Create custom roles for workspace members
    const roles = ["owner", "admin", "member"] as const;
    for (const role of roles) {
      await tryCatch({
        ctx: async () => {
          const roleData = await streamClient.listRoles();
          if (roleData.roles.some(r => r.name === role)) {
            console.log(`Role "${role}" already exists.`);
            return;
          }
          await streamClient.createRole({ name: role });
          console.log(`Role "${role}" created successfully.`);
        },
        errorMessage: `Error ensuring role "${role}" exists: `,
      });
    }

    // Create or update call types with proper permissions
    const callTypes = ["team", "private"] as const;
    
    // Basic permissions that all roles should have
    const baseGrants = {
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
      owner: [
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
        "remove-call-member",
      ],
      member: [
        "create-call",
        "join-call",
        "read-call",
        "send-audio",
        "send-video",
        "screenshare",
        "end-call",
        "update-call",
      ],
    };

    for (const callType of callTypes) {
      await tryCatch({
        ctx: async () => {
          const callTypeData = await streamClient.video.listCallTypes();
          const existingCallType = Object.values(callTypeData.call_types).find(
            (ct) => ct.name === callType
          );

          if (existingCallType) {
            await streamClient.video.updateCallType({
              name: callType,
              grants: baseGrants,
            });
            console.log(`Call type "${callType}" updated with proper permissions.`);
          } else {
            await streamClient.video.createCallType({
              name: callType,
              grants: baseGrants,
            });
            console.log(`Call type "${callType}" created successfully.`);
          }
        },
        errorMessage: `Error setting up call type "${callType}": `,
      });
    }

    return NextResponse.json(
      { message: "Stream permissions initialized successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error initializing Stream permissions:", error);
    return NextResponse.json(
      { error: "Failed to initialize Stream permissions" },
      { status: 500 }
    );
  }
}
