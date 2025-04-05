import TeamCall from "@/components/TeamCall";
import { notFound } from "next/navigation";
import MemberList from "@/components/MemberList";

interface PageProps {
  params: {
    workspaceId: string;
  };
}

export default async function MembersPage({ params }: PageProps) {
  const { workspaceId } = await params;

  if (!workspaceId) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Workspace Members</h1>
      <p className="text-muted-foreground">Call workspace members directly</p>
      <TeamCall />
      <MemberList />
    </div>
  );
}
