import { cn } from "@/lib/utils";
import { featureCard } from "@/constants";
import React from "react";
import type { IconType } from "react-icons/lib";
import { FaTools } from "react-icons/fa";

export function Feature() {
  return (
    <>
      <div className="relative">
        <h2 className="group/heading text-3xl flex items-center md:text-5xl font-bold gap-4 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70 dark:from-foreground dark:to-foreground/50 hover:from-primary hover:to-primary/50 transition-all duration-300">
          <FaTools className="size-8 lg:size-10 text-primary dark:text-yellow group-hover/heading:text-primary/80 group-hover/heading:dark:text-yellow/80 group-hover/heading:cursor-pointer transition-all duration-300" />
          <span className="relative text-foreground dark:text-foreground group-hover/heading:text-foreground/80 group-hover/heading:cursor-pointer transition-all duration-300">
            Features
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 relative z-10 py-2 sm:py-6 w-full max-w-7xl mx-auto">
        {featureCard.map((feature, index) => (
          <FeatureBox key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </>
  );
}

const FeatureBox = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: IconType;
  index: number;
}) => {
  const Icon = icon; // Convert IconType to a component
  return (
    <div
      className={cn(
        "flex flex-col py-6 sm:py-8 relative group/feature backdrop-blur-lg hover:bg-accent from-black to-gray-700 dark:from-black dark:to-black transition-all duration-300 "
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-linear-to-t from-black to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-linear-to-b from-black to-transparent pointer-events-none" />
      )}
      <div className="mb-3 sm:mb-4 relative z-10 px-6 sm:px-10 text-primary dark:text-primary group-hover/feature:text-primary group-hover/feature:scale-1 group-hover/feature:dark:text-yellow transition-all duration-300">
        <Icon className="text-5xl" />
      </div>
      <div className="text-xl sm:text-lg xl:text-lg font-bold mb-1 sm:mb-2 relative z-10 px-6 sm:px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-muted-foreground/40 dark:bg-primary group-hover/feature:bg-primary group-hover/feature:dark:bg-yellow transition-all duration-300 origin-center" />
        <span className="group-hover/feature:translate-x-2 group-hover/feature:text-primary group-hover/feature:dark:text-yellow transition duration-200 inline-block text-card-foreground dark:text-foreground">
          {title}
        </span>
      </div>
      <p className="text-xs sm:text-sm md:text-[16px] items-start text-start text-muted-foreground dark:text-muted-foreground group-hover/feature:text-foreground dark:group-hover/feature:text-foreground/90 max-w-xs z-10 px-6 sm:px-10">
        {description}
      </p>
      <div className="absolute bottom-0 h-px w-full bg-linear-to-r from-transparent via-border/30 to-transparent group-hover/feature:via-primary/50 transition-all duration-300" />
    </div>
  );
};
