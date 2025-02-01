'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const sidebarLinks = [
  {
    imgURL: '/icons/home.svg',
    route: '/dashboard',
    label: 'Home',
  },
  {
    imgURL: '/icons/upcoming.svg',
    route: '/dashboard/upcoming',
    label: 'Upcoming',
  },
  {
    imgURL: '/icons/previous.svg',
    route: '/dashboard/previous',
    label: 'Previous',
  },
  {
    imgURL: '/icons/Video.svg',
    route: '/dashboard/recordings',
    label: 'Recordings',
  },
  {
    imgURL: '/icons/add-personal.svg',
    route: '/dashboard/personal-room',
    label: 'Personal Room',
  },
];


const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col  justify-between  bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route;
          
          return (
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
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
