"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants/component";
import sidebar from "@/constants/sidebar.json";

export function NavMain({
  items,
  workspaceId,
  role = "member",
}: {
  items?: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  workspaceId?: string;
  role?: "admin" | "member";
}) {
  const pathname = usePathname();

  // Workspace-specific sidebar (uses `sidebarLinks`)
  if (workspaceId) {
    return (
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          {/*           
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <IconCirclePlusFilled />
                <span>Quick Create</span>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <IconMail />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
          */}
          <SidebarMenu>
            {sidebarLinks.map((item) => {
              const route = `/workspace/${workspaceId}${item.route}`;
              const isActive = pathname === route;
              const isAdminRoute = item.adminRoute === true;
              const isAdmin = role === "admin";
              const shouldRender = !isAdminRoute || isAdmin;

              if (!shouldRender) return null;

              const Component = item.component;
              // const iconClass = isActive ? "text-primary" : "text-muted";
              // const iconClass = "text-muted";

              return (
                <SidebarMenuItem key={route}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    asChild
                    size={"lg"}
                    isActive={isActive}
                    className="[&>svg]:size-5"
                  >
                    <Link href={route}>
                      {Component && (
                        <Component
                          selected={isActive}
                          // className={iconClass}
                        />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  // Fallback: generic nav (unchanged)
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items?.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
