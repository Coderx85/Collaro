import { redirect } from "next/navigation";
import WorkspaceForm from "./components/WorkspaceForm";
import { getUserWorkspaceId, setUser } from "@/action";
// import { setWorkspaceFromDB } from "@/action/workspace.action";

const WorkspacePage = async () => {
  // First try to get workspace id from user data
  const data = await getUserWorkspaceId();
  console.log("User workspace data:", data.success);
  if (data.data && data.data.workspaceId) {
    const workspaceId = data.data.workspaceId;
    redirect(`/workspace/${workspaceId}`);
  }

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