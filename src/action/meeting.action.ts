"use server";
import { db } from "@/db/client";
import {
  workspacesTable,
  workspaceMeetingTable,
  membersTable,
} from "@/db/schema/schema";
import { APIResponse, Call } from "@/types";
import { eq, and } from "drizzle-orm";

export async function getCallsBySlug(
  slug: string
): Promise<APIResponse<Call[]>> {
  try {
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.slug, slug))
      .execute();

    if (!workspace) {
      return {
        error: `Workspace with slug ${slug} not found`,
        success: false,
      };
    }

    const meeting = await db
      .select()
      .from(workspaceMeetingTable)
      .where(eq(workspaceMeetingTable.workspaceId, workspace.id))
      .execute();

    if (!meeting)
      return {
        error: `No meeting found for workspace with slug ${slug}`,
        success: false,
      };

    return {
      data: meeting,
      success: true,
    };
  } catch (error: unknown) {
    return { success: false, error: `Failed to get call by slug: ${error}` };
  }
}

export async function getMeetingsData() {
  try {
    const [meetingData] = await db
      .select()
      .from(workspaceMeetingTable)
      .execute();
    if (!meetingData) return { message: "No meetings found", status: 404 };
    console.log(`Meetings found: ${meetingData}`);
    return { meetingData };
  } catch (error: unknown) {
    console.log(error);
    return { message: `Failed to operate function \n`, status: 500 };
  }
}

// export async function addMemberToMeeting() {
//   try {
//     await db.insert(workspaceMeetingTable)
//     .values(
//       workspaceMeetingTable.
//     )
//   } catch (error: unknown) {
//     return { message: `Failed to join meeting \n ${error}`, status: 500 }
//   }
// }

// Hi, I'm a full stack web developer and a top contributor in open contributions at Tublian. I have worked with NextJS, MERN, Razorpay and zustand.

// I have completed two internships in web development.

// I see a job for a Frontend developer and am interested in the position.
// Could you please refer me.
