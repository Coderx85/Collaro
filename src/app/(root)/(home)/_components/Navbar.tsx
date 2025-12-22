import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { homeTabs } from "@/constants";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { config } from "@/lib/config";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

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
        {user ? (
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
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href={config.SIGN_IN}>
              <Button className="text-white bg-transparent dark:bg-transparent hover:bg-primary/90 backdrop-blur-2xl transition-colors text-sm sm:text-base">
                Sign In
              </Button>
            </Link>
            <Link href={config.SIGN_UP}>
              <Button className="text-white dark:text-accent dark:bg-white/50 bg-white/50  hover:bg-primary/90 backdrop-blur-2xl transition-colors text-sm sm:text-base">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
