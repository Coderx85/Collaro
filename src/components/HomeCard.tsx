"use client";

import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "relative w-full p-4 rounded-xl cursor-pointer transform transition-all duration-300 animate-fade-in group bg-sidebar glassmorphism dark:glassmorphism2 border border-border hover:shadow-md hover:bg-accent/30",
  {
    variants: {
      variant: {
        primary: "",
        orange: "",
        purple: "",
        yellow: "",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
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
  }
);

const descVariants = cva(
  "mt-2 text-sm font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        primary:
          "text-muted-foreground group-hover:text-blue-700 dark:group-hover:text-blue-400",
        orange:
          "text-muted-foreground group-hover:text-orange-700 dark:group-hover:text-orange-400",
        purple:
          "text-muted-foreground group-hover:text-purple-700 dark:group-hover:text-purple-400",
        yellow:
          "text-muted-foreground group-hover:text-yellow-700 dark:group-hover:text-yellow-400",
      },
    },
  }
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
    <div
      className="relative w-full p-4 rounded-xl cursor-pointer transform transition-all duration-300 animate-fade-in group bg-black/25 dark:bg-sidebar hover:dark:bg-sidebar-primary dark:glassmorphism2 border border-border hover:shadow-md hover:bg-sidebar-border"
      onClick={handleClick}
    >
      <div className="flex-between items-start px-2 h-[120px]">
        <div className="flex items-center">
          <div className="transform transition-transform duration-300 group-hover:scale-110">
            <Image
              src={img}
              alt={title}
              width={40}
              height={40}
              className="object-fill [&>svg]:text-black [&>img]:text-black rounded-lg bg-black/5"
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
