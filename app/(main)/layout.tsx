import { ReactNode } from "react";

import MobileHeader from "@/components/MobileHeader";
import Sidebar from "@/components/Sidebar";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen flex-1 max-md:block">
      <MobileHeader />

      <Sidebar />

      <div className="flex-1">
        <header className="flex h-14  items-center justify-between bg-white max-md:hidden">
          dfdfjd
        </header>

        <>{children}</>
      </div>
    </div>
  );
};

export default MainLayout;
