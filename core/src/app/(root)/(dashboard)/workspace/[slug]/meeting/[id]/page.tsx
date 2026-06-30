import { notFound } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { getMeetingDetails, getMeetingParticipants } from "@/action";
import { MeetingDetails } from "@/components/workspace/meeting/MeetingDetails";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const MeetingDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) => {
  const { slug, id } = await params;

  const meetingRes = await getMeetingDetails(id as any);
  if (!meetingRes.success) {
    notFound();
  }

  const participantsRes = await getMeetingParticipants(id as any);

  return (
    <MeetingDetails
      meeting={meetingRes.data}
      participants={participantsRes.success ? participantsRes.data.participant : []}
      workspaceSlug={slug}
      displayFont={displayFont.className}
    />
  );
};

export default MeetingDetailsPage;
