'use client';

import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../components/ui/tooltip';
import { sidebarLinks } from '@/constants';
import { Button } from '../../../../../components/ui/button';
import LeaveTeamButton from './LeaveButton';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const workspaceId = params?.workspaceId as string;

  return (
    <section className="left-0 top-0 flex w-fit h-[100vh] flex-col justify-between bg-gradient-to-t from-gray-800 to-black p-6 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-col gap-6">
        <Button variant={`inactive`} className='font-bold'>
          No Active Meeting
        </Button>
        <TooltipProvider>

        {sidebarLinks.map((item, index) => {
          const route = `/workspace/${workspaceId}${item.route}`
          const isActive = pathname === route;
            return (
              <Tooltip delayDuration={1000} key={item.route} >
                <TooltipTrigger 
                  key={index} 
                  className={cn(
                    'flex group items-end p-2 rounded-lg cursor-pointer justify-start hover:bg-gradient-to-br from-white/50 via-white to-white/80 hover:text-dark-2 ease-in duration-100 hover:animate-out',
                    {
                      'bg-gradient-to-br from-white/50 via-white to-white/80 text-dark-2 hover:animate-none': isActive,
                    }
                  )}
                  onClick={
                    () => router.push(`/workspace/${workspaceId}${item.route}`)
                }> 
                  <div className="flex gap-3 text-lg justify-center font-semibold text-current max-lg:hidden">
                    <item.component selected={isActive} className='size-6'/>
                    {item.label}
                  </div>
              </TooltipTrigger>
              <TooltipContent
                className="z-10 bg-transparent backdrop-blur-xl"
                key={`${item.label}-content-${index}`}
                side='top'
              >
                <p className="text-sm text-white">{item.details}</p>
              </TooltipContent>
            </Tooltip>
          )})}
          </TooltipProvider>
        </div>

        <LeaveTeamButton />
    </section>
  );
};

export default Sidebar;
