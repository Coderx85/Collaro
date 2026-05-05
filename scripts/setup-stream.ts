import { StreamClient } from "@stream-io/node-sdk";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables manually
function loadEnv() {
  const envPaths = [".env.local", ".env.development", ".env"];
  for (const path of envPaths) {
    try {
      const content = readFileSync(join(process.cwd(), path), "utf-8");
      const lines = content.split("\n");
      for (const line of lines) {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          process.env[key] = value;
        }
      }
    } catch (e) {
      // File doesn't exist
    }
  }
}

loadEnv();

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY || process.env.STREAM_API_SECRET;

if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  console.error("Missing Stream API key or secret");
  process.exit(1);
}

const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

async function setupStream() {
  try {
    // Create custom roles for workspace members
    const roles = ["owner", "admin", "member"] as const;
    for (const role of roles) {
      try {
        const roleData = await streamClient.listRoles();
        if (roleData.roles.some(r => r.name === role)) {
          console.log(`Role "${role}" already exists.`);
        } else {
          await streamClient.createRole({ name: role });
          console.log(`Role "${role}" created successfully.`);
        }
      } catch (error: any) {
        console.error(`Error ensuring role "${role}" exists:`, error.message);
      }
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
      try {
        const callTypeData = await streamClient.video.listCallTypes();
        const existingCallType = Object.values(callTypeData.call_types).find(
          (ct: any) => ct.name === callType
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
      } catch (error: any) {
        console.error(`Error setting up call type "${callType}":`, error.message);
      }
    }

    console.log("Stream permissions initialized successfully!");
  } catch (error: any) {
    console.error("Error initializing Stream permissions:", error.message);
    process.exit(1);
  }
}

setupStream();
