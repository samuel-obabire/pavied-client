import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { redirect } from "next/navigation";
import MobileHeader from "@/components/MobileHeader";
import Sidebar from "@/components/Sidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const user = await verifySession();

  if (!user) redirect(ROUTES.SIGN_IN);

  return (
    <div className="flex h-[100dvh] flex-1 overflow-hidden max-lg:block">
      <div className="lg:hidden">
        <MobileHeader user={user} />
      </div>

      <Sidebar />

      <div className="flex-1 lg:max-w-[calc(100vw-260px)]">
        <header className="bg-white_dark-black-1 sticky top-0 left-0 flex h-[72px] items-center justify-between border-b border-gray-200 px-8 shadow-sm dark:border-gray-800 max-lg:hidden">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 overflow-hidden rounded-full border border-gray-100 shadow-sm dark:border-gray-800">
              <AvatarImage
                className="h-full w-full object-cover"
                src={user?.image || "https://github.com/shadcn.png"}
                alt={user?.name || "User"}
              />
              <AvatarFallback className="flex h-full w-full items-center justify-center text-sm font-bold">
                {user?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-16-bold text-gray-900 dark:text-white">
                Welcome, {user?.name?.split(" ")[0] ?? "Trader"}
              </h1>
            </div>
          </div>

          <ThemeSwitcher />
        </header>

        <main className="flex h-[calc(100dvh-40px)] flex-col space-y-4 px-4 pt-6 md:px-8 lg:h-[calc(100dvh-72px)]">
          <div className="overflow-y-auto pb-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
