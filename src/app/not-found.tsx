"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, SearchIcon, StepBack } from "lucide-react";
import { cn } from "@/lib/utils";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className='relative flex h-screen w-full items-center gap-5 justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'>
      {/* Centered Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center space-y-10 flex flex-col gap-5 border-2 bg-black/70 border-gray-700 p-10 rounded-lg'
      >
        <motion.h1
          className={cn(
            "flex items-center gap-4",
            "text-6xl md:text-8xl font-semibold",
            "bg-gray-800",
            "bg-clip-text text-transparent justify-center object-center",
          )}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SearchIcon className='size-20 font-bold text-gray-800' />
          404
        </motion.h1>
        <p className='text-lg text-gray-300'>
          Oops! The page you&ampre looking for does not exist.
        </p>
        <div className='flex gap-5 justify-center'>
          <Button
            onClick={() => router.back()}
            className='px-3 py-1.5 bg-gradient-to-r flex gap-2 from-gray-500 to-slate-800 hover:from-gray-600 hover:to-slate-900 text-white rounded-lg'
          >
            <StepBack className='size-4 text-white' />
            Go Back
          </Button>

          <Button
            onClick={() => router.push("/")}
            className='px-4 py-2 flex gap-3 bg-gradient-to-bl from-gray-500 to-slate-800 hover:from-gray-600 hover:to-slate-900 text-white rounded-lg'
          >
            <Home className='size-4 text-white' /> Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
