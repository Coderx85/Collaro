import { redirect } from "next/navigation";
import WorkspaceForm from "./components/WorkspaceForm";
import { getUserWorkspaceId, setUser } from "@/action";
// import { setWorkspaceFromDB } from "@/action/workspace.action";

const WorkspacePage = async () => {
  // First try to get workspace id from user data
  const data = await getUserWorkspaceId();
  if (data.data && data.data.workspaceId) {
    const workspaceId = data.data.workspaceId;
    redirect(`/workspace/${workspaceId}`);
  }

  // // New: Attempt to fetch workspace details directly from DB
  // const workspaceData = await setWorkspaceFromDB();
  // if (workspaceData && workspaceData.data) {
  //   redirect(`/workspace/${workspaceData.data?.id}`);
  // }

  const user = await setUser();       
  if (!user.success) {
    redirect("/sign-in");
  }

  return (
    <div className='mx-auto flex h-full flex-col items-center justify-center rounded-sm'>
      <WorkspaceForm />
    </div>
  );
};

export default WorkspacePage;