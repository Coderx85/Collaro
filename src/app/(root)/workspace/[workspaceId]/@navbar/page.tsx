"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { SignedIn, UserButton, useSignIn } from "@clerk/nextjs";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/home/ThemeToggle";
import MobileNav from "./_components/MobileNav";
import NotificationBell from "./_components/NotificationBell";

const Navbar = () => {
  const isActive = useSignIn();
  return (
    <nav className="fixed top-0 left-0 xl:left-50 right-0 h-16 bg-gray-800 text-white flex items-center justify-between px-6">
      <div>
        <Link
          href={!isActive ? "/" : "/workspace"}
          className="flex items-center gap-1 xl:hidden"
        >
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
        </Link>
      </div>
      <div className="flex items-center justify-end gap-3 px-4 py-2 text-lg font-bold">
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
