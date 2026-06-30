import { notFound } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { getMeetingDetails, getMeetingParticipants } from "@/action";
import { MeetingDetails } from "@/components/workspace/meeting/MeetingDetails";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface MeetingWithWorkspace {
  workspace?: {
    slug: string;
  };
  [key: string]: unknown;
}

const MeetingPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const meetingRes = await getMeetingDetails(id as any);
  if (!meetingRes.success) {
    notFound();
  }

  const meeting = meetingRes.data as unknown as MeetingWithWorkspace;
  const workspaceSlug = meeting.workspace?.slug || "";

  const participantsRes = await getMeetingParticipants(id as any);

  return (
    <MeetingDetails
      meeting={meetingRes.data}
      participants={participantsRes.success ? participantsRes.data.participant : []}
      workspaceSlug={workspaceSlug}
      displayFont={displayFont.className}
    />
  );
};

export default MeetingPage;