import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full mx-auto flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 flex items-center justify-between w-full px-4 sm:px-6 xl:px-8 py-3 sm:py-4 bg-gradient-to-r from-zinc-900/50 to-zinc-700/50 dark:from-slate-800 dark:to-slate-900 shadow-md">
        <Link
          href="/"
          className="flex items-end gap-1 sm:gap-2 align-bottom justify-end cursor-pointer"
        >
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={30}
            height={30}
            className="h-auto w-6 sm:w-7 xl:w-8"
          />
          <span>
            <span className="text-xl sm:text-2xl font-bold text-primary shadow-2xl">
              DevnTalk
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
};

export default AuthLayout;
