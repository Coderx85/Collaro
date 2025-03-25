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
      className='rounded-full bg-transparent border-white/15 text-7xl size-10 hover:bg-primary/20 hover:text-primary'
    >
      {theme === "dark" ? (
        <Sun className='text-white text-5xl' height={25} width={25} />
      ) : (
        <Moon className='size-4 text-white text-7xl' />
      )}
    </Button>
  );
}
