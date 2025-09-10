import { ReactNode, Suspense } from "react";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Loader } from "lucide-react";

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
  return (
    <StreamVideoProvider>
      <div className="flex h-screen overflow-hidden">
        {sidebar}
        <div className="flex flex-col flex-1 min-h-screen xl:ml-50">
          {navbar}
          <main className="flex-1 overflow-y-auto p-6 mt-16 bg-gradient-to-br bg-zinc-500 dark:from-black dark:via-slate-900 dark:to-black">
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
