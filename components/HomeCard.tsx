'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

interface HomeCardProps {
  color?: string;
  classname?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ color, classname, img, title, description, handleClick }: HomeCardProps) => {
  return (
    <section
      className={cn(
        `px-4 py-6 flex flex-col group justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer border-2 border-${color} hover:bg-${color}`,
        classname
      )}
      onClick={handleClick}
    >
      <div className="flex-center group glassmorphism size-12 rounded-[10px]">
        <Image src={img} alt="meeting" width={27} height={27} />
      </div>
      
      <div className={`flex group text-${color} group-hover:text-white flex-col gap-2`}>
        <h1 className={`text-2xl text-${color} group-hover:text-white font-bold`}>{title}</h1>
        <p className={`text-lg font-normal hidden`}>{description}</p>
      </div>
    </section>
  );
};

export default HomeCard;
