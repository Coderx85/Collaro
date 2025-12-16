import React from "react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { homeTabs } from "@/constants";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

const Navbar = async () => {
  const { userId } = await auth();
  return (
    <div className="sticky z-50 top-0 flex items-center justify-between w-full px-4 sm:px-8 py-2 xl:py-4 bg-gradient-to-r from-black/50 to-gray-700/50 dark:from-black/10 dark:to-black/20 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <Logo />
      <div>
        <ul className="hidden sm:flex gap-4 text-lg sm:text-base font-semibold text-slate-900 dark:text-white">
          {homeTabs.map((tab) => (
            <li key={tab.name}>
              <Link
                href={tab.id}
                className="hover:text-white text-white/65 duration-150 transform-fill transition-colors"
              >
                {tab.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />{" "}
        {userId ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/workspace">
              <Button className="text-white bg-primary hover:bg-primary/90 transition-colors text-sm sm:text-base">
                Dashboard
              </Button>
            </Link>
            <Link href="/subscriptions" className="hidden sm:block">
              <Button variant="outline" className="text-sm sm:text-base">
                My Subscriptions
              </Button>
            </Link>
            <UserButton />
          </div>
        ) : (
          <Link href={"/sign-in"}>
            <Button className="text-white bg-transparent dark:bg-transparent hover:bg-primary/90 backdrop-blur-2xl transition-colors text-sm sm:text-base">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
