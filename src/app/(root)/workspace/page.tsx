import { redirect } from "next/navigation";
import WorkspaceForm from './[workspaceId]/_components/WorkspaceForm';
import { getUserWorkspaceId } from "@/actions/user.actions";
const WorkspacePage = async () => {
  const data = await getUserWorkspaceId();
  if(data.data?.workspaceId) {
    redirect(`/workspace/${data.data.workspaceId}`)
  };

  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center rounded-sm">
      <WorkspaceForm />
    </div>
  );
};

export default WorkspacePage;
