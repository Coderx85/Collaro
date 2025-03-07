'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { sidebarLinks } from '@/constants';

// const sidebarLinks = [
//   {
//     imgURL: '/icons/home.svg',
//     route: '/dashboard',
//     label: 'Home',
//     details: 'This is the home page',
//   },
//   {
//     imgURL: '/icons/upcoming.svg',
//     route: '/dashboard/upcoming',
//     label: 'Upcoming',
//     details: 'List of upcoming meetings',
//   },
//   {
//     imgURL: '/icons/previous.svg',
//     route: '/dashboard/previous',
//     label: 'Previous',
//     details: 'List of previous meetings',
//   },
//   {
//     imgURL: '/icons/Video.svg',
//     route: '/dashboard/recordings',
//     label: 'Recordings',
//     details: 'List of recordings',
//   },
//   {
//     imgURL: '/icons/add-personal.svg',
//     route: '/dashboard/personal-room',
//     label: 'Personal Room',
//     details: 'User Personal detail ' 
//   },
// ];


const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col  justify-between  bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6">
        <TooltipProvider>

        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route;
            return (
              <Tooltip delayDuration={0} key={item.label}>
              <TooltipTrigger key={item.label}> 
                  <Link
                    href={item.route}
                    key={item.label}
                    className={cn(
                      'flex gap-4 items-center p-4 rounded-lg justify-start hover:bg-primary ease-in duration-100 hover:animate-out',
                      {
                        'bg-primary': isActive,
                      }
                    )}
                  >
                  <p className="text-lg flex gap-3 text-white font-semibold max-lg:hidden">
                    <Image 
                      src={item.imgURL}
                      alt={item.label}
                      width={24}
                      height={24}
                    />
                    {item.label}
                  </p>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-black/10 backdrop-blur-xl z-10"
                  key={item.label}
                  side='right'
                >
                  <p className="text-sm text-white">{item.details}</p>
                </TooltipContent>
              </Tooltip>
            );
        })}
        {/* <p className="text-lg flex gap-3 text-white font-semibold max-lg:hidden">
          <Image 
            src={item.imgURL}
            alt={item.label}
            width={24}
            height={24}
          />
          {item.label}
        </p> */}
        </TooltipProvider>
        </div>
    </section>
  );
};

export default Sidebar;
