"use server";
import { db } from "@/db/client";
import { workspacesTable, workspaceMeetingTable } from "@/db/schema/schema";

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
