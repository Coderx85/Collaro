import { type ReactNode, Suspense } from "react";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Loader } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const RootLayout = async ({
  children,
  navbar,
  params,
}: {
  children: ReactNode;
  navbar: ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  return (
    <StreamVideoProvider>
      <SidebarProvider>
        <AppSidebar workspaceId={slug} variant="inset" />
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
