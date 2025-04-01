import React from "react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/home/ThemeToggle";
import { homeTabs } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

const Navbar = async () => {
  const { userId } = await auth();
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between w-full px-4 sm:px-8 py-2 xl:py-4 bg-gradient-to-r from-gray-900/50 to-gray-700/50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-2xl shadow-md">
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/"
          className="flex gap-1 sm:gap-2 items-center cursor-pointer"
        >
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={26}
            height={26}
            className="h-auto w-6 sm:w-7 justify-center xl:size-8"
          />
          <span className="text-lg sm:text-xl xl:text-2xl font-bold text-white shadow-2xl">
            DevnTalk
          </span>
        </Link>
      </div>
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
        <ThemeToggle />
        {userId ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/workspace">
              <Button className="text-white bg-primary hover:bg-primary/90 transition-colors text-sm sm:text-base">
                Dashboard
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
