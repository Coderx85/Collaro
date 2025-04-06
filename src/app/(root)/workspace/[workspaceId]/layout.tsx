import { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { getUser, getWorkspace } from "@/action";
import { WorkspaceInitializer } from "@/components/WorkspaceInitializer";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Loader } from "lucide-react";

export const metadata: Metadata = {
  title: "Home",
  description: "A workspace for your team, powered by Stream Chat and Clerk.",
  icons: {
    icon: "/icons/home.svg",
  },
};

const RootLayout = async ({
  children,
  sidebar,
  navbar,
  params,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  navbar: ReactNode;
  params: { workspaceId: string };
}) => {
  const user = await getUser();
  if (!user?.data?.clerkId) {
    console.error("No user found or missing clerkId");
    return null;
  }

  const { workspaceId } = await params;
  console.log(
    `Validating access for user ${user.data.clerkId} to workspace ${workspaceId}`,
  );

  // Get workspace data
  const workspaceData = await getWorkspace(user.data.clerkId);
  const workspace = workspaceData.data;
  const members = workspaceData.data?.member || [];

  return (
    <StreamVideoProvider>
      <div className="flex h-screen overflow-hidden">
        {workspace && (
          <WorkspaceInitializer
            workspaceId={workspaceId}
            workspaceName={workspace.name}
            members={members}
          />
        )}

        {sidebar}
        <div className="flex flex-col flex-1 min-h-screen xl:ml-50">
          {navbar}
          <main className="flex-1 overflow-y-auto p-6 mt-16 bg-gradient-to-br from-gray-100/50 via-gray-300/20 to-gray-200/50 dark:from-black dark:via-slate-900 dark:to-black">
            <Suspense
              fallback={
                <Loader className="size-14 animate-spin justify-center items-center" />
              }
            >
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </StreamVideoProvider>
  );
};

export default RootLayout;
