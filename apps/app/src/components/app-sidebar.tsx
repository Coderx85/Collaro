"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { data } from "@/constants/sidebar-items";
import Link from "next/link";
import Logo from "./Logo";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Logo />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Collaro</span>
                  <span className="text-xs text-sidebar-foreground/60">
                    Workspace
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarContent>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        {/* User profile section can be added here */}
        <div className="px-2 py-1 text-xs text-sidebar-foreground/60">
          {data.user?.name && (
            <div className="font-medium text-sidebar-foreground">
              {data.user.name}
            </div>
          )}
          {data.user?.email && (
            <div className="text-sidebar-foreground/60 truncate">
              {data.user.email}
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
