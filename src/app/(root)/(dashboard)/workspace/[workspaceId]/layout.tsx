import { ReactNode, Suspense } from "react";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Loader } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./@navbar/page";
import { AppSidebar } from "@/components/app-sidebar";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const workspaceId = "workspaceId-placeholder"; // Replace with actual workspaceId retrieval logic
  return (
    <StreamVideoProvider>
      <SidebarProvider>
        <AppSidebar workspaceId={workspaceId} variant="inset" />
        <SidebarInset>
          {/* <SiteHeader /> */}
          <Navbar />
          {/* <div className="flex h-screen overflow-hidden">
            <div className="flex flex-col flex-1 min-h-screen xl:ml-50">
              {navbar} */}
          <Suspense
            fallback={
              <Loader className="size-14 animate-spin justify-center items-center" />
            }
          >
            <main className="flex-1 h-full overflow-y-auto p-6">
              {children}
            </main>
          </Suspense>
          {/* </div> */}
          {/* </div> */}
        </SidebarInset>
      </SidebarProvider>
    </StreamVideoProvider>
  );
};

export default RootLayout;
