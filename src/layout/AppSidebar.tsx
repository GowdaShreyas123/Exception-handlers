/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useSidebar } from "@/context/SidebarContext";
import UnionIcon from "/brush.svg";

import type { LucideIcon } from "lucide-react";
import { Brain, Upload, BrainCircuit, LogOut,Sparkles } from "lucide-react";

interface SubItem {
  name: string;
  path: string;
  icon?: LucideIcon;
}

interface MenuItem {
  name: string;
  path?: string;
  action?: string;
  icon?: LucideIcon;
  subItems?: SubItem[];
}

// ---------------- MENU ITEMS ----------------
export const navItems: MenuItem[] = [
  {
    name: "Brain Imaging",
    path: "/brainimagining",
    icon: Brain,
  },
  {
    name: "Upload and Predict",
    path: "/upload",
    icon: Upload,
  },
  {
    name: "Visual Dashboard",
    path: "/visual-dashboard",
    icon: BrainCircuit,
  },
   {
    name:'Future Scope',
    path: '/future',
    icon:Sparkles
  },
  {
    name: "Logout",
    action: "logout",     // <-- action based
    icon: LogOut,         // <-- icon
  },
 
];

const Sidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  type SubmenuState = { type: string; index: number } | null;
  type SubMenuHeights = Record<string, number>;
  type SubMenuRefs = Record<string, HTMLDivElement | null>;

  const [openSubmenu, setOpenSubmenu] = useState<SubmenuState>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<SubMenuHeights>({});
  const subMenuRefs = useRef<SubMenuRefs>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  // ✔ LOGOUT HANDLER (USING NAVIGATE)
  const handleLogout = () => {
    Cookies.remove("authToken");
    toast.success("Logged Out Successfully");
    navigate("/landing-page");  // <-- redirect page
  };

  const handleMenuItemClick = (nav: MenuItem) => {
    if (nav.action === "logout") handleLogout();
  };

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const ref = subMenuRefs.current[key];
      if (ref) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: ref.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  // ---------------- RENDER MENU ITEMS ----------------
  const renderMenuItems = (items: MenuItem[], menuType: string) => (
    <ul className="flex flex-col gap-6">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {/* ------------ Parent Item with Action (LOGOUT) ------------ */}
          {nav.action && !nav.subItems && (
            <button
              onClick={() => handleMenuItemClick(nav)}
              className="flex items-center gap-3 w-full px-4 py-4 text-h6 font-medium cursor-pointer text-brandText-primary hover:underline"
            >
              {nav.icon && <nav.icon className="w-5 h-5" />}
              <span className="truncate">{nav.name}</span>
            </button>
          )}

          {/* ------------ Parent Item With Icon (Regular Links) ------------ */}
          {!nav.action && !nav.subItems && nav.path && (
            <Link
              to={nav.path}
              className={`flex items-center gap-3 w-full px-4 py-4 text-h6 font-medium cursor-pointer
                ${
                  isActive(nav.path)
                    ? "text-white bg-brand-primary rounded-2xl"
                    : "text-brandText-primary hover:underline"
                }`}
            >
              {nav.icon && <nav.icon className="w-5 h-5 flex-shrink-0" />}
              <span className="truncate">{nav.name}</span>
            </Link>
          )}

          {/* ------------ Parent Item with Submenu ------------ */}
          {nav.subItems && (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`flex items-center justify-between w-full px-3 py-3 text-h5 font-semibold rounded-lg cursor-pointer 
                ${
                  openSubmenu?.type === menuType && openSubmenu.index === index
                    ? "text-white bg-brand-primary rounded-2xl"
                    : "text-brandText-primary hover:underline"
                }`}
            >
              <div className="flex items-center gap-3">
                {nav.icon && <nav.icon className="w-5 h-5 flex-shrink-0" />}
                <span className="truncate">{nav.name}</span>
              </div>

              <img
                src={UnionIcon}
                alt="Dropdown"
                className={`transition-transform duration-300 w-3 h-3 ${
                  openSubmenu?.type === menuType && openSubmenu.index === index
                    ? "rotate-180"
                    : "rotate-0"
                }`}
              />
            </button>
          )}

          {/* ------------ SUB MENU ITEMS ------------ */}
          {nav.subItems && (
            <div
              ref={(el) => (subMenuRefs.current[`${menuType}-${index}`] = el)}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9 mb-1">
                {nav.subItems.map((sub) => (
                  <li key={sub.name}>
                    <Link
                      to={sub.path}
                      className={`flex items-center gap-3 py-2 px-3 text-h5 rounded-md cursor-pointer
                        ${
                          isActive(sub.path)
                            ? "text-white bg-brand-primary rounded-2xl"
                            : "text-brand-secondary hover:underline"
                        }`}
                    >
                      {sub.icon && <sub.icon className="w-4 h-4" />}
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  // ---------------- SIDEBAR LAYOUT ----------------
  return (
    <aside
      className={`fixed bg-background-app border-r border-secondary-200 left-0 z-50 h-screen px-5 py-8 transition-all duration-300 ease-in-out
      ${isExpanded || isHovered || isMobileOpen ? "w-[280px]" : "w-[100px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className="w-80 absolute left-0 top-[609px] opacity-15 pointer-events-none"
        src="/nuvoai.png"
      />

      <div className="flex flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-130px)]">
        <nav className="mb-6 w-full">{renderMenuItems(navItems, "main")}</nav>
      </div>
    </aside>
  );
};

export default Sidebar;
