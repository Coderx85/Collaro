"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import Loader from "./Loader";
import Logo from "./Logo";
import Link from "next/link";

export function AppSidebar({
  workspaceId,
  role = "member",
  ...props
}: { workspaceId?: string; role?: "admin" | "member" } & React.ComponentProps<
  typeof Sidebar
>) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Loader />;
  }

  const userData = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    avatar:
      session?.user?.image ||
      `https://gravatar.com/avatar/${session?.user?.id}`,
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-transparent hover:dark:bg-transparent  "
            >
              <Link href="#">
                {/* <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span> */}
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain workspaceId={workspaceId} role={role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
