"use client";

import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../../components/ui/tooltip";
import { sidebarLinks } from "@/constants";
import LeaveTeamButton from "../_components/LeaveButton";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { SidebarLink } from "@/types";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import AlertButton from "../_components/AlertButton";

const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const workspaceId = params?.workspaceId as string;
  const { user } = useUser();

  useEffect(() => {
    sidebarLinks.forEach((item: SidebarLink) => {
      const route = `/workspace/${workspaceId}${item.route}`;
      router.prefetch(route);
    });
  }, [workspaceId, router]);

  const handleNavigation = useCallback(
    (route: string) => {
      // Still use push for actual navigation
      router.push(route);
    },
    [router],
  );

  return (
    <section className="hidden xl:flex xl:flex-col xl:fixed left-0 top-0 h-full w-50 bg-gradient-to-b from-primary to-primary text-white">
      <div className="flex items-center gap-2 justify-self-start p-4.5">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="yoom logo"
          className="max-sm:size-10"
        />
        <p className="group text-[26px] font-extrabold text-white duration-75 hover:text-white max-sm:hidden">
          Devn<span className="text-primary">Talk</span>
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3.5 p-3 overflow-y-auto">
        <TooltipProvider>
          <AlertButton />
          {sidebarLinks.map((item: SidebarLink, index) => {
            const route = `/workspace/${workspaceId}${item.route}`;
            const isActive = pathname === route;
            const isAdminRoute = item.adminRoute === true;
            const isAdmin = user?.publicMetadata.role === "admin";
            const shouldRender = !isAdminRoute || isAdmin;

            return shouldRender ? (
              <Tooltip delayDuration={1000} key={item.route}>
                <TooltipTrigger
                  key={index}
                  className={cn(
                    "flex group items-end p-2.5 rounded-sm cursor-pointer justify-start hover:bg-gradient-to-br from-white/50 via-white to-white/80 hover:text-dark-2 ease-in duration-100 hover:animate-out",
                    {
                      "bg-gradient-to-br from-white/50 via-white to-white/80 text-dark-2 hover:animate-none":
                        isActive,
                    },
                  )}
                  onClick={() =>
                    handleNavigation(`/workspace/${workspaceId}${item.route}`)
                  }
                >
                  <div className="flex gap-3 text-md justify-center font-semibold text-current max-lg:hidden">
                    <item.component selected={isActive} className="size-5" />
                    {item.label}
                  </div>
                </TooltipTrigger>

                <TooltipContent
                  className="z-10 bg-transparent backdrop-blur-xl"
                  key={`${item.label}-content-${index}`}
                  side="top"
                >
                  <p className="text-sm text-white">{item.details}</p>
                </TooltipContent>
              </Tooltip>
            ) : null;
          })}
        </TooltipProvider>
      </div>

      <LeaveTeamButton />
    </section>
  );
};

export default Sidebar;
