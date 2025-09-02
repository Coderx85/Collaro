import { redirect } from "next/navigation";
import WorkspaceForm from "./components/WorkspaceForm";
import { getUserWorkspaceId } from "@/action";

const WorkspacePage = async () => {

  const user = await getUserWorkspaceId();
  if (!user.success) {
    redirect("/sign-in");
  } else if (user.success && user.data) {
    console.log("Workspace ID exists: \n", user?.data.workspaceId);
    redirect(`workspace/${user.data.workspaceId}`);
  } else {
    console.log("Workspace ID is null");
  }

  return (
    <div className='mx-auto flex h-full flex-col items-center justify-center rounded-sm'>
      <WorkspaceForm />
    </div>
  );
};

export default WorkspacePage;