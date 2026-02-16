"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<string>("darkretail");

  useEffect(() => {
    // Initial sync
    const savedTheme = localStorage.getItem("theme") || "darkretail";
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: string) => {
    console.log("Applying theme:", newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // DaisyUI and standard HTML attributes
    document.documentElement.setAttribute("data-theme", newTheme);
    
    // Tailwind "dark" class support
    if (newTheme === "darkretail") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const currentTheme = localStorage.getItem("theme") || "darkretail";
    const nextTheme = currentTheme === "darkretail" ? "lightretail" : "darkretail";
    applyTheme(nextTheme);
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      }}
      className="btn btn-ghost btn-xs btn-circle bg-slate-800/50 border-slate-700 hover:bg-primary hover:border-primary text-slate-400 hover:text-white transition-all duration-300 group flex items-center justify-center min-h-0 h-8 w-8 shrink-0"
      aria-label="Toggle Theme"
      type="button"
    >
      {theme === "darkretail" ? (
        <Sun className="h-4 w-4 text-orange-400 group-hover:text-white" />
      ) : (
        <Moon className="h-4 w-4 text-slate-400 group-hover:text-white" />
      )}
    </button>
  );
}
