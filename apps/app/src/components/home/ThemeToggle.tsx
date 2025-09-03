"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@repo/design/components/ui/button";
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
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      size={"icon"}
      className="rounded-full border-white/50 border-2 p-1.5 hover:bg-black/50 hover:dark:bg-gray-500/50 dark:text-black"
    >
      {theme === "dark" ? (
        <Sun className="text-yellow-300/75 size-5" />
      ) : (
        <Moon className="size-5 text-white" />
      )}
    </Button>
  );
}
