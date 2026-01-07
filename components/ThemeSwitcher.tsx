"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ThemeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-8 w-[68px]" />;

  return (
    <div className="bg-accent dark:bg-black-2 flex items-center gap-1 rounded-full p-1 border border-transparent dark:border-gray-800">
      {[
        { key: "light", icon: Sun },
        { key: "dark", icon: Moon },
      ].map(({ key, icon: Icon }) => {
        const isActive = resolvedTheme === key;
        return (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={cn(
              "rounded-full p-1.5 transition-all duration-200",
              isActive
                ? "bg-secondary text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            )}
            aria-label={`Switch to ${key} mode`}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
