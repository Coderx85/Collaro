"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarLinks, SidebarLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

const Sidebarlink = ({ role, workspaceId }: SidebarLinks) => {
  const pahtname = usePathname();
  return (
    <div className="gap-2 flex flex-col">
      {sidebarLinks.map((item: SidebarLink, index: number) => {
        const route = `/workspace/${workspaceId}${item.route}`;
        const isActive = pahtname === route;
        const isAdminRoute = item.adminRoute === true;
        const isAdmin = role === "admin";
        const shouldRender = !isAdminRoute || isAdmin;

        return shouldRender ? (
          <Link
            href={route}
            passHref
            key={index}
            className={cn(
              "flex w-full group items-end p-2.5 rounded-sm cursor-pointer justify-start hover:bg-gradient-to-br from-white/50 via-white to-white/80 hover:text-dark-2 ease-in duration-100 hover:animate-out",
              {
                "text-primary/85 dark:text-green-600 hover:text-primary hover:dark:text-primary hover:animate-none":
                  isAdminRoute && isAdmin && !isActive,
                "bg-gradient-to-br from-white/50 via-white to-white/80 text-dark-2 hover:animate-none":
                  isActive,
                "text-primary/85 hover:text-primary":
                  isActive && isAdminRoute && isAdmin,
              },
            )}
          >
            <div
              className="flex gap-3 text-md justify-center font-semibold text-current max-lg:hidden"
              key={index}
            >
              <item.component selected={isActive} className="size-5" />
              {item.label}
            </div>
          </Link>
        ) : null;
      })}
    </div>
  );
};

export default Sidebarlink;
