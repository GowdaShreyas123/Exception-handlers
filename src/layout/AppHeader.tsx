// src/components/Header.tsx
import React, { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import ThemeBtn from "@/components/common/ThemeChanger";

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAppMenuOpen, setAppMenuOpen] = useState(false);

  // ✅ route config for breadcrumb + page title

  // ✅ toggle sidebar responsively
  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) toggleSidebar();
    else toggleMobileSidebar();
  };

  // ✅ toggle profile/notification section
  const toggleAppMenu = () => setAppMenuOpen((prev) => !prev);

  // ✅ keyboard shortcut (Ctrl + K)
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
    <header className="flex w-full sticky top-0 z-50 bg-background-app border-b border-secondary-200 px-6 py-4 justify-between items-center">
      {/* LEFT: Brand & Sidebar Toggle */}
      <div className="flex items-center gap-3 flex-none">
        <button
          onClick={handleSidebarToggle}
          aria-label="Toggle Sidebar"
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 lg:hidden"
        >
          {isMobileOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.583 1c0-.414.336-.75.75-.75h13.333c.414 0 .75.336.75.75s-.336.75-.75.75H1.333A.75.75 0 0 1 .583 1Zm0 10c0-.414.336-.75.75-.75h13.333c.414 0 .75.336.75.75s-.336.75-.75.75H1.333a.75.75 0 0 1-.75-.75Zm.75-5.75a.75.75 0 0 0 0 1.5h6.667a.75.75 0 0 0 0-1.5H1.333Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>

        <div>
          <p className="text-4xl font-light text-brandText-primary">
            Brain Atlas
          </p>
          <p className="text-h6 font-light text-brandText-secondary">
            Powered by Exception handlers
          </p>
        </div>
      </div>

     

      {/* RIGHT: Theme + Avatar */}
      <div
        className={`${isAppMenuOpen ? "flex" : "hidden"} lg:flex gap-4`}
        onClick={toggleAppMenu}
      >
        <ThemeBtn />

        <div className="flex items-center gap-3">{/* Avatar goes here */}</div>
      </div>
    </header>
  );
};

export default AppHeader;
