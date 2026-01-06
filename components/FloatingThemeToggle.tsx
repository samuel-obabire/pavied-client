"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const FloatingThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in zoom-in duration-500">
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="icon"
        className={cn(
          "size-12 rounded-full border-black-1/10 bg-white/80 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 dark:border-white/10 dark:bg-black-2/80",
          "hover:border-secondary/50 group"
        )}
      >
        <div className="relative size-6">
          <Sun className="absolute inset-0 size-6 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 group-hover:text-secondary" />
          <Moon className="absolute inset-0 size-6 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 group-hover:text-secondary" />
        </div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
};

export default FloatingThemeToggle;
