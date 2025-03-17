'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  // base styles
  'px-4 py-6 flex flex-col group justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer border-2 transition-colors duration-200 ease-in-out',
  {
    variants: {
      variant: {
        primary: 'hover:border-primary bg-primary/5',
        orange: 'hover:border-[#FF742E] bg-[#FF742E]/10',
        purple: 'hover:border-purple bg-purple/10',
        yellow: 'hover:border-yellow bg-yellow/10'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

const textVariants = cva('text-2xl font-bold group-hover:text-white', {
  variants: {
    variant: {
      primary: 'text-primary',
      orange: 'text-[#FF742E]',
      purple: 'text-purple',
      yellow: 'text-yellow'
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
});

const descVariants = cva('text-lg font-normal group-hover:text-white', {
  variants: {
    variant: {
      primary: 'text-primary/80',
      orange: 'text-[#FF742E]/50',
      purple: 'text-purple/80',
      yellow: 'text-yellow/50'
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
});


interface HomeCardProps extends VariantProps<typeof cardVariants> {
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ 
  variant = 'primary', 
  img, 
  title, 
  description, 
  handleClick 
}: HomeCardProps) => {
  return (
    <section
      className={cardVariants({ variant })}
      onClick={handleClick}
    >
      <div className={cn(
        "flex items-center justify-center",
        "size-12 rounded-[10px]",
        "bg-black/10 backdrop-blur-lg"
      )}>
        <Image 
          src={img} 
          alt={title} 
          width={40}
          height={40}
          className={"object-obtain"}
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className={textVariants({ variant })}>{title}</h2>
        <p className={descVariants({ variant })}>
          {description}
        </p>
      </div>
    </section>
  );
};

export default HomeCard;