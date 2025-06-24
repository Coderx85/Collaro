import { ReactNode, Suspense } from "react";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Loader } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { rootDomain } from "@/lib";

const RootLayout = async ({
  children,
  sidebar,
  navbar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  navbar: ReactNode;
  params: { workspaceId: string };
}) => {
  const user = await currentUser();
  if (!user) {
    redirect(`${rootDomain}/sign-in`);
  }

  return (
    <StreamVideoProvider>
      <div className="flex h-screen overflow-hidden">
        {sidebar}
        <div className="flex flex-col flex-1 min-h-screen xl:ml-50">
          {navbar}
          <main className="flex-1 overflow-y-auto p-6 mt-16 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-400 dark:from-black dark:via-slate-900 dark:to-black">
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
