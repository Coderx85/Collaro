"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants/component";

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
  role: "owner" | "admin" | "member";
}) {
  const pathname = usePathname();

  if (!workspaceId) {
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
  return (
    <SidebarGroup>
      {/* Non-Member Routes */}

      <SidebarGroupLabel>Admin Routes</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {sidebarLinks
            .filter((item) => item.adminRoute === true)
            .map((item) => {
              const route = `/workspace/${workspaceId}${item.route}`;
              const isActive = pathname === route;
              const isAdminRoute = item.adminRoute === true;
              const hasAdminAccess = role === "owner" || role === "admin";
              const shouldRender = !isAdminRoute || hasAdminAccess;

              if (!shouldRender) return null;

              const Component = item.component;

              return (
                <SidebarMenuItem key={route}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    asChild
                    isActive={isActive}
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

      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {sidebarLinks
            .filter((item) => item.adminRoute !== true)
            .map((item) => {
              const route = `/workspace/${workspaceId}${item.route}`;
              const isActive = pathname === route;
              const isAdminRoute = item.adminRoute === true;
              const hasAdminAccess = role === "owner" || role === "admin";
              const shouldRender = !isAdminRoute || hasAdminAccess;

              if (!shouldRender) return null;

              const Component = item.component;

              return (
                <SidebarMenuItem key={route}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    asChild
                    isActive={isActive}
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
