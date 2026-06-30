"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "../ui/toggle";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toggle
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-primary data-[state=on]:*:[svg]:stroke-secondary rounded-full border"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Toggle>
  );
}
