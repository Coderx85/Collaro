'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { sidebarLinks } from '@/constants';
import { Button } from './ui/button';

const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = params?.workspaceId as string;

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-col gap-6">
        <Button variant={`inactive`}>
          No Active Meeting
        </Button>
        <TooltipProvider>

        {sidebarLinks.map((item, index) => {
          const route = `/workspace/${workspaceId}${item.route}`
          const isActive = pathname === route;
            return (
              <Tooltip delayDuration={1000} key={item.route}>
                <TooltipTrigger key={index} className='group'> 
                  <Link
                    href={`/workspace/${workspaceId}${item.route}`}
                    key={item.label}
                    className={cn(
                      'flex group gap-4 items-end p-4 rounded-lg justify-start hover:bg-white/20 hover:text-dark-2 ease-in duration-100 hover:animate-out',
                      {
                        'bg-white/20 text-dark-2 hover:animate-none': isActive,
                      }
                    )}
                  >
                  <p className="flex gap-3 text-lg font-semibold text-current max-lg:hidden">
                    <item.component selected={isActive}/>
                    {item.label}
                  </p>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  className="z-10 bg-black/10 backdrop-blur-xl"
                  key={`${item.label}-content-${index}`}
                  side='top'
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
