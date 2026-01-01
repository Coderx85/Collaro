"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Logo from "@/components/navigation/Logo";
import {
  useListOrganizations,
  useActiveOrganization,
  authClient,
} from "@/lib/auth-client";
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
import { IconSlash } from "@tabler/icons-react";
import OrgSwitcher from "@/components/workspace/org-switcher";

export default function Navbar() {
  const params = useParams<{ slug: string }>();
  const pathname = usePathname();
  const { data: organizations } = useListOrganizations();
  const { data: activeOrg } = useActiveOrganization();

  // Handle slug param safely
  const slug = useMemo(() => {
    if (typeof params?.slug === "string") return params.slug;
    if (Array.isArray(params?.slug)) return params.slug[0];
    return "";
  }, [params?.slug]);

  // Find the current workspace from the organizations list based on slug
  const currentWorkspace = useMemo(() => {
    return organizations?.find((org) => org.slug === slug);
  }, [organizations, slug]);

  // Auto-set active organization based on URL slug
  useEffect(() => {
    if (currentWorkspace && activeOrg?.id !== currentWorkspace.id) {
      authClient.organization.setActive({
        organizationId: currentWorkspace.id,
      });
    }
  }, [currentWorkspace, activeOrg]);

  const currentLabel = useMemo(() => {
    if (!pathname) return "Home";
    const afterWorkspace = pathname.split(`/workspace/${slug}`)[1] || "";
    const pathSegment = afterWorkspace.split("/").filter(Boolean)[0] || "";
    const normalizedRoute = pathSegment ? `/${pathSegment}` : "";
    const activeLink = sidebarLinks.find(
      (link) => link.route === normalizedRoute
    );

    if (activeLink) return activeLink.label;
    if (!pathSegment) return "Home";
    return pathSegment.replace(/-/g, " ");
  }, [pathname, slug]);

  return (
    <header className="flex top-0 left-0 xl:left-50 right-0 shrink-0 items-center gap-2 border-b bg-sidebar dark:bg-sidebar transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <Link
          href={`/workspace/${slug}`}
          className="flex items-center gap-1 xl:hidden"
        >
          <Logo />
        </Link>

        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <OrgSwitcher />
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
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
