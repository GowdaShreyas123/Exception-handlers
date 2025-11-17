import { useEffect, useState } from "react";
import { Sun, Moon, Star, X, Wand2 } from "lucide-react";

const ThemeBtn = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "midnight"
  );

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark", "midnight");
    root.classList.add(theme);

    if (theme === "midnight") {
      root.style.setProperty("--color-icon", "#7137d2");
    } else {
      root.style.setProperty("--color-icon", "#9aa7ba");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      {isDropdownOpen ? (
        <div className="flex items-center space-x-4 px-4">

          {/* LIGHT */}
          <Sun
            size={32}
            onClick={() => setTheme("light")}
            className="cursor-pointer text-yellow-400 hover:scale-110 transition"
          />

          {/* DARK */}
          <Moon
            size={32}
            onClick={() => setTheme("dark")}
            className="cursor-pointer text-gray-300 hover:scale-110 transition"
          />

          {/* MIDNIGHT (custom theme) */}
          <Star
            size={32}
            onClick={() => setTheme("midnight")}
            className="cursor-pointer text-purple-500 hover:scale-110 transition"
          />

          {/* CLOSE DROPDOWN */}
          <X
            size={36}
            onClick={() => setIsDropdownOpen(false)}
            className="cursor-pointer text-red-400 hover:scale-110 transition"
          />
        </div>
      ) : (
        <Wand2
          size={32}
          onClick={toggleDropdown}
          className="cursor-pointer text-(--color-icon) hover:scale-110 transition"
        />
      )}
    </>
  );
};

export default ThemeBtn;
