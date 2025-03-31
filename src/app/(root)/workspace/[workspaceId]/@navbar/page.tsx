import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/home/ThemeToggle";
import MobileNav from "./_components/MobileNav";
import NotificationBell from "./_components/NotificationBell";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 xl:left-50 right-0 h-16 bg-gray-900 dark:bg-gray-600/50 text-white flex items-center justify-between px-6">
      <div>
        <Link href={"/workspace"} className="flex items-center gap-1 xl:hidden">
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
        <UserButton />
        <SignOutButton />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
