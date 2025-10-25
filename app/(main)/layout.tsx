import { AvatarImage, AvatarFallback, Avatar } from "@radix-ui/react-avatar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import MobileHeader from "@/components/MobileHeader";
import Sidebar from "@/components/Sidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const user = await verifySession();

  if (!user) redirect(ROUTES.SIGN_IN);

  return (
    <div className="flex h-[100dvh] flex-1 overflow-hidden max-md:block">
      <MobileHeader />

      <Sidebar />

      <div className="flex-1">
        <header className="bg-white_dark-black-1 sticky top-0 left-0 flex h-14 items-center justify-between  px-4  max-md:hidden">
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

          <ThemeSwitcher />
        </header>

        <main className="flex h-[calc(100dvh-40px)] flex-col space-y-4 px-2 pt-6 md:h-[calc(100dvh-56px)]">
          <div className="overflow-y-auto pb-32">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
