import { Outlet } from "react-router-dom";
import ThemeBtn from "@/components/common/ThemeChanger";

const AuthLayout = () => {
  return (
    <div className="relative flex min-h-screen bg-gradients overflow-hidden perspective-1000">
      {/* Theme button top center */}
      <div className="absolute top-6 left-0 w-full flex justify-center z-30">
        <ThemeBtn />
      </div>

      <Outlet/>
    </div>
  );
};

export default AuthLayout;