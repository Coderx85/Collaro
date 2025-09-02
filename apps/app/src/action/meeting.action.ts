"use server";
import { db, workspacesTable, workspaceMeetingTable } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createMeetingDB(
  workspaceId: string,
  {
    name,
    description,
    startAt,
    meetingId,
  }: {
    name: string;
    description: string;
    startAt: string;
    meetingId: string;
  },
) {
  try {
    // Check if user exists
    const user = await currentUser();
    if (!user) redirect("sign-in");

    const username = user?.username;

    // Check if workspace exists
    const res = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, workspaceId))
      .execute();

    if (res.length !== 0)
      return { message: "Workspace not found", status: 404 };

    const meeting = await db
      .insert(workspaceMeetingTable)
      .values({
        workspaceId,
        workspacName: res[0].name,
        title: name,
        hostedBy: username || "",
        description,
        startAt: new Date(startAt),
        meetingId,
        endAt: new Date(startAt),
      })
      .returning();

    if (!meeting || meeting.length === 0)
      return { message: "Failed to create meeting", status: 500 };

    console.log(`Meeting created: ${meeting}`);
    return { meeting };
  } catch (error: unknown) {
    console.log(error);
    return { message: `Failed to operate function \n`, status: 500 };
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