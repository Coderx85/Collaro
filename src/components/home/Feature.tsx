import { cn } from "@/lib/utils";
import { featureCard } from "@/constants";
import React from "react";
import { IconType } from "react-icons/lib";
import { FaTools } from "react-icons/fa";

export function Feature() {
  return (
    <>
      <h2 className="text-lg sm:text-xl flex md:text-4xl font-semibold gap-4 items-center justify-center my-6 md:my-10 text-slate-900 dark:text-white">
        <FaTools className="size-6 dark:text-white text-black" /> Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 relative z-10 py-4 sm:py-6 md:py-10 w-full max-w-7xl mx-auto">
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
        "flex flex-col py-6 sm:py-8 md:py-10 relative group/feature bg-gray-100/70 dark:bg-slate-900/25 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors",
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 border-black transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-primary/40 dark:from-primary/30 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 border-black transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-b from-primary/20 dark:from-primary/30 to-transparent pointer-events-none" />
      )}
      <div className="mb-3 sm:mb-4 relative z-10 px-6 sm:px-10 text-black dark:text-primary/90 group-hover/feature:text-primary group-hover/feature:scale-110 group-hover/feature:dark:text-white">
        <Icon className="text-3xl" />
      </div>
      <div className="text-base sm:text-lg font-bold mb-1 sm:mb-2 relative z-10 px-6 sm:px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 group-hover/feature:dark:bg-white w-1 rounded-tr-full rounded-br-full bg-neutral-400 dark:bg-primary/50 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 group-hover/feature:text-primary transition duration-200 inline-block text-slate-800 dark:text-slate-100">
          {title}
        </span>
      </div>
      <p className="text-xs sm:text-sm items-start text-start text-slate-600 dark:text-slate-400 group-hover/feature:text-slate-700 dark:group-hover/feature:text-slate-200 max-w-xs z-10 px-6 sm:px-10">
        {description}
      </p>
    </div>
  );
};
