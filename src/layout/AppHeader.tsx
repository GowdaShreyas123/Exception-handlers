// src/components/Header.tsx

import React, { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import ThemeBtn from "@/components/common/ThemeChanger";

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAppMenuOpen, setAppMenuOpen] = useState(false);

  // Toggle sidebar for desktop & mobile
  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // Toggle menu
  const toggleAppMenu = () => setAppMenuOpen((prev) => !prev);

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <header className="relative flex w-full sticky top-0 z-50 px-6 py-4 justify-between items-center bg-background-app backdrop-blur-xl border-b border-secondary-200 overflow-hidden">

      {/* ⭐ FUTURISTIC ANIMATED NEURO-WAVE BORDER */}
      <div className="absolute bottom-0 left-0 w-full h-[40px] overflow-hidden pointer-events-none">
        <svg className="w-full h-full animate-pulse" viewBox="0 0 1440 320">
          <path
            fill="url(#grad)"
            fillOpacity="0.4"
            d="M0,224L60,202.7C120,181,240,139,360,144C480,149,600,203,720,240C840,277,960,299,1080,272C1200,245,1320,171,1380,133.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>

          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* LEFT SIDE – Circular Neon Sidebar Button */}
      <button
        onClick={handleSidebarToggle}
        aria-label="Toggle Sidebar"
        className="relative w-11 h-11 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600 transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]"
      >
        {isMobileOpen ? (
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path
              d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="20" height="14" viewBox="0 0 16 12" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.583 1c0-.414.336-.75.75-.75h13.333c.414 0 .75.336.75.75s-.336.75-.75.75H1.333A.75.75 0 0 1 .583 1Zm0 10c0-.414.336-.75.75-.75h13.333c.414 0 .75.336.75.75s-.336.75-.75.75H1.333a.75.75 0 0 1-.75-.75Zm.75-5.75a.75.75 0 0 0 0 1.5h6.667a.75.75 0 0 0 0-1.5H1.333Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>

      {/* CENTER – Branding */}
      <div className="text-center flex-1 hidden lg:block">
        <p className="text-h3 font-semibold tracking-wide bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
          Brain Atlas
        </p>
        <p className="text-h5 text-muted-foreground -mt-1 tracking-widest uppercase">
          Powered by Exception Handlers
        </p>
      </div>

      {/* RIGHT SIDE – Theme + Avatar */}
      <div
        className={`${isAppMenuOpen ? "flex" : "hidden"} lg:flex items-center gap-4`}
        onClick={toggleAppMenu}
      >
        {/* Theme button in glowing pill */}
        <div className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_12px_rgba(59,130,246,0.6)] cursor-pointer">
          <ThemeBtn />
        </div>

      </div>

    </header>
  );
};

export default AppHeader;
