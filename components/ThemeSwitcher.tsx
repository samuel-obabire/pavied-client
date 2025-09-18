"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const ThemeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isLightMode = resolvedTheme === "light";
  const isDarkMode = resolvedTheme === "dark";

  return (
    <div className="bg-accent dark:bg-black-2 flex items-center  gap-4 rounded-3xl px-2 py-1">
      <div
        className={cn("rounded-full p-1", {
          "bg-secondary": isLightMode,
        })}
        onClick={() => setTheme("light")}
      >
        <Sun
          className={cn("size-6", isLightMode ? "text-white" : "text-gray-600")}
        />
      </div>

      <div
        className={cn("rounded-full p-1", {
          "bg-secondary": isDarkMode,
        })}
        onClick={() => setTheme("dark")}
      >
        <Moon
          className={cn("size-6", isDarkMode ? "text-white" : "text-gray-600")}
        />
      </div>
    </div>
  );
};

export default ThemeSwitcher;
