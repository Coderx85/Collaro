"use client";

import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "relative w-full p-4 rounded-xl cursor-pointer transform transition-all duration-300 animate-fade-in group",
  {
    variants: {
      variant: {
        primary:
          "bg-white/75 border-2 border-blue-200 hover:bg-blue-50 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 dark:border-transparent",
        orange:
          "bg-white/75 border-2 border-orange-200 hover:bg-orange-50 dark:bg-orange-500/20 dark:hover:bg-orange-500/30 dark:border-transparent",
        purple:
          "bg-white/75 border-2 border-purple-200 hover:bg-purple-50 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 dark:border-transparent",
        yellow:
          "bg-white/75 border-2 border-yellow-200 hover:bg-yellow-50 dark:bg-yellow-500/20 dark:hover:bg-yellow-500/30 dark:border-transparent",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const textVariants = cva(
  "text-lg font-semibold transition-all duration-300 transform group-hover:scale-105",
  {
    variants: {
      variant: {
        primary: "text-blue-700 dark:text-blue-400",
        orange: "text-orange-700 dark:text-orange-400",
        purple: "text-purple-700 dark:text-purple-400",
        yellow: "text-yellow-700 dark:text-yellow-400",
      },
    },
  },
);

const descVariants = cva(
  "mt-2 text-sm font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        primary:
          "text-gray-600 group-hover:text-blue-700 dark:text-slate-300 dark:group-hover:text-blue-300",
        orange:
          "text-gray-600 group-hover:text-orange-700 dark:text-slate-300 dark:group-hover:text-orange-300",
        purple:
          "text-gray-600 group-hover:text-purple-700 dark:text-slate-300 dark:group-hover:text-purple-300",
        yellow:
          "text-gray-600 group-hover:text-yellow-700 dark:text-slate-300 dark:group-hover:text-yellow-300",
      },
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
  variant = "primary",
  img,
  title,
  description,
  handleClick,
}: HomeCardProps) => {
  return (
    <div className={cardVariants({ variant })} onClick={handleClick}>
      <div className="flex items-start px-2 justify-between h-[120px]">
        <div className="flex items-center">
          <div className="transform transition-transform duration-300 group-hover:scale-110">
            <Image
              src={img}
              alt={title}
              width={40}
              height={40}
              className="object-fill rounded-lg bg-zinc-500/50 dark:bg-transparent"
            />
          </div>
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