import { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { getUser, getWorkspace } from "@/action";
import { WorkspaceInitializer } from "@/components/WorkspaceInitializer";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Loader } from "lucide-react";

export const metadata: Metadata = {
  title: "Home | DevnTalk",
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
  const workspaceData = await getWorkspace(user?.data?.clerkId || "");
  const workspace = workspaceData.data;
  const param = await params;
  const workspaceId = param.workspaceId;
  const members = workspaceData.data?.member || [];

  return (
    <StreamVideoProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Initialize workspace state */}
        {workspace && (
          <WorkspaceInitializer
            workspaceId={workspaceId}
            workspaceName={workspace.name}
            members={members}
          />
        )}

        {/* Main Content Wrapper - Responsive margins */}
        {sidebar}
        <div className="flex flex-col flex-1 min-h-screen xl:ml-50">
          {navbar}
          <main className="flex-1 overflow-y-auto p-6 mt-16 dark:bg-gradient-to-br bg-white dark:from-slate-900 dark:to-slate-900">
            <Suspense fallback={<Loader />}>{children}</Suspense>
          </main>
        </div>
      </div>
    </StreamVideoProvider>
  );
};

export default RootLayout;
