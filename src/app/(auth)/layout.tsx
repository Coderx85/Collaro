import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full mx-auto flex flex-col min-h-screen">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[95%] px-4 sm:px-6 xl:px-8 py-3 sm:py-4 bg-white/10 dark:bg-slate-950/10 backdrop-blur-md rounded-2xl border border-white/80 dark:border-slate-600/50 shadow-[0_4px_10px_rgb(0,0,0,0.1)] dark:shadow-[0_4px_10px_rgb(0,0,0,0.25)]">
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
            <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/75 dark:from-white dark:via-white-80 dark:to-white/75 transition-all duration-300 hover:opacity-90">
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
