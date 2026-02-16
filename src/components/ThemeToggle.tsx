"use client";

import { Sun, Moon } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function ThemeToggle() {
  const theme = useAuthStore((state) => state.theme);
  const setTheme = useAuthStore((state) => state.setTheme);

  const toggleTheme = () => {
    const nextTheme = theme === "darkretail" ? "lightretail" : "darkretail";
    setTheme(nextTheme);
  };

  return ( 
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      }}
      className="btn btn-ghost btn-xs btn-circle bg-base-content/10 border-base-content/20 hover:bg-primary hover:border-primary text-base-content/60 hover:text-white transition-all duration-300 group flex items-center justify-center min-h-0 h-8 w-8 shrink-0"
      aria-label="Toggle Theme"
      type="button"
    >
      {theme === "darkretail" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
