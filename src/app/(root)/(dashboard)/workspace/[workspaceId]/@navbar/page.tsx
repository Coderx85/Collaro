"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { UserButton } from "@clerk/nextjs";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import MobileNav from "./_components/MobileNav";
import NotificationBell from "./_components/NotificationBell";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { sidebarLinks } from "@/constants/component";
import { IconChevronDown, IconSlash } from "@tabler/icons-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const params = useParams<{ workspaceId: string }>();
  const pathname = usePathname();
  const [workspaceName, setWorkspaceName] = useState("Workspace");
  // const [first, setfirst] = useState(second);

  const workspaceId = useMemo(() => {
    if (typeof params?.workspaceId === "string") return params.workspaceId;
    if (Array.isArray(params?.workspaceId)) return params.workspaceId[0];
    return "";
  }, [params?.workspaceId]);

  useEffect(() => {
    let isMounted = true;
    if (!workspaceId) return undefined;

    fetch(`/api/workspace/${workspaceId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        if (typeof data.name === "string") setWorkspaceName(data.name);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [workspaceId]);

  const currentLabel = useMemo(() => {
    if (!pathname) return "Home";
    const afterWorkspace = pathname.split(`/workspace/${workspaceId}`)[1] || "";
    const pathSegment = afterWorkspace.split("/").filter(Boolean)[0] || "";
    const normalizedRoute = pathSegment ? `/${pathSegment}` : "";
    const activeLink = sidebarLinks.find(
      (link) => link.route === normalizedRoute
    );

    if (activeLink) return activeLink.label;
    if (!pathSegment) return "Home";
    return pathSegment.replace(/-/g, " ");
  }, [pathname, workspaceId]);

  return (
    <header className="flex top-0 left-0 xl:left-50 right-0 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <Link
          href={`/workspace/${workspaceId}`}
          className="flex items-center gap-1 xl:hidden"
        >
          <Logo />
        </Link>

        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              {/* <BreadcrumbLink href={`/workspace/${workspaceId}`}>
                {workspaceName}
              </BreadcrumbLink> */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  {workspaceName}{" "}
                  {/* <IconChevronDown className="size-4 text-muted-foreground" /> */}
                </DropdownMenuTrigger>
                {/* <DropdownMenuContent>
                  {workspaces &&
                    workspaces.map((workspace) => (
                      <DropdownMenuItem key={workspace.id} asChild>
                        <Link href={workspace.route}>{workspace.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  <DropdownMenuItem>{}</DropdownMenuItem>
                </DropdownMenuContent> */}
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <IconSlash className="size-4 text-muted-foreground" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-3 px-4 py-2 text-lg font-bold">
          <NotificationBell />
          <ThemeToggle />
          <UserButton />
          <SignOutButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
