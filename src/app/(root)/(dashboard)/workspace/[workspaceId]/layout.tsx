import { type ReactNode, Suspense } from "react";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Loader } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./@navbar/page";
import { AppSidebar } from "@/components/app-sidebar";

const RootLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) => {
  const workspaceId = (await params).workspaceId;
  return (
    <StreamVideoProvider>
      <SidebarProvider>
        <AppSidebar workspaceId={workspaceId} variant="inset" />
        <SidebarInset>
          <Navbar />
          <Suspense
            fallback={
              <Loader className="size-14 animate-spin justify-center items-center" />
            }
          >
            <main className="flex-1 h-full overflow-y-auto p-6">
              {children}
            </main>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </StreamVideoProvider>
  );
};

export default RootLayout;
