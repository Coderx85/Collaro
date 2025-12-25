"use client";

import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { homeTabs } from "@/constants";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { config } from "@/lib/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(config.SIGN_IN);
        },
      },
    });
  };

  return (
    <div className="sticky z-50 top-0 flex items-center justify-between w-full px-4 sm:px-8 py-2 xl:py-4 bg-linear-to-r from-black/50 to-gray-700/50 dark:from-black/10 dark:to-black/20 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    src={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${user.name}&size=75`
                    }
                    alt={user.name}
                    className="rounded-full"
                    height={75}
                    width={75}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={"bottom"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={
                          user.image ||
                          `https://ui-avatars.com/api/?name=${user.name}&size=75`
                        }
                        alt={user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconUserCircle />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconNotification />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSignOut()}>
                  <IconLogout />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
              {/* </DropdownMenuContent> */}
            </DropdownMenu>
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
