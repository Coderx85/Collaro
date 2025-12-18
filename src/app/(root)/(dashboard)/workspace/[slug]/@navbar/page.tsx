"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import {
  useSession,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

export default function Navbar() {
  const params = useParams<{ slug: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
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
      (link) => link.route === normalizedRoute,
    );

    if (activeLink) return activeLink.label;
    if (!pathSegment) return "Home";
    return pathSegment.replace(/-/g, " ");
  }, [pathname, slug]);

  const handleOrgSwitch = async (orgId: string, orgSlug: string) => {
    await authClient.organization.setActive({ organizationId: orgId });
    router.push(`/workspace/${orgSlug}`);
  };

  console.log("activeOrg", activeOrg);
  console.log("currentWorkspace", currentWorkspace);
  console.log("organizations", organizations);

  return (
    <header className="flex top-0 left-0 xl:left-50 right-0 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
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
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer hover:text-foreground/80 transition-colors">
                  {String(
                    activeOrg?.name ||
                      currentWorkspace?.name ||
                      "Select Workspace",
                  )}
                  <ChevronsUpDown className="size-4 text-muted-foreground ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {organizations?.map(
                    (org) => (
                      console.log(org),
                      (
                        <DropdownMenuItem
                          key={org.id}
                          onClick={() =>
                            handleOrgSwitch(org.id, String(org.slug || ""))
                          }
                          className="justify-between"
                        >
                          {String(org.name)}
                          {activeOrg?.id === org.id && (
                            <Check className="size-4 ml-auto" />
                          )}
                        </DropdownMenuItem>
                      )
                    ),
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href={`/workspace/new`}>
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                          <Plus className="size-4" />
                        </div>
                        <div className="font-medium text-muted-foreground">
                          Create Workspace
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
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
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
