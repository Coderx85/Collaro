import { cn } from "@/lib/utils";
import { featureCard } from "@/constants";
import React from "react";
import { IconType } from "react-icons/lib";
import { FaTools } from "react-icons/fa";

export function Feature() {
  return (
    <>
      <div className="relative">
        <h2 className="group/heading text-lg sm:text-xl flex items-center md:text-5xl font-bold gap-4 bg-clip-text text-transparent bg-gradient-to-r from-white/80 to-white/70 dark:from-white dark:to-white/50 hover:from-primary hover:to-white/50 dark:hover:from-white dark:hover:to-primary/50 transition-all duration-300">
          <FaTools className="size-10 dark:text-yellow text-black group-hover/heading:dark:text-white/80 group-hover/heading:text-black/75 group-hover/heading:cursor-pointer transition-all duration-300" />
          <span className="relative dark:text-white text-black group-hover/heading:dark:text-white/80 group-hover/heading:text-black/75 group-hover/heading:cursor-pointer transition-all duration-300">
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
        "flex flex-col py-6 sm:py-8 relative group/feature bg-gray-100/70 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors",
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 border-black transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-primary/40 dark:from-primary/30 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 border-black transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-b from-primary/20 dark:from-primary/30 to-transparent pointer-events-none" />
      )}
      <div className="mb-3 sm:mb-4 relative z-10 px-6 sm:px-10 text-black dark:text-primary group-hover/feature:text-primary group-hover/feature:scale-110 group-hover/feature:dark:text-white transition-all duration-300">
        <Icon className="text-5xl" />
      </div>
      <div className="text-xl sm:text-lg xl:text-lg font-bold mb-1 sm:mb-2 relative z-10 px-6 sm:px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 group-hover/feature:dark:bg-white w-1 rounded-tr-full rounded-br-full bg-neutral-400 dark:bg-primary group-hover/feature:bg-primary transition-all duration-300 origin-center" />
        <span className="group-hover/feature:translate-x-2 group-hover/feature:text-primary transition duration-200 inline-block text-slate-800 dark:text-slate-100">
          {title}
        </span>
      </div>
      <p className="text-xs sm:text-sm md:text-[16px] items-start text-start text-slate-600 dark:text-slate-400 group-hover/feature:text-slate-700 dark:group-hover/feature:text-slate-200 max-w-xs z-10 px-6 sm:px-10">
        {description}
      </p>
      {/* <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent group-hover/feature:via-primary transition-all duration-300 animate-border-flow-reverse" /> */}
    </div>
  );
};
