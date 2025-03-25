import { currentUser } from "@clerk/nextjs/server";
import { validateWorkspaceAccess } from "@/action";
import MemberList from "@/components/MemberList";

export default async function MembersPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await currentUser();
  const userId: string = user?.id || "";
  const { workspaceId } = await params;

  // Validate workspace access
  await validateWorkspaceAccess(userId, workspaceId);

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold'>Workspace Members</h1>
        <p className='text-muted-foreground'>Call workspace members directly</p>
      </div>

      <MemberList />
    </div>
  );
}
