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
import { useEffect, useState } from "react";
import { getMember } from "@/action/member.action";
import { usePathname } from "next/navigation";

export function AppSidebar({
  ...props
}: {} & React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [role, setRole] = useState<"owner" | "admin" | "member">("member");

  useEffect(() => {
    const fetchMemberRoel = async () => {
      const { data } = await getMember(
        pathname.split("/")[2],
        session?.user?.id || "",
      );
      if (!data) return;
      setRole(data.role);
    };
    fetchMemberRoel();
  }, [session, pathname]);

  if (!session || !pathname.includes("workspace")) return null;

  if (isPending) {
    return <Loader />;
  }

  const workspaceId = pathname.split("/")[2];

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
