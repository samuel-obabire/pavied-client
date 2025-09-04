import { AvatarImage, AvatarFallback, Avatar } from "@radix-ui/react-avatar";
import { ReactNode } from "react";

import MobileHeader from "@/components/MobileHeader";
import Sidebar from "@/components/Sidebar";
import { verifySession } from "@/lib/server";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const user = await verifySession();

  return (
    <div className="flex h-screen flex-1 overflow-hidden max-md:block">
      <MobileHeader />

      <Sidebar />

      <div className="flex-1">
        <header className="sticky top-0 left-0 flex h-14 items-center justify-between bg-white  px-4  max-md:hidden">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage
                className="rounded-full"
                src="https://github.com/shadcn.png"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <h1 className="text-14-medium font-medium">
              Welcome, {user?.name?.split(" ")[0] ?? "Trader"} 👋
            </h1>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
