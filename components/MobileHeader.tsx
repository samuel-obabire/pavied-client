import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import MobileSheet from "./MobileSheet";

const MobileHeader = ({ user }: { user: any }) => {
  return (
    <header className="bg-white_dark-black-1 sticky top-0 left-0 flex h-12 w-full items-center justify-between p-4 lg:hidden">
      <Avatar className="size-8 overflow-hidden rounded-full">
        <AvatarImage
          className="h-full w-full object-cover"
          src={user?.image || "https://github.com/shadcn.png"}
          alt={user?.name || "User"}
        />
        <AvatarFallback className="flex h-full w-full items-center justify-center bg-accent text-xs font-bold">
          {user?.name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase() || "CN"}
        </AvatarFallback>
      </Avatar>

      <MobileSheet />
    </header>
  );
};

export default MobileHeader;
