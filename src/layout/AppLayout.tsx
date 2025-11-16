import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Fixed full-width header */}
      <div className="sticky top-0 z-50 w-full">
        <AppHeader />
      </div>

      {/* Sidebar + Main content below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <div className="flex-shrink-0">
          <AppSidebar />
          <Backdrop />
        </div>

        {/* Scrollable main content on the right */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out  ${
            isExpanded || isHovered ? "lg:ml-[280px]" : "lg:ml-[100px]"
          } ${isMobileOpen ? "ml-0" : ""} flex relative`}
        >
          <div className="w-full bg-background-app">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
