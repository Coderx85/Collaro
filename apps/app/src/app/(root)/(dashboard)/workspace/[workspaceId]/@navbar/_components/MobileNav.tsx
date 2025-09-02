"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

const MobileNav = () => {
  const pathname = usePathname();
  const params = useParams();
  const { user } = useUser();
  const role =
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.role === "owner"
      ? "admin"
      : "member";
  const workspaceId = params?.workspaceId as string;

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            width={36}
            height={36}
            alt="hamburger icon"
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-1">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/icons/logo.png"
              width={32}
              height={32}
              alt="collaro logo"
            />
            <p className="text-[26px] font-extrabold text-white">
              Co<span className="text-primary">llaro</span>
            </p>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className=" flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((item) => {
                  const route = `/workspace/${workspaceId}${item.route}`;
                  const isActive = pathname === route;
                  const isAdminRoute = item.adminRoute === true;
                  const isAdmin = role === "admin";
                  const shouldRender = !isAdminRoute || isAdmin;

                  return shouldRender ? (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={route}
                        passHref
                        key={item.label}
                        className={cn(
                          "flex w-full group p-2.5 rounded-sm cursor-pointer gap-2.5 items-center justify-start hover:bg-gradient-to-br from-white/50 via-white to-white/80 hover:text-dark-2 ease-in duration-100 hover:animate-out",
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
                        <item.component
                          selected={isActive}
                          className="size-6"
                        />
                        <p className="font-semibold text-xl text-center">
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  ) : null;
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
