"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = params?.workspaceId as string;

  return (
    <section className='w-full max-w-[264px]'>
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src='/icons/hamburger.svg'
            width={36}
            height={36}
            alt='hamburger icon'
            className='cursor-pointer sm:hidden'
          />
        </SheetTrigger>
        <SheetContent side='left' className='border-none bg-dark-1'>
          <Link href='/' className='flex items-center gap-1'>
            <Image
              src='/icons/logo.svg'
              width={32}
              height={32}
              alt='yoom logo'
            />
            <p className='text-[26px] font-extrabold text-white'>DevnTalk</p>
          </Link>
          <div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto'>
            <SheetClose asChild>
              <section className=' flex h-full flex-col gap-6 pt-16 text-white'>
                {sidebarLinks.map((item) => {
                  const route = `/workspace/${workspaceId}${item.route}`;
                  const isActive = pathname === route;
                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn(
                          "flex gap-2 items-center px-2 py-6 rounded-lg w-full max-w-60 duration-75",
                          {
                            "bg-primary": isActive,
                          },
                        )}
                      >
                        <item.component
                          selected={isActive}
                          className='size-6'
                        />
                        <p className='font-semibold'>{item.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
