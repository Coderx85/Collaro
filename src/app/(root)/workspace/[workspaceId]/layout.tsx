import { Metadata } from "next";
import { ReactNode } from "react";
import { getUser, getWorkspace } from "@/action";
import { WorkspaceInitializer } from "@/components/WorkspaceInitializer";
import Sidebar from "./_components/Sidebar";

export const metadata: Metadata = {
  title: "DevnTalk",
  description: "A workspace for your team, powered by Stream Chat and Clerk.",
};

const RootLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceId: string };
}) => {
  const user = await getUser();
  const workspaceData = await getWorkspace(user?.data?.clerkId || "");
  console.log(workspaceData);
  const workspace = workspaceData.data;
  const param = await params;
  const workspaceId = param.workspaceId;
  const members = workspaceData.data?.members || [];

  return (
    <div className='flex w-full'>
      {/* Initialize workspace state */}
      {workspace && (
        <WorkspaceInitializer
          workspaceId={workspaceId}
          workspaceName={workspace.name}
          members={members}
        />
      )}

      <Sidebar />
      <section className='flex bg-primary/5 min-h-full flex-1 flex-col px-0 py-6 max-md:pb-14 sm:px-14'>
        <div className='w-full'>{children}</div>
      </section>
    </div>
  );
};

export default RootLayout;
