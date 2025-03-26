import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full mx-auto flex flex-col min-h-screen'>
      <div className='sticky top-0 z-50 flex items-center justify-between w-full px-8 py-4 bg-gradient-to-r from-zinc-900/50 to-zinc-700/50 dark:from-slate-800 dark:to-slate-900 shadow-md'>
        <Link
          href='/'
          className='flex items-end gap-2 align-bottom justify-end cursor-pointer'
        >
          <Image
            src='/icons/logo.svg'
            alt='logo'
            width={35}
            height={35}
            className='h-auto'
          />
          <span>
            <span className='text-2xl font-bold text-primary shadow-2xl'>
              DevnTalk
            </span>
          </span>
        </Link>
        <div className='flex items-center gap-4'>
          <ThemeToggle />
        </div>
      </div>
      <div className='flex-1 w-full'>{children}</div>
    </div>
  );
};

export default AuthLayout;
