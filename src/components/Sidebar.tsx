'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { sidebarLinks } from '@/constants';
import { Button } from './ui/button';
// import { useEffect } from 'react';


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
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  
  // useEffect(() => {
  //   const workspace = fetch('/api/workspace', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     }})
  //     .then((res) => {
  //       if(!res.ok) {
//         throw new Error('Workspace not found');
  //       }
  //       return res;
  //     })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //     });
  //   if(workspace) {
  //     console.log(workspace);
  //   }

  //   // setWorkSpace(workspace.id);
  // }, []);



  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-col gap-6">
        <Button variant={`inactive`}>
          No Active Meeting
        </Button>
        <TooltipProvider>

        {sidebarLinks.map((item) => {
          const route = `/workspace/${workspaceId}${item.route}`
          const isActive = pathname === route;
            return (
              <Tooltip delayDuration={1000} key={item.label}>
                <TooltipTrigger key={item.label}> 
                  <Link
                    href={`/workspace/${workspaceId}${item.route}`}
                    key={item.label}
                    className={cn(
                      'flex gap-4 items-center p-4 rounded-lg justify-start hover:bg-primary ease-in duration-100 hover:animate-out',
                      {
                        'bg-primary hover:animate-none': isActive,
                      }
                    )}
                  >
                  <p className="flex gap-3 text-lg font-semibold text-white max-lg:hidden">
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
                  className="z-10 bg-black/10 backdrop-blur-xl"
                  key={item.label}
                  side='right'
                >
                  <p className="text-sm text-white">{item.details}</p>
                </TooltipContent>
              </Tooltip>
            )})}
          </TooltipProvider>
        </div>
    </section>
  );
};

export default Sidebar;
