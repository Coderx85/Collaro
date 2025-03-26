"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label='Toggle theme'
      className='rounded-full border-white/15 xl:text-7xl text-3xl xl:size-10 size-8 hover:bg-primary/20 bg-dark-1/30 dark:bg-white/50 dark:text-black hover:text-primary'
    >
      {theme === "dark" ? (
        <Sun className='text-black text-5xl' height={25} width={25} />
      ) : (
        <Moon className='size-4 text-white text-7xl' />
      )}
    </Button>
  );
}
