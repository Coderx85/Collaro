import { redirect } from "next/navigation";
import WorkspaceForm from './components/WorkspaceForm';
import { getUserWorkspaceId } from "@/action";
const WorkspacePage = async () => {
  const data = await getUserWorkspaceId();
  if(data.data && data.data?.workspaceId) {
    const workspaceId = data.data.workspaceId
    redirect(`/workspace/${workspaceId}`)
  };

  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center rounded-sm">
      <WorkspaceForm />
    </div>
  );
};

export default WorkspacePage;
