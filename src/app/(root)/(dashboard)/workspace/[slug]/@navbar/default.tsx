import Link from "next/link";
import Logo from "@/components/Logo";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import MobileNav from "./_components/MobileNav";
import NotificationBell from "./_components/NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  return (
    <nav className="fixed top-0 left-0 xl:left-50 right-0 h-16 bg-gray-900 dark:bg-slate-800/75 text-white flex items-center justify-between px-6">
      <div>
        <Link href={"/workspace"} className="flex items-center gap-1 xl:hidden">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center justify-end gap-3 px-4 py-2 text-lg font-bold">
        <NotificationBell />
        <ThemeToggle />
        {user && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
        <SignOutButton />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
