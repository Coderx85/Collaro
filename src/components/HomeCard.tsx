'use client';

import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'bg-gradient-to-br py-2 group w-full xl:max-w-[270px] h-full xl:h-[120px] rounded-lg cursor-pointer border-2 transition-all duration-200 ease-in-out',
  {
    variants: {
      variant: {
        primary:
          ' border-primary bg-primary/10 hover:from-primary/5 hover:via-primary/20 hover:to-primary/5',
        orange:
          ' border-secondary bg-secondary/10 hover:from-secondary/10 hover:via-secondary/20 hover:to-secondary/10',
        purple:
          ' border-purple bg-purple/10 hover:from-purple/10 hover:via-purple/20 hover:to-purple/10',
        yellow:
          ' border-yellow bg-yellow/10 hover:from-yellow/10 hover:via-yellow/20 hover:to-yellow/10',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const textVariants = cva(
  'xl:text-xl text-sm text-clip items-end transition-colors duration-200 font-bold group-hover:text-white',
  {
    variants: {
      variant: {
        primary: 'text-primary',
        orange: 'text-secondary',
        purple: 'text-purple',
        yellow: 'text-yellow',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const descVariants = cva(
  'hidden xl:block text-md pl-4 justify-end font-normal group-hover:text-white',
  {
    variants: {
      variant: {
        primary: 'group-hover:text-primary/80',
        orange: 'group-hover:text-secondary/50',
        purple: 'group-hover:text-purple/80',
        yellow: 'group-hover:text-yellow/50',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);


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
  handleClick,
}: HomeCardProps) => {
  return (
    <div className={cardVariants({ variant })} onClick={handleClick}>
      <div className="flex items-center px-2 justify-between">
        <div className="flex items-center">
          <Image
            src={img}
            alt={title}
            width={40}
            height={40}
            className={"object-fill rounded-lg"}
          />
          <div className="ml-4">
            <h2 className={textVariants({ variant })}>{title}</h2>
          </div>
        </div>
      </div>
      <p className={descVariants({ variant })}>{description}</p>
    </div>
  );
};

export default HomeCard;