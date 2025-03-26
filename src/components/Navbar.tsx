"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { SignedIn, UserButton, useSignIn } from "@clerk/nextjs";
import MobileNav from "./MobileNav";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const isActive = useSignIn();
  return (
    <nav className='flex w-full justify-between bg-gray-800 via-cyan-500 to-black px-6 py-4 lg:px-10'>
      <Link
        href={!isActive ? "/" : "/workspace"}
        className='flex items-center gap-1'
      >
        <Image
          src='/icons/logo.svg'
          width={32}
          height={32}
          alt='yoom logo'
          className='max-sm:size-10'
        />
        <p className='group text-[26px] font-extrabold text-white duration-75 hover:text-white max-sm:hidden'>
          Devn<span className='text-primary'>Talk</span>
        </p>
      </Link>
      <div className='xl:flex hidden items-center justify-center gap-3 px-4 py-2 text-lg font-bold'>
        <NotificationBell />
        <ThemeToggle />
        <SignedIn>
          <UserButton />
          <SignOutButton />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
