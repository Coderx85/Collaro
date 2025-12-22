import { type ReactNode, Suspense } from "react";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Loader } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const RootLayout = async ({
  children,
  navbar,
}: {
  children: ReactNode;
  navbar: ReactNode;
}) => {
  return (
    <StreamVideoProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {navbar}
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
