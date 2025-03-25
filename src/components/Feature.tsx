import { cn } from "@/lib/utils";
import { featureCard } from "@/constants";
import { Icon } from "@/types";
import React from "react";

interface FeatureProps {
  icon: Icon;
  title: string;
  description: string;
  index: number;
}

export function Feature() {
  return (
    <div className='w-full px-4 py-16 min-h-screen flex flex-col items-center justify-center'>
      <h2 className='text-4xl font-bold text-center mb-10 text-slate-900 dark:text-white'>
        Features
      </h2>
      {featureCard.map((feature, index) => (
        <FeatureBox key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const FeatureBox = ({ title, description, icon, index }: FeatureProps) => {
  return (
    <div
      className={cn(
        "flex flex-col py-10 relative group/feature bg-gray-100/70 dark:bg-slate-900/25 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors",
      )}
    >
      {index < 4 && (
        <div className='opacity-0 group-hover/feature:opacity-100 border-black transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-primary/40 dark:from-primary/30 to-transparent pointer-events-none' />
      )}
      {index >= 4 && (
        <div className='opacity-0 group-hover/feature:opacity-100 border-black transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-b from-primary/20 dark:from-primary/30 to-transparent pointer-events-none' />
      )}
      <div className='mb-4 relative z-10 px-10 text-black dark:text-primary/90 group-hover/feature:text-primary group-hover/feature:dark:text-white'>
        {React.createElement(icon.component, { size: 40 })}
      </div>
      <div className='text-lg font-bold mb-2 relative z-10 px-10'>
        <div className='absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-400 dark:bg-primary/50 group-hover/feature:bg-primary transition-all duration-200 origin-center' />
        <span className='group-hover/feature:translate-x-2 group-hover/feature:text-primary transition duration-200 inline-block text-slate-800 dark:text-slate-100'>
          {title}
        </span>
      </div>
      <p className='text-sm items-start text-start text-slate-600 dark:text-slate-400 group-hover/feature:text-slate-700 dark:group-hover/feature:text-slate-200 max-w-xs z-10 px-10'>
        {description}
      </p>
    </div>
  );
};
